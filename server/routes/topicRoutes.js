const express = require('express');
const router = express.Router();
const { getTopics, getTopicById, createTopic, updateTopic, deleteTopic } = require('../controller/topicController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.route('/')
  .get(getTopics)
  .post(protect, admin, createTopic);

router.route('/:id')
  .get(getTopicById)
  .put(protect, admin, updateTopic)
  .delete(protect, admin, deleteTopic);

module.exports = router;