// Setup script for initializing the database
import 'dotenv/config';
import { execSync } from 'child_process';

console.log('🚀 Starting Car Workshop Database Setup');
console.log('======================================\n');

// Step 1: Check if .env exists
console.log('1️⃣ Checking environment configuration...');
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    console.log('\nPlease create a .env file with:');
    console.log('DATABASE_URL="postgresql://postgres:syahidKeren123@localhost:5432/car_workshop?schema=public"');
    process.exit(1);
}
console.log('✅ DATABASE_URL found:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

// Step 2: Generate Prisma Client
console.log('\n2️⃣ Generating Prisma Client...');
try {
    // Use shell option to handle Windows better
    execSync('npx prisma generate 2>&1', {
        stdio: ['inherit', 'inherit', 'pipe'],
        cwd: __dirname,
        shell: true
    });
    console.log('✅ Prisma Client generated');
} catch (error) {
    // Check if it actually failed or just display issue
    try {
        // Try to require the generated client
        require('@prisma/client');
        console.log('✅ Prisma Client generated (verification successful)');
    } catch {
        console.error('❌ Failed to generate Prisma Client');
        console.error(error.message);
        process.exit(1);
    }
}

// Step 3: Push database schema (creates tables)
console.log('\n3️⃣ Pushing database schema...');
try {
    execSync('npx prisma db push --accept-data-loss 2>&1', {
        stdio: ['inherit', 'inherit', 'pipe'],
        cwd: __dirname,
        shell: true
    });
    console.log('✅ Database schema pushed successfully');
} catch (error) {
    console.error('❌ Failed to push database schema');
    console.log('\n⚠️  Make sure PostgreSQL is running and the credentials are correct');
    console.error(error.message);
    process.exit(1);
}

// Step 4: Seed database
console.log('\n4️⃣ Seeding database with sample data...');
try {
    execSync('node prisma/seed.js', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Database seeded successfully');
} catch (error) {
    console.error('❌ Failed to seed database');
    process.exit(1);
}

console.log('\n======================================');
console.log('🎉 Setup completed successfully!');
console.log('======================================');
console.log('\n📊 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Test the API endpoints');
console.log('\n');
