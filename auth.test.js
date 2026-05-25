const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, addProduct, updateProduct, deleteProduct, getCategories,
} = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');

router.use(protect); // All product routes require auth

router.get('/categories', getCategories);
router.route('/').get(getProducts).post(addProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
