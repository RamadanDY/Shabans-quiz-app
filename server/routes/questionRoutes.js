const express = require('express');
const router = express.Router();
const { getQuestions } = require('../controller/questionController');

router.get('/questions', getQuestions);

module.exports = router;