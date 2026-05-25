const express = require('express');
const router = express.Router();
const { register, login, getMe, toggleDarkMode } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/darkmode', protect, toggleDarkMode);

module.exports = router;
