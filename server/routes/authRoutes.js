const express = require('express');
const authController = require('../controller/authController');
const protect = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe); // ✅ Any logged-in user
router.get('/users', protect, adminMiddleware, authController.getAllUsers); // ✅ Admin only

module.exports = router;


