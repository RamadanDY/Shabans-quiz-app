 const Quiz = require('../models/createQuizModel');
const Topic = require('../models/topicModel');

exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      topic,
      topicId,
      questions,
      timeLimit,
      isActive,
      availableFrom,
      availableUntil,
    } = req.body;
     if (!topic || !topic.name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }

    // Check if topic exists
    let existingTopic = await Topic.findOne({ name: topic.name });
    
if (topicId) {
  existingTopic = await Topic.findById(topicId);
} else if (topic?.name) {
  existingTopic = await Topic.findOne({ name: topic.name });
  if (!existingTopic) {
    existingTopic = await Topic.create({
      name: topic.name,
      description: topic.description || '',
    });
  }
}
    // If not, create it
    if (!existingTopic) {
      existingTopic = await Topic.create({
        name: topic.name,
        description: topic.description || '',
      });
    }

    // Validate questions
    const validQuestions = questions.every(
      (q) =>
        q.questionText &&
        q.options?.length === 4 &&
        q.options.includes(q.correctAnswer)
    );

    if (!validQuestions) {
      return res.status(400).json({
        message:
          'Each question must have questionText, 4 options, and correctAnswer among options',
      });
    }

    // Create the quiz
    const quiz = await Quiz.create({
      title,
      topic: existingTopic._id,
      questions,
      timeLimit,
      isActive,
      availableFrom,
      availableUntil,
      createdBy: req.user?._id || null, // Optional if authentication middleware is used
    });

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Error creating quiz backend', error: error.message });
  }
};

// ✅ GET all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('topic', 'name description')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
};

// ✅ GET quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('topic', 'name description')
      .populate('createdBy', 'name email role');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
};

 