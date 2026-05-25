# 🚀 Special Features — Innovation Zone

Three bonus features were implemented beyond the core project requirements.

---

## Feature 1 — 🌙 Dark Mode Toggle

**Type:** User Preference / UX
**Files:** `models/User.js`, `controllers/auth.controller.js`, `routes/auth.routes.js`
**Route:** `PUT /api/auth/darkmode`

Each shop owner's dark mode preference is saved to their profile in MongoDB.
It is automatically restored on every login — no re-enabling needed per session.
The frontend reads `user.darkMode` from the login response to set the initial theme.

**Usage:**
```
PUT /api/auth/darkmode
Authorization: Bearer <token>

Response: { "data": { "darkMode": true } }
```

---

## Feature 2 — 📱 WhatsApp Invoice Sender

**Type:** Communication / Third-Party API Integration
**Files:** `services/whatsapp.service.js`, `innovation/whatsapp.demo.js`
**Trigger:** Called after `PUT /api/bills/:id/finalize`

Sends a fully formatted invoice to the customer's WhatsApp using the Twilio API.
No installation required on the customer's side — works on any WhatsApp number.

**Message includes:**
- Shop name and bill number
- Full itemized product list with quantities and prices
- Subtotal, tax, discount, and grand total
- Payment method and thank-you message

**Demo:**
```bash
node innovation/whatsapp.demo.js
```

**Required .env keys:**
```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## Feature 3 — 📦 Expiry Date Tracker

**Type:** Inventory Intelligence / Smart Alerts
**Files:** `models/Product.js`, `controllers/product.controller.js`, `controllers/dashboard.controller.js`, `innovation/expiryTracker.demo.js`

Products have an optional `expiryDate` field. The system uses Mongoose virtual
properties to automatically compute `isExpired` and surfaces expiry data in the
dashboard and API filters.

**What it detects:**
- `isExpired` — true if today is past the expiry date
- `expiringSoonCount` — products expiring within 30 days (shown in dashboard)
- `?expired=true` — API filter to list only expired products

**Demo:**
```bash
node innovation/expiryTracker.demo.js
```

---

## Summary

| # | Feature | Route | Key File |
|---|---------|-------|----------|
| 1 | 🌙 Dark Mode Toggle | `PUT /api/auth/darkmode` | `controllers/auth.controller.js` |
| 2 | 📱 WhatsApp Invoice Sender | After bill finalize | `services/whatsapp.service.js` |
| 3 | 📦 Expiry Date Tracker | `GET /api/products?expired=true` | `models/Product.js` |
