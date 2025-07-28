const express = require('express');
const authController = require('../controller/authController'); // ✅ correct folder name
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router(); // ✅ define router BEFORE using it

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
