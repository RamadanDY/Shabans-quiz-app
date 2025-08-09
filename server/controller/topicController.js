const Topic = require('../models/topicModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({}).select('name description category');
  res.status(200).json(topics);
});

// @desc    Get single topic by ID
// @route   GET /api/topics/:id
// @access  Public
const getTopicById = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id).select('name description category');
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }
  res.status(200).json(topic);
});

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private/Admin
const createTopic = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description ) {
    res.status(400);
    throw new Error('Please provide name, description, and category');
  }

  const topicExists = await Topic.findOne({ name });
  if (topicExists) {
    res.status(400);
    throw new Error('Topic already exists');
  }

  const topic = await Topic.create({
    name,
    description,
    createdBy: req.user._id,
  });

  res.status(201).json({
  success: true,
  data: {
    _id: topic._id,
    name: topic.name,
    description: topic.description,
    createdBy: topic.createdBy
  }
});

});

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
const updateTopic = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  topic.name = name || topic.name;
  topic.description = description || topic.description;
  topic.category = category || topic.category;

  const updatedTopic = await topic.save();
  res.status(200).json({
    _id: updatedTopic._id,
    name: updatedTopic.name,
    description: updatedTopic.description,
    category: updatedTopic.category,
  });
});

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
const deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  await topic.deleteOne();
  res.status(200).json({ message: 'Topic deleted successfully' });
});

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};