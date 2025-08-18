 const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
   getQuizzesByTopic
} = require('../controller/createQuizController'); // ✅ Make sure this path is correct

router.post('/question', createQuiz); // ✅ Handler must be a function
router.get('/question', getAllQuizzes); // ✅ Same here
router.get('/:id', getQuizById); // ✅ And here
router.get('/quizzes/topic/:topicName', getQuizzesByTopic);


module.exports = router;
