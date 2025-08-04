 const express = require('express');
const router = express.Router();
const { getTopics,createTopic } = require('../controller/topicController');

router.get('/', getTopics);
router.post('/', createTopic); // Create a new topic

module.exports = router;