const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length === 4; // Ensures exactly 4 options
      },
      message: 'Question must have exactly 4 options.',
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return this.options.includes(value); // Ensures correct answer is one of the options
      },
      message: 'Correct answer must be one of the provided options.',
    },
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);