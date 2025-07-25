const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Topic description is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Topic', topicSchema);