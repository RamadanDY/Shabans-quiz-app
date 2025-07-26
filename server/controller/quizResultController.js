const QuizResult = require('../models/quizResultModel');

// @desc    Save quiz result
// @route   POST /api/quiz/results
// @access  Private
const saveQuizResult = async (req, res) => {
  try {
    console.log('saveQuizResult: req.user', req.user);
    const { topic, score, totalQuestions, selectedAnswers } = req.body;
    if (!topic || score === undefined || !totalQuestions || !selectedAnswers) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const quizResult = await QuizResult.create({
      user: req.user._id,
      topic,
      score,
      totalQuestions,
      selectedAnswers,
    });
    console.log('Saved quiz result:', quizResult);
    res.status(201).json({ data: quizResult });
  } catch (error) {
    console.error('Error saving quiz result:', error.message);
    res.status(500).json({ message: 'Server error while saving quiz result' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/quiz/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    console.log('getDashboardStats: req.user', req.user);
    const results = await QuizResult.find({ user: req.user._id });
    console.log('Fetched results for dashboard:', results.length);
    
    const totalQuizzes = results.length;
    const averageScore = totalQuizzes
      ? (results.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / totalQuizzes * 100).toFixed(2)
      : 0;
    
    const topicStats = {};
    results.forEach((result) => {
      if (!topicStats[result.topic]) {
        topicStats[result.topic] = { count: 0, totalScore: 0, totalQuestions: 0 };
      }
      topicStats[result.topic].count += 1;
      topicStats[result.topic].totalScore += result.score;
      topicStats[result.topic].totalQuestions += result.totalQuestions;
    });
    
    const topicPerformance = Object.keys(topicStats).map((topic) => ({
      topic,
      quizzesTaken: topicStats[topic].count,
      averageScore: ((topicStats[topic].totalScore / topicStats[topic].totalQuestions) * 100).toFixed(2),
    }));

    res.status(200).json({
      data: {
        totalQuizzes,
        averageScore,
        topicPerformance,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};

module.exports = { saveQuizResult, getDashboardStats };