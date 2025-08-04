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

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private
const createTopic = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Topic name is required and must be a string' });
    }

    const topic = await Topic.create({ name });
    res.status(201).json({ message: 'Topic created successfully', data: topic });
  } catch (error) {
    res.status(400).json({ message: 'Error creating topic', error: error.message });
  }
};

module.exports = {
  getTopics,
  createTopic,
};
