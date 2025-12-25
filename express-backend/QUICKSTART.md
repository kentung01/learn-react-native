# Quick Start Guide - Car Workshop Backend

## What Has Been Done

✅ **Complete Backend Implementation:**
- Express.js server with all API endpoints
- Prisma ORM with PostgreSQL schema
- Database "car_workshop" created successfully  
- Seed data script with sample customers, vehicles, products, and services
- Comprehensive error handling
- Full CORS support

✅ **API Endpoints:**
1. `GET /api/vehicles/search?plate=<query>` - Autocomplete vehicle search
2. `GET /api/items/search?q=<query>` - Search products and services
3. `POST /api/invoices` - Create invoice with hybrid logic
4. `GET /api/invoices` - List all invoices with pagination
5. `GET /api/invoices/:id` - Get invoice details

✅ **Hybrid Logic Implemented:**
- Auto-detect existing vehicles OR create new ones
- Select existing products/services OR input manual items
- Auto-fill prices BUT allow manual override
- Stock management with automatic decrement
- Price snapshot (invoice prices don't change if master prices change)

## ⚠️ IMPORTANT: Final Setup Steps

Due to Windows terminal display issues with Prisma CLI, you need to complete these manual steps:

### Step 1: Verify .env File

Make sure `.env` file contains (recreate if needed):
```
DATABASE_URL="postgresql://postgres:syahidKeren123@localhost:5432/car_workshop?schema=public"
```

You can create it manually or run:
```powershell
Set-Content .env 'DATABASE_URL="postgresql://postgres:syahidKeren123@localhost:5432/car_workshop?schema=public"'
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

**Note:** You might see garbled output in the terminal, but if it completes without throwing an error, it worked.

### Step 3: Push Database Schema

```bash
npx prisma db push
```

This creates all the database tables.

### Step 4: Seed the Database

```bash
node prisma/seed.js
```

This populates the database with sample data:
- 3 Customers
- 4 Vehicles  
- 8 Products (oils, filters, brakes, etc.)
- 8 Services (oil change, tune up, etc.)

### Step 5: Start the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Testing the API

### Test 1: Search Vehicles
```bash
curl "http://localhost:3000/api/vehicles/search?plate=B"
```

Expected: Returns vehicles with plate numbers containing "B"

### Test 2: Search Items
```bash
curl "http://localhost:3000/api/items/search?q=oli"
```

Expected: Returns products and services matching "oli"

### Test 3: Create Invoice with Existing Vehicle
```bash
curl -X POST http://localhost:3000/api/invoices ^
  -H "Content-Type: application/json" ^
  -d "{\"plateNumber\":\"B 1234 XYZ\",\"items\":[{\"type\":\"PRODUCT\",\"refId\":1,\"name\":\"Oli Shell Helix\",\"qty\":2,\"price\":55000}],\"discount\":0}"
```

Expected: Creates invoice for existing vehicle

### Test 4: Create Invoice with NEW Vehicle (Hybrid Feature)
```bash
curl -X POST http://localhost:3000/api/invoices ^
  -H "Content-Type: application/json" ^
  -d @sample-invoice.json
```

This uses the provided `sample-invoice.json` which demonstrates:
- Creating a new customer ("Pak Asep")
- Creating a new vehicle ("B 9999 NEW")
- Mix of product, service, and manual items
- Price override capability

Expected: Creates new customer, new vehicle, and invoice all in one transaction

## Viewing Data

Option 1: Use Prisma Studio (GUI)
```bash
npx prisma studio
```

Option 2: Use pgAdmin or any PostgreSQL client

## File Structure

```
express-backend/
├── server.js              # Main Express server with all endpoints
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Sample data
├── .env                   # Database connection (DO NOT COMMIT)
├── .env.example           # Example environment file
├── create-db.js           # Database creation script
├── setup.js               # Automated setup script
├── manual-setup.js        # Alternative setup
├── setup.bat              # Windows batch setup
├── test-connection.js     # Connection test utility
├── sample-invoice.json    # Sample invoice payload
├── README.md              # Full documentation
├── SETUP.md               # Detailed setup guide
└── QUICKSTART.md          # This file
```

## Troubleshooting

### Prisma CLI shows garbled text
This is a known display issue in Windows terminals. Commands still work - check the exit code and database state.

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### "Database does not exist"
Run: `node create-db.js`

### "Connection refused"
Make sure PostgreSQL is running and credentials are correct.

## Next Steps

1. Complete the manual setup steps above
2. Test all API endpoints
3. Integrate with your React Native frontend
4. Customize business logic as needed
5. Add authentication/authorization if required
6. Deploy to production server

## Support Files

- **README.md**: Complete API documentation
- **SETUP.md**: Detailed setup with all alternatives
- **sample-invoice.json**: Ready-to-use test payload

---

🎉 **Your backend is ready! Just complete the Prisma setup and start coding!**
