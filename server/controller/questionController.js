const Question = require('../models/questionModel');

exports.getQuestions = async (req, res) => {
  try {
    const { difficulty, limit = 10 } = req.query;
    const query = difficulty ? { difficulty } : {};
    const questions = await Question.find(query)
      .limit(parseInt(limit))
      .select('questionText options difficulty');
    res.status(200).json({
      status: 'success',
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching questions',
      error: error.message,
    });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newQuestion,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error creating question',
      error: error.message,
    });
  }
};