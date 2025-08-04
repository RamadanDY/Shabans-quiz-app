 const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (arr) {
        return arr.length === 4;
      },
      message: 'Each question must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    validate: {
      validator: function (value) {
        return this.options.includes(value);
      },
      message: 'Correct answer must be one of the options',
    },
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic is required'],
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: 'At least one question is required',
    },
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  availableFrom: {
    type: Date,
    default: null,
  },
  availableUntil: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
