const express = require('express');
const questionController = require("../controller/questionController")

const router = express.Router();

router
  .route('/questions')
  .get(questionController.getQuestions)
  .post(questionController.createQuestion);

module.exports = router;