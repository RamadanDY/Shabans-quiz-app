 const express = require('express');
const questionController = require('../controller/questionController');

const router = express.Router();

router
  .route('/questions')
  .get(questionController.getQuestions)
  .post(questionController.createQuestion);

router.route('/submit').post(questionController.submitAnswer);

module.exports = router;