# 🖥️ Desktop Setup Guide — AI-Powered Billing Management Backend

Step-by-step guide to install and run the backend on your local machine (Windows / macOS / Linux).

---

## Prerequisites

Make sure these are installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v9 or higher | Comes with Node.js |
| MongoDB | v6 or higher | https://www.mongodb.com/try/download/community |
| Git | Latest | https://git-scm.com |
| Postman (optional) | Latest | https://www.postman.com |

---

## Step 1 — Check Node.js & npm

Open your terminal (Command Prompt / PowerShell / Terminal) and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show v9.x.x or higher
```

If not installed, download Node.js from https://nodejs.org (LTS version recommended).

---

## Step 2 — Install & Start MongoDB

### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" setup)
3. MongoDB runs automatically as a Windows Service

To verify MongoDB is running:
```cmd
mongosh
```

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Step 3 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-billing-management.git
cd ai-billing-management
```

---

## Step 4 — Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json` including Express, Mongoose, Tesseract.js, Sharp, PDFKit, and Twilio.

> **Note:** The `sharp` package may take 1-2 minutes to install as it downloads native binaries.

---

## Step 5 — Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` in any text editor (VS Code, Notepad, nano) and fill in:

```env
PORT=5000
NODE_ENV=development

# MongoDB — keep default if running locally
MONGO_URI=mongodb://localhost:27017/billing_db

# JWT — change this to any random secret string
JWT_SECRET=my_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# Twilio WhatsApp (optional — only needed for WhatsApp feature)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Upload settings
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## Step 6 — Run the Server

### Development mode (auto-restarts on file changes)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

---

## Step 7 — Test the API

Open Postman or your browser and hit:
```
GET http://localhost:5000/
```

Expected response:
```json
{ "message": "AI Billing Management API is running" }
```

### Register a test account
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "shopName": "My Shop",
  "ownerName": "Your Name",
  "email": "you@example.com",
  "password": "password123"
}
```

Copy the `token` from the response — you will need it for all other requests.

---

## Step 8 — Run Tests

```bash
npm test
```

This runs all Jest tests in the `tests/` folder and shows pass/fail results.

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `MongoDB connection error` | MongoDB not running | Start MongoDB service (see Step 2) |
| `Cannot find module 'sharp'` | Native build failed | Run `npm rebuild sharp` |
| `Port 5000 already in use` | Another app on port 5000 | Change `PORT=5001` in `.env` |
| `JWT malformed` error | Wrong/missing token | Re-login to get a fresh token |
| Tesseract not working | Missing language data | Run `npm install tesseract.js` again |

---

## VS Code Recommended Extensions

If you use VS Code, install these for a better experience:

- **ESLint** — code linting
- **Prettier** — code formatting
- **MongoDB for VS Code** — browse your database
- **REST Client** — test APIs inside VS Code
- **DotENV** — syntax highlighting for .env files

---

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (development) |
| `npm start` | Start server without nodemon (production) |
| `npm test` | Run all Jest tests with coverage report |
