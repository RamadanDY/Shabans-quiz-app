 // backend/controllers/topicController.js
const Topic = require('../models/topicModel');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json({ data: topics });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching topics' });
  }
};

module.exports = { getTopics };