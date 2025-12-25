import { PrismaClient } from '@prisma/client';

async function testConnection() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Testing database connection...');

        // Try to connect to the database
        await prisma.$connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT version()`;
        console.log('✅ Database is responding');
        console.log('PostgreSQL Version:', result[0].version);

    } catch (error) {
        console.error('❌ Failed to connect to database:');
        console.error(error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
