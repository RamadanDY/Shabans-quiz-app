const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware and admin check
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin role required.',
    });
  }
  next();
});

// Create a quiz
router.post('/quizzes', async (req, res) => {
  try {
    const { title, topic, questions, timeLimit, isActive, availableFrom, availableUntil } = req.body;
    if (!title || !topic || !questions || !timeLimit) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, topic, questions, and time limit are required',
      });
    }
    const quiz = await Quiz.create({
      title,
      topic,
      questions,
      timeLimit,
      isActive: isActive ?? true,
      availableFrom: availableFrom || null,
      availableUntil: availableUntil || null,
      createdBy: req.user._id,
    });
    res.status(201).json({
      status: 'success',
      data: quiz,
    });
  } catch (error) {
    console.error('Create quiz error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error creating quiz',
      error: error.message,
    });
  }
});

// Get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('topic questions createdBy', 'name email');
    res.status(200).json({
      status: 'success',
      data: quizzes,
    });
  } catch (error) {
    console.error('Get quizzes error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error fetching quizzes',
      error: error.message,
    });
  }
});

// Update a quiz
router.put('/quizzes/:id', async (req, res) => {
  try {
    const { title, topic, questions, timeLimit, isActive, availableFrom, availableUntil } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, topic, questions, timeLimit, isActive, availableFrom, availableUntil },
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: quiz,
    });
  } catch (error) {
    console.error('Update quiz error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error updating quiz',
      error: error.message,
    });
  }
});

// Delete a quiz
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Quiz deleted',
    });
  } catch (error) {
    console.error('Delete quiz error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error deleting quiz',
      error: error.message,
    });
  }
});

// Set quiz availability
router.patch('/quizzes/:id/availability', async (req, res) => {
  try {
    const { isActive, availableFrom, availableUntil } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { isActive, availableFrom: availableFrom || null, availableUntil: availableUntil || null },
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: quiz,
    });
  } catch (error) {
    console.error('Update quiz availability error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error updating quiz availability',
      error: error.message,
    });
  }
});

module.exports = router;