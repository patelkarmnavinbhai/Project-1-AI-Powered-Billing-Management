# 🚀 Innovation Zone — Special Features Added

This folder documents and contains all **3 special/bonus features** added beyond
the core project requirements, as part of the Intern Innovation Zone.

---

## Feature 1 — 🌙 Dark Mode Toggle

**What it does:**
Allows shop owners to switch between light and dark mode. Their preference is
saved permanently in the database so it is restored automatically on every login.

**Files involved:**
- `models/User.js` → `darkMode: Boolean` field on User schema
- `controllers/auth.controller.js` → `toggleDarkMode()` function
- `routes/auth.routes.js` → `PUT /api/auth/darkmode` endpoint

**How to use:**
```
PUT /api/auth/darkmode
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Dark mode updated",
  "data": { "darkMode": true }
}
```

---

## Feature 2 — 📱 WhatsApp Invoice Sender

**What it does:**
After a bill is finalized, the shop owner can instantly send a fully formatted
invoice to the customer's WhatsApp number — no app installation needed for
the customer. Uses the Twilio WhatsApp API.

**Files involved:**
- `services/whatsapp.service.js` → Core WhatsApp sending logic
- `innovation/whatsapp.demo.js` → Standalone demo/test script

**Message includes:**
- Shop name and bill number
- Full itemized product list with quantities and prices
- Subtotal, tax, discount, and grand total
- Payment method
- Thank-you message

**How to use:**
```javascript
const { sendInvoiceWhatsApp } = require('../services/whatsapp.service');

await sendInvoiceWhatsApp('+919876543210', bill, shopOwner);
```

**Setup required in `.env`:**
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## Feature 3 — 📦 Expiry Date Tracker

**What it does:**
Every product can have an expiry date. The system automatically detects expired
products and products expiring within 30 days, and surfaces them in the dashboard
and via API filters — helping shop owners avoid selling expired stock.

**Files involved:**
- `models/Product.js` → `expiryDate` field + `isExpired` virtual property
- `controllers/product.controller.js` → `?expired=true` filter support
- `controllers/dashboard.controller.js` → `expiringSoonCount` in summary
- `innovation/expiryTracker.demo.js` → Standalone demo/test script

**API Usage:**

Filter expired products:
```
GET /api/products?expired=true
Headers: Authorization: Bearer <token>
```

Dashboard summary includes:
```json
{
  "expiringSoonCount": 3
}
```

Product object includes virtual fields:
```json
{
  "name": "Milk",
  "expiryDate": "2024-06-01",
  "isExpired": false,
  "isLowStock": true
}
```

---

## Summary Table

| # | Feature | File | Route/Usage |
|---|---------|------|-------------|
| 1 | Dark Mode Toggle | `controllers/auth.controller.js` | `PUT /api/auth/darkmode` |
| 2 | WhatsApp Invoice Sender | `services/whatsapp.service.js` | Called after bill finalize |
| 3 | Expiry Date Tracker | `models/Product.js` | `GET /api/products?expired=true` |

All three features are fully integrated into the main backend codebase
and are ready to use with proper environment configuration.
