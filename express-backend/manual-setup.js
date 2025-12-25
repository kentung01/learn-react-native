// Simple alternative setup - run commands manually
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import pkg from 'pg';
const { Client } = pkg;

async function manualSetup() {
    console.log('🚀 Manual Setup - Car Workshop Database');
    console.log('========================================\n');

    // Step 1: Test PostgreSQL connection
    console.log('1️⃣ Testing PostgreSQL connection...');
    const pgClient = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'car_workshop',
        password: 'syahidKeren123',
        port: 5432,
    });

    try {
        await pgClient.connect();
        console.log('✅ Successfully connected to PostgreSQL');

        const result = await pgClient.query('SELECT version()');
        console.log(`✅ PostgreSQL version: ${result.rows[0].version.split(' ')[1]}`);

    } catch (error) {
        console.error('❌ Failed to connect to PostgreSQL');
        console.error('Error:', error.message);
        console.log('\nPlease make sure:');
        console.log('1. PostgreSQL is running');
        console.log('2. Database "car_workshop" exists');
        console.log('3. Credentials are correct (user: postgres, password: syahidKeren123)');
        process.exit(1);
    } finally {
        await pgClient.end();
    }

    // Step 2: Create tables using raw SQL
    console.log('\n2️⃣ Creating database tables...');
    const prisma = new PrismaClient();

    try {
        // Create tables in order (no foreign keys first, then tables with foreign keys)

        // Customers table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) UNIQUE,
        address TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Vehicles table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        "plateNumber" VARCHAR(255) UNIQUE NOT NULL,
        model VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        "customerId" INTEGER REFERENCES customers(id)
      );
    `);

        // Products table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        "buyPrice" DECIMAL(10, 2) NOT NULL DEFAULT 0,
        "sellPrice" DECIMAL(10, 2) NOT NULL
      );
    `);

        // Services table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );
    `);

        // Invoices table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        "invoiceNumber" VARCHAR(255) UNIQUE NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "customerId" INTEGER NOT NULL REFERENCES customers(id),
        "vehicleId" INTEGER NOT NULL REFERENCES vehicles(id),
        "totalAmount" DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        "grandTotal" DECIMAL(10, 2) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'UNPAID',
        "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Invoice Items table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        "invoiceId" INTEGER NOT NULL REFERENCES invoices(id),
        "productId" INTEGER REFERENCES products(id),
        "serviceId" INTEGER REFERENCES services(id),
        "itemName" VARCHAR(255) NOT NULL,
        qty INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
      );
    `);

        console.log('✅ All tables created successfully');

    } catch (error) {
        // If error is "already exists", that's fine
        if (error.message.includes('already exists')) {
            console.log('ℹ️  Tables already exist, skipping creation');
        } else {
            console.error('❌ Error creating tables:', error.message);
            await prisma.$disconnect();
            process.exit(1);
        }
    }

    // Step 3: Seed database
    console.log('\n3️⃣ Seeding database...');
    try {
        // Check if data already exists
        const customerCount = await prisma.customer.count();

        if (customerCount > 0) {
            console.log('ℹ️  Database already contains data, skipping seed');
        } else {
            // Run seed script
            execSync('node prisma/seed.js', { stdio: 'inherit' });
        }

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        await prisma.$disconnect();
        process.exit(1);
    }

    await prisma.$disconnect();

    console.log('\n========================================');
    console.log('🎉 Setup completed successfully!');
    console.log('========================================');
    console.log('\n📊 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Test the API endpoints\n');
}

manualSetup().catch(console.error);
