import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.product.deleteMany();
    await prisma.service.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.customer.deleteMany();

    console.log('✅ Cleared existing data');

    // Seed Customers
    const customers = await prisma.customer.createMany({
        data: [
            {
                name: 'Budi Santoso',
                phone: '08123456789',
                address: 'Jl. Sudirman No. 123, Jakarta'
            },
            {
                name: 'Siti Nurhaliza',
                phone: '08198765432',
                address: 'Jl. Thamrin No. 45, Jakarta'
            },
            {
                name: 'Ahmad Dhani',
                phone: '08567891234',
                address: 'Jl. Gatot Subroto No. 78, Jakarta'
            }
        ]
    });

    console.log('✅ Created customers');
    const allCustomers = await prisma.customer.findMany();

    // Seed Vehicles
    await prisma.vehicle.createMany({
        data: [
            {
                plateNumber: 'B 1234 XYZ',
                model: 'Honda Jazz',
                brand: 'Honda',
                customerId: allCustomers[0].id
            },
            {
                plateNumber: 'B 5678 ABC',
                model: 'Toyota Avanza',
                brand: 'Toyota',
                customerId: allCustomers[0].id
            },
            {
                plateNumber: 'D 9999 DEF',
                model: 'Mitsubishi Canter',
                brand: 'Mitsubishi',
                customerId: allCustomers[1].id
            },
            {
                plateNumber: 'B 1111 GHI',
                model: 'Suzuki Ertiga',
                brand: 'Suzuki',
                customerId: allCustomers[2].id
            }
        ]
    });

    console.log('✅ Created vehicles');

    // Seed Products
    await prisma.product.createMany({
        data: [
            {
                code: 'OIL-001',
                name: 'Oli Shell Helix HX7',
                stock: 24,
                buyPrice: 45000,
                sellPrice: 55000
            },
            {
                code: 'OIL-002',
                name: 'Oli Castrol GTX',
                stock: 15,
                buyPrice: 40000,
                sellPrice: 50000
            },
            {
                code: 'FILTER-001',
                name: 'Filter Oli',
                stock: 30,
                buyPrice: 15000,
                sellPrice: 25000
            },
            {
                code: 'BRAKE-001',
                name: 'Kampas Rem Depan',
                stock: 12,
                buyPrice: 150000,
                sellPrice: 200000
            }
        ]
    });

    console.log('✅ Created products');

    // Seed Services
    await prisma.service.createMany({
        data: [
            { name: 'Jasa Ganti Oli', price: 25000 },
            { name: 'Jasa Service Berkala', price: 150000 },
            { name: 'Jasa Ganti Kampas Rem', price: 75000 },
            { name: 'Jasa Tune Up', price: 200000 },
            { name: 'Jasa Ganti Ban', price: 50000 },
            { name: 'Jasa Cuci Mobil', price: 35000 }
        ]
    });

    console.log('✅ Created services');
    console.log('\n🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
