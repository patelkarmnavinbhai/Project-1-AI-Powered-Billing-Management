const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    category: { type: String, trim: true, default: 'General' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    expiryDate: { type: Date, default: null },  // Innovation: expiry tracker
    unit: { type: String, default: 'pcs' },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: is low stock?
ProductSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Virtual: is expired?
ProductSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
