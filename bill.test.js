const express = require('express');
const router = express.Router();
const { getSummary, getDailyRevenue, getTopProducts } = require('../controllers/dashboard.controller');
const protect = require('../middleware/auth.middleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/revenue', getDailyRevenue);
router.get('/top-products', getTopProducts);

module.exports = router;
