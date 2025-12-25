# Car Workshop Backend API

Backend API untuk aplikasi bengkel mobil dengan fitur **Hybrid Input** menggunakan Node.js, Express, dan Prisma ORM.

## 🚀 Features

- **Hybrid Customer/Vehicle Input**: Auto-detect atau buat customer/vehicle baru on-the-fly
- **Hybrid Items Input**: Pilih product/service dari master data atau input manual
- **Stock Management**: Otomatis mengurangi stok saat transaksi
- **Invoice Snapshot**: Simpan harga sebagai snapshot (tidak berubah jika master data berubah)
- **RESTful API**: Endpoint lengkap untuk vehicle search, items search, dan invoice creation

## 📋 Prerequisites

- Node.js (v14 atau lebih baru)
- PostgreSQL database
- npm atau yarn

## 🛠️ Installation

1. Clone atau copy project ini

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` menjadi `.env` dan sesuaikan dengan konfigurasi database Anda:
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/car_workshop?schema=public"
```

4. Generate Prisma Client dan jalankan migration:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. (Optional) Seed database dengan sample data:
```bash
node prisma/seed.js
```

## 🏃‍♂️ Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### 1. Search Vehicle (Autocomplete)
```
GET /api/vehicles/search?plate=<query>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "plateNumber": "B 1234 XYZ",
      "model": "Honda Jazz",
      "brand": "Honda",
      "customer": {
        "id": 1,
        "name": "Budi Santoso",
        "phone": "08123456789"
      }
    }
  ]
}
```

### 2. Search Items (Products & Services)
```
GET /api/items/search?q=<query>
```

**Response:**
```json
{
  "data": [
    {
      "type": "PRODUCT",
      "id": 1,
      "name": "Oli Shell Helix",
      "price": 55000,
      "stock": 24,
      "code": "OIL-001"
    },
    {
      "type": "SERVICE",
      "id": 1,
      "name": "Jasa Ganti Oli",
      "price": 25000,
      "stock": null,
      "code": null
    }
  ]
}
```

### 3. Create Invoice (Hybrid)
```
POST /api/invoices
```

**Request Body:**
```json
{
  "plateNumber": "B 9999 NEW",
  "vehicleModel": "Toyota Avanza",
  "vehicleBrand": "Toyota",
  "customerName": "Pak Asep",
  "customerPhone": "0812999999",
  "customerAddress": "Jl. Kenangan No. 1",
  "items": [
    {
      "type": "PRODUCT",
      "refId": 1,
      "name": "Oli Shell Helix",
      "qty": 2,
      "price": 55000
    },
    {
      "type": "SERVICE",
      "refId": 1,
      "name": "Jasa Ganti Oli",
      "qty": 1,
      "price": 25000
    },
    {
      "type": "MANUAL",
      "refId": null,
      "name": "Jasa Las Knalpot Custom",
      "qty": 1,
      "price": 100000
    }
  ],
  "discount": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-20241225-001",
    "customer": {
      "name": "Pak Asep",
      "plateNumber": "B 9999 NEW"
    },
    "grandTotal": 235000
  }
}
```

### 4. Get Invoice Details
```
GET /api/invoices/:id
```

### 5. Get All Invoices
```
GET /api/invoices?page=1&limit=10&status=UNPAID
```

## 🎯 Hybrid Logic Explained

1. **Vehicle/Customer**: 
   - Jika `plateNumber` sudah ada → gunakan data existing
   - Jika `plateNumber` baru → buat Customer & Vehicle baru

2. **Items**:
   - `type: "PRODUCT"` → gunakan `refId` untuk link ke Product, kurangi stock
   - `type: "SERVICE"` → gunakan `refId` untuk link ke Service
   - `type: "MANUAL"` → tidak link ke master data (custom item)

3. **Snapshot**:
   - Harga dan nama item disimpan di `InvoiceItem`
   - Jika harga master data berubah, invoice lama tidak terpengaruh

## 🗄️ Database Schema

Lihat `prisma/schema.prisma` untuk detail lengkap schema database.

## 📝 Testing

Gunakan Postman, Insomnia, atau curl untuk testing API endpoints.

Contoh dengan curl:
```bash
# Search vehicle
curl "http://localhost:3000/api/vehicles/search?plate=B"

# Search items
curl "http://localhost:3000/api/items/search?q=oli"

# Create invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d @invoice-sample.json
```

## 📄 License

MIT
