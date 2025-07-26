 const express = require('express');
const router = express.Router();
const { getTopics } = require('../controller/topicController');

router.get('/', getTopics);

module.exports = router;