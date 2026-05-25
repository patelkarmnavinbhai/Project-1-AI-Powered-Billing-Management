const express = require('express');
const router = express.Router();
const { scanBill } = require('../controllers/ocr.controller');
const protect = require('../middleware/auth.middleware');
const upload = require('../config/multer');

router.post('/scan', protect, upload.single('billImage'), scanBill);

module.exports = router;
