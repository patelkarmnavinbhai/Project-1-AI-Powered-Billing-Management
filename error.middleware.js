/**
 * INNOVATION FEATURE 2 — WhatsApp Invoice Sender
 * ================================================
 * Demo/test script for sending a WhatsApp invoice.
 * Run: node innovation/whatsapp.demo.js
 *
 * Requires .env with Twilio credentials configured.
 */

require('dotenv').config();
const { sendInvoiceWhatsApp } = require('../services/whatsapp.service');

// Sample bill data (mirrors a real finalized Bill document)
const sampleBill = {
  billNumber: 'BILL-1717000000-0001',
  createdAt: new Date(),
  items: [
    { productName: 'Basmati Rice (5kg)', quantity: 2, unitPrice: 250, total: 500 },
    { productName: 'Toor Dal (1kg)',     quantity: 3, unitPrice: 90,  total: 270 },
    { productName: 'Sunflower Oil (1L)', quantity: 1, unitPrice: 160, total: 160 },
  ],
  subtotal: 930,
  taxRate: 5,
  taxAmount: 46.5,
  discount: 50,
  totalAmount: 926.5,
  paymentMethod: 'upi',
  status: 'finalized',
};

// Sample shop owner
const sampleOwner = {
  shopName: 'Sharma General Store',
  email: 'sharma@example.com',
};

// Target customer WhatsApp number (with country code)
const customerPhone = '+919876543210'; // ← Change to real number for testing

(async () => {
  try {
    console.log('📱 Sending WhatsApp invoice...');
    const result = await sendInvoiceWhatsApp(customerPhone, sampleBill, sampleOwner);
    console.log('✅ WhatsApp message sent successfully!');
    console.log('   To:', result.to);
  } catch (err) {
    console.error('❌ Failed to send WhatsApp message:', err.message);
    console.error('   Make sure Twilio credentials are set in .env');
  }
})();
