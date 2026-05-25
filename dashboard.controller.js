const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get all products for logged-in owner
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, lowStock, expired } = req.query;
    let query = { owner: req.user.id, isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let products = await Product.find(query).sort({ createdAt: -1 });

    if (lowStock === 'true') {
      products = products.filter(p => p.isLowStock);
    }
    if (expired === 'true') {
      products = products.filter(p => p.isExpired);
    }

    return successResponse(res, products, 'Products fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.user.id });
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product, 'Product fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Add new product
// @route   POST /api/products
const addProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, owner: req.user.id });
    return successResponse(res, product, 'Product added', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product, 'Product updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, null, 'Product deleted');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { owner: req.user.id, isActive: true });
    return successResponse(res, categories, 'Categories fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getProducts, getProduct, addProduct, updateProduct, deleteProduct, getCategories };
