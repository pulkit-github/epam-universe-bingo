const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 85
  },
  cells: {
    type: Number,
    required: true
  },
  lines: {
    type: Number,
    required: true
  },
  persona: {
    title: String,
    desc: String
  },
  board: [String], // Store the board state
  selected: [Boolean], // Store selected tiles
  completedLines: [[Number]], // Store completed line indices
  gameTime: {
    type: Number, // Time taken to complete in seconds
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient leaderboard queries
scoreSchema.index({ score: -1, createdAt: -1 });
scoreSchema.index({ userId: 1 }, { unique: true }); // Ensure only one score per user

// Pre-save middleware to update updatedAt
scoreSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
