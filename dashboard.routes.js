const mongoose = require('mongoose');

const BillItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true },
});

const BillSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    billNumber: { type: String, required: true, unique: true },
    customerName: { type: String, trim: true, default: 'Walk-in Customer' },
    customerPhone: { type: String, trim: true },
    items: [BillItemSchema],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'other'],
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'cancelled'],
      default: 'draft',
    },
    scannedImagePath: { type: String },  // For OCR-scanned bills
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-generate bill number
BillSchema.pre('save', async function (next) {
  if (this.isNew && !this.billNumber) {
    const count = await this.constructor.countDocuments({ owner: this.owner });
    this.billNumber = `BILL-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Bill', BillSchema);
