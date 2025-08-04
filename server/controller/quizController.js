const Quiz = require('../models/quizModel');
const Topic = require('../models/topicModel');

// ✅ Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, topic, questions, timeLimit, isActive, availableFrom, availableUntil } = req.body;

    // Validate topic
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(400).json({ message: 'Invalid topic ID' });
    } 

    // ✅ Validate each question structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
    }

    for (const [i, q] of questions.entries()) {
      if (
        !q.questionText ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        !q.correctAnswer ||
        !q.options.includes(q.correctAnswer)
      ) {
        return res.status(400).json({
          message: `Invalid question at index ${i}: Each must have questionText, 4 options, and correctAnswer among options`,
        });
      }
    }

    // ✅ Date validation
    if (availableFrom && availableUntil && new Date(availableFrom) > new Date(availableUntil)) {
      return res.status(400).json({ message: 'Available from date must be before available until date' });
    }

    // ✅ Create quiz
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

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz', error: error.message });
  }
};
