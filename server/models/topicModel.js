const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Topic name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Topic description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
   
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Topic', topicSchema);