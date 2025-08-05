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
    console.log('🔥 Incoming request body:', req.body); // Add this

    const { name, description } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Topic name is required and must be a string' });
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ message: 'Topic description is required and must be a string' });
    }

    const topic = await Topic.create({ name, description });
    res.status(201).json({ message: 'Topic created successfully', data: topic });
  } 
   catch (error) {
  console.error('❌ Error creating topic:', error); // Show full error stack in terminal

  res.status(400).json({
    message: 'Error creating topic - backend',
    error: error.message || error,
  });
} 
};

module.exports = {
  getTopics,
  createTopic,
};
 