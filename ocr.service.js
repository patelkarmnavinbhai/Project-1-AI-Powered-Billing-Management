const express = require('express');
const router = express.Router();
const { createBill, finalizeBill, getBills, getBill, cancelBill } = require('../controllers/bill.controller');
const protect = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getBills).post(createBill);
router.get('/:id', getBill);
router.put('/:id/finalize', finalizeBill);
router.put('/:id/cancel', cancelBill);

module.exports = router;
