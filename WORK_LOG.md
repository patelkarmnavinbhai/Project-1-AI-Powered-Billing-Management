const User = require('../models/User');
const { generateToken } = require('../utils/tokenHelper');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Register new shop owner
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { shopName, ownerName, email, password, phone, address } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 'Email already registered', 400);

    const user = await User.create({ shopName, ownerName, email, password, phone, address });
    const token = generateToken(user._id);

    return successResponse(res, {
      token,
      user: { id: user._id, shopName: user.shopName, ownerName: user.ownerName, email: user.email },
    }, 'Registration successful', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Login shop owner
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);
    return successResponse(res, {
      token,
      user: { id: user._id, shopName: user.shopName, ownerName: user.ownerName, email: user.email, darkMode: user.darkMode },
    }, 'Login successful');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return successResponse(res, user, 'User fetched');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// @desc    Toggle dark mode preference
// @route   PUT /api/auth/darkmode
const toggleDarkMode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.darkMode = !user.darkMode;
    await user.save();
    return successResponse(res, { darkMode: user.darkMode }, 'Dark mode updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { register, login, getMe, toggleDarkMode };
