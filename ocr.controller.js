const Bill = require('../models/Bill');
const { syncInventoryOnBill } = require('../services/inventorySync.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Create a new bill (draft)
// @route   POST /api/bills
const createBill = async (req, res) => {
  try {
    const { items, customerName, customerPhone, taxRate, discount, paymentMethod, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map(item => {
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      return { ...item, total };
    });

    const taxAmount = (subtotal * (taxRate || 0)) / 100;
    const totalAmount = subtotal + taxAmount - (discount || 0);

    const bill = await Bill.create({
      owner: req.user.id,
      items: processedItems,
      customerName,
      customerPhone,
      subtotal,
      taxRate: taxRate || 0,
      taxAmount,
      discount: discount || 0,
      totalAmount,
      paymentMethod,
      notes,
      status: 'draft',
    });

    return successResponse(res, bill, 'Bill created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Finalize bill (triggers inventory sync)
// @route   PUT /api/bills/:id/finalize
const finalizeBill = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, owner: req.user.id });
    if (!bill) return errorResponse(res, 'Bill not found', 404);
    if (bill.status === 'finalized') return errorResponse(res, 'Bill already finalized', 400);

    // Deduct inventory
    await syncInventoryOnBill(bill.items, req.user.id);

    bill.status = 'finalized';
    await bill.save();

    return successResponse(res, bill, 'Bill finalized and inventory updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get all bills
// @route   GET /api/bills
const getBills = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    let query = { owner: req.user.id };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bills = await Bill.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bill.countDocuments(query);

    return successResponse(res, { bills, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Bills fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
const getBill = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, owner: req.user.id });
    if (!bill) return errorResponse(res, 'Bill not found', 404);
    return successResponse(res, bill, 'Bill fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Cancel a bill
// @route   PUT /api/bills/:id/cancel
const cancelBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id, status: 'draft' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!bill) return errorResponse(res, 'Bill not found or cannot be cancelled', 404);
    return successResponse(res, bill, 'Bill cancelled');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { createBill, finalizeBill, getBills, getBill, cancelBill };
