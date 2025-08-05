 const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
} = require('../controller/quizController'); // ✅ Make sure this path is correct

router.post('/quizzes', createQuiz); // ✅ Handler must be a function
router.get('/quizzes', getAllQuizzes); // ✅ Same here
router.get('/quizzes/:id', getQuizById); // ✅ And here

module.exports = router;
