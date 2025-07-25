const express = require('express');
const questionController = require('../controller/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/questions')
  .get(authMiddleware, questionController.getQuestions)
  .post(authMiddleware, questionController.createQuestion);

router.route('/submit').post(authMiddleware, questionController.submitAnswer);

module.exports = router;
//  const express = require('express');
// const questionController = require('../controller/questionController');

// const router = express.Router();

// router
//   .route('/questions')
//   .get(questionController.getQuestions)
//   .post(questionController.createQuestion);

// router.route('/submit').post(questionController.submitAnswer);

// module.exports = router;