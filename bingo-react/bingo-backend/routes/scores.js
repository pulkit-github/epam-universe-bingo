const express = require('express');
const Score = require('../models/Score');
const { verifyToken } = require('./auth');
const mongoose = require('mongoose');

const router = express.Router();

// Save score
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { score, cells, lines, persona, board, selected, completedLines, gameTime } = req.body;

    // Validation
    if (typeof score !== 'number' || score < 0 || score > 85) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);

    // First, check if a score already exists for this user
    const existingScore = await Score.findOne({ userId });

    let scoreRecord;
    if (existingScore) {
      // Update existing score
      scoreRecord = await Score.findByIdAndUpdate(
        existingScore._id,
        {
          score,
          cells,
          lines,
          persona,
          board,
          selected,
          completedLines,
          gameTime,
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      // Create new score
      scoreRecord = new Score({
        userId,
        score,
        cells,
        lines,
        persona,
        board,
        selected,
        completedLines,
        gameTime
      });
      await scoreRecord.save();
    }

    res.status(200).json({
      message: 'Score updated successfully',
      score: scoreRecord
    });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's score (single score per user)
router.get('/my-scores', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const score = await Score.findOne({ userId });

    // Return as array for consistency with frontend
    res.json(score ? [score] : []);
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's best score (same as current score since there's only one per user)
router.get('/best-score', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const bestScore = await Score.findOne({ userId });

    res.json(bestScore || { message: 'No score found' });
  } catch (error) {
    console.error('Get best score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's stats (simplified since there's only one score per user)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const score = await Score.findOne({ userId });

    if (!score) {
      return res.json({
        totalGames: 0,
        bestScore: 0,
        averageScore: 0,
        totalLines: 0,
        totalCells: 0
      });
    }

    res.json({
      totalGames: 1,
      bestScore: score.score,
      averageScore: score.score,
      totalLines: score.lines,
      totalCells: score.cells
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
