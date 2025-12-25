# Manual Setup Guide

## Prerequisites Check

Before running the setup, make sure:

1. **PostgreSQL is installed and running**
   - Default port: 5432
   - Default user: postgres
   - Password: syahidKeren123 (as provided)

2. **Node.js is installed**
   - Version 14 or higher
   - Run: `node --version` to check

## Setup Steps

### Method 1: Automated Setup (Recommended)

Simply run the setup script:

```bash
npm run setup
```

This will automatically:
- Generate Prisma Client
- Create database tables
- Seed sample data

### Method 2: Manual Setup

If the automated setup fails, follow these steps:

#### Step 1: Create .env file

```bash
echo "DATABASE_URL=postgresql://postgres:syahidKeren123@localhost:5432/car_workshop?schema=public" > .env
```

Or manually create `.env` file with:
```
DATABASE_URL="postgresql://postgres:syahidKeren123@localhost:5432/car_workshop?schema=public"
```

#### Step 2: Create Database (if not exists)

Connect to PostgreSQL and create the database:

```bash
# Using psql
psql -U postgres
```

Then run:
```sql
CREATE DATABASE car_workshop;
\q
```

Or create it programmatically using Node.js - we've provided a `create-db.js` script.

#### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

#### Step 4: Push Database Schema

```bash
npx prisma db push
```

Alternative (with migration):
```bash
npx prisma migrate dev --name init
```

#### Step 5: Seed Database

```bash
node prisma/seed.js
```

## Troubleshooting

### Issue: "DATABASE_URL" not found

**Solution**: Make sure `.env` file exists in the project root directory

### Issue: PostgreSQL connection failed

**Possible causes:**
1. PostgreSQL service is not running
   - Windows: Check Services for "postgresql" service
   - Start it if stopped

2. Wrong credentials
   - Verify username: postgres
   - Verify password: syahidKeren123
   - Update `.env` if different

3. Wrong database host/port
   - Default is localhost:5432
   - Check if PostgreSQL is running on different port

### Issue: Database "car_workshop" does not exist

**Solution**: Create the database manually:

```bash
# Windows (Command Prompt or PowerShell)
# Navigate to PostgreSQL bin directory, then:
createdb -U postgres car_workshop
```

Or use the provided `create-db.js` script:
```bash
node create-db.js
```

### Issue: Prisma commands show garbled output

This is a display issue with the terminal. The commands are likely working fine. Check the exit code and database state.

## Verification

After setup, verify everything works:

### 1. Check Database Tables

```bash
npx prisma studio
```

This will open a browser with Prisma Studio where you can view all tables and data.

### 2. Test Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

### 3. Test API Endpoints

```bash
# Search vehicles
curl "http://localhost:3000/api/vehicles/search?plate=B"

# Search items  
curl "http://localhost:3000/api/items/search?q=oli"

# Create invoice (use sample-invoice.json)
curl -X POST http://localhost:3000/api/invoices ^
  -H "Content-Type: application/json" ^
  -d @sample-invoice.json
```

## Sample Data

After seeding, you'll have:

- **3 Customers**: Budi Santoso, Siti Nurhaliza, Ahmad Dhani
- **4 Vehicles**: Various cars with plate numbers B 1234 XYZ, etc.
- **8 Products**: Oils, filters, brakes, tires, battery
- **8 Services**: Oil change, brake change, tune up, etc.

## Next Steps

Once setup is complete:

1. Start the server: `npm run dev`
2. Test with Postman/Insomnia or curl
3. Integrate with your React Native frontend
4. Customize as needed

## Support

If you continue to have issues:

1. Check PostgreSQL logs
2. Verify all environment variables
3. Try connecting to PostgreSQL using pgAdmin or another client
4. Make sure no firewall is blocking port 5432
