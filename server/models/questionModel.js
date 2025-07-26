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
      message: 'Exactly 4 options are required',
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);