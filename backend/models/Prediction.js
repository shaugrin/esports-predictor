const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  outcomeIndex: {
    type: Number,
    required: true,
    min: 0
  },
  stake: {
    type: Number,
    required: true,
    min: 0
  },
  potentialPayout: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate predictions
predictionSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);