const express = require('express');
const router = express.Router();
const { saveQuizResult, getDashboardStats } = require('../controller/quizResultController');
const protect = require('../middleware/authMiddleware');

router.post('/results', protect, saveQuizResult);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;