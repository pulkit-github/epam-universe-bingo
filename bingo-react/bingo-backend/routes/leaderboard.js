const express = require('express');
const Score = require('../models/Score');
const User = require('../models/User');

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await Score.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          userName: { $first: '$user.name' },
          userEmail: { $first: '$user.email' },
          totalGames: { $sum: 1 },
          lastPlayed: { $max: '$createdAt' }
        }
      },
      { $sort: { bestScore: -1, lastPlayed: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent high scores
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const recentScores = await Score.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(recentScores);
  } catch (error) {
    console.error('Recent scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top scores by persona
router.get('/by-persona', async (req, res) => {
  try {
    const { persona } = req.query;

    if (!persona) {
      return res.status(400).json({ message: 'Persona is required' });
    }

    const scores = await Score.find({ 'persona.title': persona })
      .populate('userId', 'name email')
      .sort({ score: -1 })
      .limit(10);

    res.json(scores);
  } catch (error) {
    console.error('Persona scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Score.aggregate([
      {
        $group: {
          _id: null,
          totalPlayers: { $addToSet: '$userId' },
          totalGames: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' }
        }
      },
      {
        $project: {
          totalPlayers: { $size: '$totalPlayers' },
          totalGames: 1,
          averageScore: { $round: ['$averageScore', 2] },
          highestScore: 1
        }
      }
    ]);

    res.json(stats[0] || {
      totalPlayers: 0,
      totalGames: 0,
      averageScore: 0,
      highestScore: 0
    });
  } catch (error) {
    console.error('Leaderboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
