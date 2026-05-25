# 📡 API Reference — AI-Powered Billing Management

**Base URL:** `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new shop owner |
| POST | `/auth/login` | ❌ | Login and get JWT token |
| GET | `/auth/me` | ✅ | Get current logged-in user |
| PUT | `/auth/darkmode` | ✅ | Toggle dark mode preference |

### POST /auth/register
```json
Request Body:
{
  "shopName": "Sharma General Store",
  "ownerName": "Raj Sharma",
  "email": "raj@sharma.com",
  "password": "secret123",
  "phone": "9876543210",
  "address": "MG Road, Surat"
}

Response 201:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "shopName": "...", "email": "..." }
  }
}
```

### POST /auth/login
```json
Request Body:
{ "email": "raj@sharma.com", "password": "secret123" }

Response 200:
{
  "success": true,
  "data": { "token": "eyJhbGci...", "user": { "darkMode": false, ... } }
}
```

---

## 📦 Products (Inventory)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | ✅ | Get all products (with filters) |
| POST | `/products` | ✅ | Add new product |
| GET | `/products/:id` | ✅ | Get single product |
| PUT | `/products/:id` | ✅ | Update product |
| DELETE | `/products/:id` | ✅ | Soft-delete product |
| GET | `/products/categories` | ✅ | Get all unique categories |

### Query Parameters for GET /products
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | string | `?search=rice` | Search by product name |
| `category` | string | `?category=Dairy` | Filter by category |
| `lowStock` | boolean | `?lowStock=true` | Only low-stock items |
| `expired` | boolean | `?expired=true` | Only expired items [Innovation] |

### POST /products — Request Body
```json
{
  "name": "Basmati Rice",
  "sku": "RICE001",
  "category": "Grains",
  "price": 250,
  "quantity": 100,
  "lowStockThreshold": 10,
  "expiryDate": "2025-12-31",
  "unit": "kg",
  "description": "Premium quality"
}
```

---

## 🧾 Bills (Invoices)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bills` | ✅ | Get all bills (paginated) |
| POST | `/bills` | ✅ | Create new draft bill |
| GET | `/bills/:id` | ✅ | Get single bill |
| PUT | `/bills/:id/finalize` | ✅ | Finalize bill + sync inventory |
| PUT | `/bills/:id/cancel` | ✅ | Cancel a draft bill |

### POST /bills — Request Body
```json
{
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "paymentMethod": "upi",
  "taxRate": 5,
  "discount": 20,
  "notes": "Regular customer",
  "items": [
    { "product": "64a1...", "productName": "Rice", "quantity": 2, "unitPrice": 250 },
    { "productName": "Sugar", "quantity": 1, "unitPrice": 45 }
  ]
}
```

### GET /bills — Query Parameters
| Param | Example | Description |
|-------|---------|-------------|
| `status` | `?status=finalized` | Filter: draft / finalized / cancelled |
| `startDate` | `?startDate=2024-01-01` | Filter from date |
| `endDate` | `?endDate=2024-12-31` | Filter to date |
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Items per page (default: 20) |

### Bill Response Object
```json
{
  "billNumber": "BILL-1717000000-0001",
  "customerName": "John Doe",
  "items": [...],
  "subtotal": 545,
  "taxRate": 5,
  "taxAmount": 27.25,
  "discount": 20,
  "totalAmount": 552.25,
  "paymentMethod": "upi",
  "status": "finalized"
}
```

---

## 🔍 OCR — Bill Scanner

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ocr/scan` | ✅ | Scan bill image with Tesseract OCR |

### POST /ocr/scan
```
Content-Type: multipart/form-data
Field name: billImage
Accepted types: jpeg, jpg, png, webp
Max size: 5MB
```

### Response
```json
{
  "success": true,
  "data": {
    "rawText": "Sharma Store\n12/05/2024\nRice 2 50.00\nSugar 1 40.00",
    "parsed": {
      "shopName": "Sharma Store",
      "date": "12/05/2024",
      "items": [
        { "productName": "Rice", "quantity": 2, "unitPrice": 50, "total": 100 },
        { "productName": "Sugar", "quantity": 1, "unitPrice": 40, "total": 40 }
      ]
    },
    "imagePath": "./uploads/bill-1717000000.jpg"
  }
}
```

---

## 📄 PDF Invoice

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/pdf/invoice/:id` | ✅ | Download PDF invoice for a bill |

Returns a binary PDF stream with:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice-BILL-xxx.pdf"
```

---

## 📊 Dashboard Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/summary` | ✅ | Today's revenue, counts, alerts |
| GET | `/dashboard/revenue` | ✅ | Daily revenue data (for charts) |
| GET | `/dashboard/top-products` | ✅ | Top-selling products |

### GET /dashboard/summary — Response
```json
{
  "todayRevenue": 4520.50,
  "totalBills": 128,
  "totalProducts": 45,
  "lowStockCount": 3,
  "expiringSoonCount": 2
}
```

### GET /dashboard/revenue — Query Params
| Param | Example | Description |
|-------|---------|-------------|
| `days` | `?days=7` | Number of past days (default: 7) |

### Response (for Bar Chart)
```json
[
  { "_id": "2024-05-10", "revenue": 1250.00, "billCount": 8 },
  { "_id": "2024-05-11", "revenue": 980.50,  "billCount": 6 }
]
```

### GET /dashboard/top-products — Response
```json
[
  { "_id": "Basmati Rice", "totalSold": 45, "totalRevenue": 11250 },
  { "_id": "Toor Dal",     "totalSold": 38, "totalRevenue": 3420 }
]
```

---

## ⚠️ Error Response Format

All errors return:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 404 | Resource not found |
| 500 | Internal Server Error |
