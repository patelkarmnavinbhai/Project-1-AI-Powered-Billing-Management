# 🏗️ Backend Architecture — AI-Powered Billing Management

## Overview

This backend follows a **Layered MVC Architecture** built on Node.js + Express.js.
Each layer has a single responsibility, making the codebase maintainable and testable.

```
Client (Frontend / Postman)
        │
        ▼
┌─────────────────────────┐
│     Express Router       │  ← Routes layer: maps URLs to controllers
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Auth Middleware (JWT)   │  ← Validates Bearer token on protected routes
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│      Controllers         │  ← Handles request/response, calls services
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│       Services           │  ← Core business logic (OCR, PDF, WhatsApp, etc.)
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│    Models (Mongoose)     │  ← Database schemas and queries
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│       MongoDB            │  ← Persistent data store
└─────────────────────────┘
```

---

## Folder Structure

```
billing-backend/
│
├── server.js                  # App entry point, Express init, route mounting
│
├── config/
│   ├── db.js                  # MongoDB connection
│   └── multer.js              # File upload configuration
│
├── models/
│   ├── User.js                # Shop owner schema
│   ├── Product.js             # Inventory item schema
│   └── Bill.js                # Invoice/transaction schema
│
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── bill.routes.js
│   ├── ocr.routes.js
│   ├── pdf.routes.js
│   └── dashboard.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── bill.controller.js
│   ├── ocr.controller.js
│   ├── pdf.controller.js
│   └── dashboard.controller.js
│
├── middleware/
│   ├── auth.middleware.js     # JWT verification
│   └── error.middleware.js    # Global error handler
│
├── services/
│   ├── ocr.service.js         # Tesseract OCR processing
│   ├── imageProcessor.service.js  # Sharp image enhancement
│   ├── inventorySync.service.js   # Auto stock deduction
│   ├── pdfGenerator.service.js    # PDFKit invoice builder
│   └── whatsapp.service.js        # Twilio WhatsApp sender [Innovation]
│
├── utils/
│   ├── responseHelper.js      # Standard API response format
│   ├── tokenHelper.js         # JWT generate/verify
│   ├── dateHelper.js          # Date formatting, currency
│   └── ocrParser.js           # OCR text → structured data
│
├── innovation/
│   ├── README.md              # Innovation Zone documentation
│   ├── whatsapp.demo.js       # WhatsApp demo script
│   └── expiryTracker.demo.js  # Expiry tracker demo script
│
├── tests/
│   ├── auth.test.js
│   ├── bill.test.js
│   └── ocr.test.js
│
├── uploads/                   # Uploaded bill images (gitignored)
├── docs/                      # All project documentation
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js v18+ | JavaScript server environment |
| Framework | Express.js 4.x | HTTP routing and middleware |
| Database | MongoDB + Mongoose | NoSQL data storage |
| Authentication | JWT + bcryptjs | Stateless auth, password hashing |
| OCR Engine | Tesseract.js | Optical character recognition |
| Image Processing | Sharp | Image enhancement for OCR |
| PDF Generation | PDFKit | Professional invoice PDFs |
| File Upload | Multer | Multipart form handling |
| WhatsApp | Twilio API | Receipt delivery [Innovation] |
| Testing | Jest + Supertest | Unit and integration tests |
| Dev Server | Nodemon | Auto-restart on file changes |

---

## Data Flow — Bill Creation with OCR

```
1. User uploads bill image
        │
        ▼
2. Multer saves image to /uploads/
        │
        ▼
3. Sharp preprocesses image (grayscale → normalize → sharpen → binarize)
        │
        ▼
4. Tesseract.js extracts raw text
        │
        ▼
5. ocrParser.js parses: shopName, date, items[]
        │
        ▼
6. Frontend displays parsed data for review
        │
        ▼
7. User confirms → POST /api/bills (creates draft)
        │
        ▼
8. PUT /api/bills/:id/finalize
        │
        ├─▶ inventorySync.service.js deducts stock quantities
        │
        ├─▶ Bill status set to "finalized"
        │
        └─▶ (Optional) whatsapp.service.js sends receipt to customer
```

---

## Security Model

- All routes except `/api/auth/login` and `/api/auth/register` require a valid JWT
- Passwords are hashed with bcrypt (salt rounds: 10) before storage
- Each shop owner can only access their own products and bills (owner-scoped queries)
- File uploads are validated by MIME type and extension (images only)
- File size is capped at 5MB via Multer config
- Global error middleware catches all unhandled errors and returns safe messages
