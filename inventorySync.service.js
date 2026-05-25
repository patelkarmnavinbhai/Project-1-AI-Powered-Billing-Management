const express = require('express');
const router = express.Router();
const { downloadInvoice } = require('../controllers/pdf.controller');
const protect = require('../middleware/auth.middleware');

router.get('/invoice/:id', protect, downloadInvoice);

module.exports = router;
