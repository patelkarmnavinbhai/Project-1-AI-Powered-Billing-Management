const Bill = require('../models/Bill');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { getDateRange } = require('../utils/dateHelper');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { start, end } = getDateRange('today');

    const [todayRevenue, totalBills, totalProducts, lowStockProducts] = await Promise.all([
      Bill.aggregate([
        { $match: { owner: ownerId, status: 'finalized', createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Bill.countDocuments({ owner: ownerId, status: 'finalized' }),
      Product.countDocuments({ owner: ownerId, isActive: true }),
      Product.find({ owner: ownerId, isActive: true }),
    ]);

    const lowStock = lowStockProducts.filter(p => p.isLowStock).length;
    const expiringSoon = lowStockProducts.filter(p => {
      if (!p.expiryDate) return false;
      const daysLeft = (p.expiryDate - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 30;
    }).length;

    return successResponse(res, {
      todayRevenue: todayRevenue[0]?.total || 0,
      totalBills,
      totalProducts,
      lowStockCount: lowStock,
      expiringSoonCount: expiringSoon,
    }, 'Summary fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get daily revenue for last 7 days (Bar Chart data)
// @route   GET /api/dashboard/revenue
const getDailyRevenue = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const revenue = await Bill.aggregate([
      {
        $match: {
          owner: req.user.id,
          status: 'finalized',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          billCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, revenue, 'Revenue data fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get top-selling products
// @route   GET /api/dashboard/top-products
const getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Bill.aggregate([
      { $match: { owner: req.user.id, status: 'finalized' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) },
    ]);

    return successResponse(res, topProducts, 'Top products fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getSummary, getDailyRevenue, getTopProducts };
