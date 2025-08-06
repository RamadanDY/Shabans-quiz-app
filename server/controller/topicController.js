const Topic = require('../models/topicModel'); // Adjust the path to your Topic model
const asyncHandler = require('express-async-handler'); // For handling async errors

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Public (or Private if you add authentication)
const createTopic = asyncHandler(async (req, res) => {
  const { name, description, createdBy } = req.body;

  // Validate required fields
  if (!name) {
    res.status(400);
    throw new Error('Topic name is required yes');
  }

  // Check if topic already exists
  const topicExists = await Topic.findOne({ name });
  if (topicExists) {
    res.status(400);
    throw new Error('Topic with this name already exists');
  }

  // Create new topic
  const topic = await Topic.create({
    name,
    description,
    createdBy: createdBy || null, // Optional, based on your schema
  });

  res.status(201).json({
    success: true,
    data: topic,
  });
});

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({}).populate('createdBy', 'username'); // Populate createdBy with username if User model exists
  res.status(200).json({
    success: true,
    count: topics.length,
    data: topics,
  });
});

// @desc    Get a single topic by ID
// @route   GET /api/topics/:id
// @access  Public
const getTopicById = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id).populate('createdBy', 'username');

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found why');
  }

  res.status(200).json({
    success: true,
    data: topic,
  });
});

module.exports = {
  createTopic,
  getTopics,
  getTopicById,
};
 