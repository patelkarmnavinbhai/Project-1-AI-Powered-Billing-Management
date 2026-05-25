const Bill = require('../models/Bill');
const User = require('../models/User');
const { generateInvoicePDF } = require('../services/pdfGenerator.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Generate and download PDF invoice for a bill
// @route   GET /api/pdf/invoice/:id
const downloadInvoice = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, owner: req.user.id });
    if (!bill) return errorResponse(res, 'Bill not found', 404);

    const user = await User.findById(req.user.id).select('-password');

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${bill.billNumber}.pdf"`);

    // Stream PDF directly to response
    await generateInvoicePDF(bill, user, res);
  } catch (err) {
    return errorResponse(res, `PDF generation failed: ${err.message}`, 500);
  }
};

module.exports = { downloadInvoice };
