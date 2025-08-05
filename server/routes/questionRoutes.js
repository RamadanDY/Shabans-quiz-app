const express = require('express');
const router = express.Router();
const { getQuestions } = require('../controller/questionController');

router.get('/', getQuestions);

module.exports = router;