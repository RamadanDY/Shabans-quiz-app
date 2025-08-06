 const express = require('express');
const router = express.Router();
const { createTopic, getTopics, getTopicById } = require('../controller/topicController');

router.route('/').post(createTopic).get(getTopics);
router.route('/:id').get(getTopicById);

module.exports = router;