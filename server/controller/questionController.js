const Question = require('../models/questionModel');

// @desc    Get questions by topic, difficulty, and limit
// @route   GET /api/quiz/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query;
    const query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    const questions = await Question.find(query).limit(Number(limit));
    res.status(200).json({ data: questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
};

module.exports = { getQuestions };