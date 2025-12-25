// Create database if it doesn't exist
import pkg from 'pg';
const { Client } = pkg;

async function createDatabase() {
    // Connect to 'postgres' default database to create our database
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres', // Connect to default postgres database
        password: 'syahidKeren123',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // Check if database exists
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'car_workshop'"
        );

        if (result.rows.length === 0) {
            console.log('📦 Creating database "car_workshop"...');
            await client.query('CREATE DATABASE car_workshop');
            console.log('✅ Database "car_workshop" created successfully');
        } else {
            console.log('ℹ️  Database "car_workshop" already exists');
        }
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
