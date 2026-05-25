/**
 * INNOVATION FEATURE 3 — Expiry Date Tracker
 * ============================================
 * Demo/test script showing how the expiry tracker works.
 * Run: node innovation/expiryTracker.demo.js
 *
 * Requires MongoDB running and .env configured.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const DEMO_OWNER_ID = new mongoose.Types.ObjectId(); // Fake owner for demo

const sampleProducts = [
  {
    owner: DEMO_OWNER_ID,
    name: 'Fresh Milk',
    price: 60,
    quantity: 20,
    category: 'Dairy',
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // expired 2 days ago
  },
  {
    owner: DEMO_OWNER_ID,
    name: 'Bread',
    price: 40,
    quantity: 15,
    category: 'Bakery',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // expires in 5 days
  },
  {
    owner: DEMO_OWNER_ID,
    name: 'Basmati Rice',
    price: 250,
    quantity: 50,
    category: 'Grains',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // expires in 1 year
  },
  {
    owner: DEMO_OWNER_ID,
    name: 'Chips',
    price: 20,
    quantity: 3,
    lowStockThreshold: 5, // will trigger low stock warning
    category: 'Snacks',
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // expires in 20 days
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/billing_demo');
    console.log('✅ Connected to MongoDB\n');

    // Insert demo products
    await Product.deleteMany({ owner: DEMO_OWNER_ID });
    const products = await Product.insertMany(sampleProducts);

    console.log('📦 All Products:');
    products.forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`      Qty: ${p.quantity} | Expiry: ${p.expiryDate?.toDateString()}`);
      console.log(`      isExpired: ${p.isExpired} | isLowStock: ${p.isLowStock}`);
    });

    console.log('\n⚠️  Expired Products:');
    const expired = products.filter(p => p.isExpired);
    expired.length
      ? expired.forEach(p => console.log(`  ❌ ${p.name} (expired on ${p.expiryDate?.toDateString()})`))
      : console.log('  None');

    console.log('\n⏰ Expiring Within 30 Days:');
    const expiringSoon = products.filter(p => {
      if (!p.expiryDate || p.isExpired) return false;
      const daysLeft = (p.expiryDate - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft <= 30;
    });
    expiringSoon.length
      ? expiringSoon.forEach(p => {
          const days = Math.ceil((p.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
          console.log(`  ⚠️  ${p.name} — expires in ${days} day(s)`);
        })
      : console.log('  None');

    console.log('\n📉 Low Stock Products:');
    const lowStock = products.filter(p => p.isLowStock);
    lowStock.length
      ? lowStock.forEach(p => console.log(`  🔴 ${p.name} — only ${p.quantity} left`))
      : console.log('  None');

    // Cleanup
    await Product.deleteMany({ owner: DEMO_OWNER_ID });
    await mongoose.connection.close();
    console.log('\n✅ Demo complete. Cleaned up demo data.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
