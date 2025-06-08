const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  category: {
    type: String,
    required: true,
    enum: ['Daily Life', 'Tech', 'Gaming', 'Work', 'Relationships', 'Other'],
    default: 'Daily Life'
  },
  outcomes: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.every(outcome => outcome.trim().length > 0);
      },
      message: 'At least two outcomes are required'
    },
    default: ["Yes", "No"]
  },
  startTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > Date.now();
      },
      message: 'Event must be in the future'
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  },
  result: {
    type: Number, // Index of the winning outcome
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);