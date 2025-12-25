import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// Utility Functions
// ========================================

/**
 * Generate unique invoice number based on date
 * Format: INV-YYYYMMDD-XXX
 */
async function generateInvoiceNumber() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  // Count invoices created today
  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: {
        startsWith: `INV-${dateStr}`
      }
    }
  });

  const sequence = String(count + 1).padStart(3, '0');
  return `INV-${dateStr}-${sequence}`;
}

// ========================================
// API ENDPOINTS
// ========================================

/**
 * 1. Search Vehicle (Autocomplete)
 * GET /api/vehicles/search?plate=B123
 */
app.get('/api/vehicles/search', async (req, res) => {
  try {
    const { plate } = req.query;

    if (!plate) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "plate" is required'
      });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        plateNumber: {
          contains: plate,
          mode: 'insensitive'
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      take: 10 // Limit results for autocomplete
    });

    res.json({
      data: vehicles
    });

  } catch (error) {
    console.error('Error searching vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * 2. Search Items (Products & Services)
 * GET /api/items/search?q=oli
 */
app.get('/api/items/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required'
      });
    }

    // Search products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            code: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 10
    });

    // Search services
    const services = await prisma.service.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      take: 10
    });

    // Format products
    const productResults = products.map(p => ({
      type: 'PRODUCT',
      id: p.id,
      name: p.name,
      price: p.sellPrice,
      stock: p.stock,
      code: p.code
    }));

    // Format services
    const serviceResults = services.map(s => ({
      type: 'SERVICE',
      id: s.id,
      name: s.name,
      price: s.price,
      stock: null,
      code: null
    }));

    // Merge and return
    res.json({
      data: [...productResults, ...serviceResults]
    });

  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * 3. Create Invoice (HYBRID LOGIC)
 * POST /api/invoices
 */
app.post('/api/invoices', async (req, res) => {
  try {
    const {
      date,
      plateNumber,
      vehicleModel,
      vehicleBrand,
      customerName,
      customerPhone,
      customerAddress,
      items,
      discount = 0
    } = req.body;

    // Validate required fields
    if (!plateNumber) {
      return res.status(400).json({
        success: false,
        message: 'plateNumber is required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items array is required and must not be empty'
      });
    }

    // Use Prisma Transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Find or Create Vehicle & Customer
      let vehicle = await tx.vehicle.findUnique({
        where: { plateNumber },
        include: { customer: true }
      });

      let customer;

      if (!vehicle) {
        // Vehicle doesn't exist - Create new customer and vehicle

        // Check if phone exists in another customer
        let existingCustomer = null;
        if (customerPhone) {
          existingCustomer = await tx.customer.findUnique({
            where: { phone: customerPhone }
          });
        }

        if (existingCustomer) {
          // Use existing customer
          customer = existingCustomer;
        } else {
          // Create new customer
          customer = await tx.customer.create({
            data: {
              name: customerName || 'Unknown Customer',
              phone: customerPhone || null,
              address: customerAddress || null
            }
          });
        }

        // Create new vehicle
        vehicle = await tx.vehicle.create({
          data: {
            plateNumber,
            model: vehicleModel || 'Unknown Model',
            brand: vehicleBrand || null,
            customerId: customer.id
          }
        });
      } else {
        // Vehicle exists - use the associated customer
        customer = vehicle.customer;

        // If customer data is provided but vehicle has no customer, update it
        if (!customer && (customerName || customerPhone)) {
          // Check if phone exists
          let existingCustomer = null;
          if (customerPhone) {
            existingCustomer = await tx.customer.findUnique({
              where: { phone: customerPhone }
            });
          }

          if (existingCustomer) {
            customer = existingCustomer;
            // Link vehicle to existing customer
            await tx.vehicle.update({
              where: { id: vehicle.id },
              data: { customerId: customer.id }
            });
          } else {
            // Create new customer
            customer = await tx.customer.create({
              data: {
                name: customerName || 'Unknown Customer',
                phone: customerPhone || null,
                address: customerAddress || null
              }
            });

            // Link vehicle to new customer
            await tx.vehicle.update({
              where: { id: vehicle.id },
              data: { customerId: customer.id }
            });
          }
        }
      }

      // Step 2: Calculate totals and validate items
      let totalAmount = 0;
      const processedItems = [];

      for (const item of items) {
        const { type, refId, name, qty, price } = item;

        if (!name || !qty || !price) {
          throw new Error('Each item must have name, qty, and price');
        }

        const subtotal = parseFloat(price) * parseInt(qty);
        totalAmount += subtotal;

        // Validate stock for products
        if (type === 'PRODUCT' && refId) {
          const product = await tx.product.findUnique({
            where: { id: parseInt(refId) }
          });

          if (!product) {
            throw new Error(`Product with ID ${refId} not found`);
          }

          if (product.stock < qty) {
            throw new Error(`Insufficient stock for ${name}. Available: ${product.stock}, Requested: ${qty}`);
          }

          // Decrement stock
          await tx.product.update({
            where: { id: parseInt(refId) },
            data: {
              stock: {
                decrement: parseInt(qty)
              }
            }
          });
        }

        processedItems.push({
          type,
          refId: refId ? parseInt(refId) : null,
          name,
          qty: parseInt(qty),
          price: parseFloat(price),
          subtotal
        });
      }

      const grandTotal = totalAmount - parseFloat(discount);

      // Step 3: Generate invoice number
      const invoiceNumber = await generateInvoiceNumber();

      // Step 4: Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          date: date ? new Date(date) : new Date(),
          customerId: customer.id,
          vehicleId: vehicle.id,
          totalAmount,
          discount: parseFloat(discount),
          grandTotal,
          status: 'UNPAID'
        }
      });

      // Step 5: Create Invoice Items
      for (const item of processedItems) {
        await tx.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.type === 'PRODUCT' ? item.refId : null,
            serviceId: item.type === 'SERVICE' ? item.refId : null,
            itemName: item.name,
            qty: item.qty,
            price: item.price,
            subtotal: item.subtotal
          }
        });
      }

      return {
        invoice,
        customer,
        vehicle
      };
    });

    // Step 6: Return success response
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        id: result.invoice.id,
        invoiceNumber: result.invoice.invoiceNumber,
        customer: {
          name: result.customer.name,
          plateNumber: result.vehicle.plateNumber
        },
        grandTotal: result.invoice.grandTotal
      }
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      error: error.message
    });
  }
});

/**
 * BONUS: Get Invoice Details
 * GET /api/invoices/:id
 */
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        vehicle: true,
        items: {
          include: {
            product: true,
            service: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * BONUS: Get All Invoices
 * GET /api/invoices
 */
app.get('/api/invoices', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = status ? { status } : {};

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          vehicle: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET  /api/vehicles/search?plate=<query>`);
  console.log(`   - GET  /api/items/search?q=<query>`);
  console.log(`   - POST /api/invoices`);
  console.log(`   - GET  /api/invoices/:id`);
  console.log(`   - GET  /api/invoices`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
