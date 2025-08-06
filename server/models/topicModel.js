const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Topic name must be at least 3 characters'],
    maxlength: [100, 'Topic name must be less than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // You can make this required if user authentication is added
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Topic', topicSchema);



// const mongoose = require('mongoose');

// const topicSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Topic name is required'],
//     unique: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: [true, 'Topic description is required'],
//     trim: true,
//   },
// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model('Topic', topicSchema);