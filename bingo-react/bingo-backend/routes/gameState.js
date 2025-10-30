const express = require('express');
const GameState = require('../models/GameState');
const { verifyToken } = require('./auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get current game state
router.get('/current', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    let gameState = await GameState.findOne({ userId });

    // If no game state exists, create one
    if (!gameState) {
      gameState = new GameState({ userId });
      await gameState.save();
    }

    res.json({
      board: gameState.board,
      selected: gameState.selected,
      showResult: gameState.showResult,
      gameStartTime: gameState.gameStartTime,
      lastUpdated: gameState.lastUpdated
    });
  } catch (error) {
    console.error('Get game state error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save current game state
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { board, selected, showResult } = req.body;
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Validation
    if (!Array.isArray(board) || board.length !== 25) {
      return res.status(400).json({ message: 'Invalid board' });
    }
    if (!Array.isArray(selected) || selected.length !== 25) {
      return res.status(400).json({ message: 'Invalid selected array' });
    }

    // Update or create game state
    const gameState = await GameState.findOneAndUpdate(
      { userId },
      { 
        board, 
        selected, 
        showResult: showResult || false,
        lastUpdated: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      message: 'Game state saved successfully',
      gameState: {
        board: gameState.board,
        selected: gameState.selected,
        showResult: gameState.showResult,
        gameStartTime: gameState.gameStartTime,
        lastUpdated: gameState.lastUpdated
      }
    });
  } catch (error) {
    console.error('Save game state error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset game state (shuffle board and clear selections)
router.post('/reset', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    // Create new game state with fresh board
    const gameState = new GameState({ userId });
    await gameState.save();

    res.json({
      message: 'Game state reset successfully',
      gameState: {
        board: gameState.board,
        selected: gameState.selected,
        showResult: gameState.showResult,
        gameStartTime: gameState.gameStartTime,
        lastUpdated: gameState.lastUpdated
      }
    });
  } catch (error) {
    console.error('Reset game state error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Shuffle board (keep selections)
router.post('/shuffle', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    let gameState = await GameState.findOne({ userId });

    if (!gameState) {
      gameState = new GameState({ userId });
    } else {
      // Generate new board but keep current selections
      const statements = [
        "Have worked from an EPAM office or coworking space at least once",
        "Caught myself using IT slang in daily life",
        "Attended more than 50 events according to Telescope stats",
        "Shared my experience as a speaker at an event",
        "Always read news digests to stay updated",
        "Randomly met a colleague outside of work",
        "Joined a call muted and started talking",
        "Donated blood with EPAM UA Donor Community",
        "Received over 10 badges from colleagues in a year",
        "Engaged in IT volunteering",
        "Used Teams background to hide the mess behind",
        "Belong to at least 5 communities",
        "Attended at least 10 trainings or courses provided by the L&D team",
        "Changed level or title during my time at the company",
        "Left a comment on an interview or article on the Infoportal",
        "Donated to EPAM UA internal fundraising campaigns",
        "Referred a friend to a hot vacancy through the referral program",
        "Forgot to turn off the camera and did something funny",
        "Celebrated my 5th anniversary at EPAM",
        "Bought merch from the EPAM Shop",
        "Joined corporate sport challenge",
        "Participated in Green EPAM eco-initiatives",
        "Used a discount or offer from the Benefits portal",
        "Participated in any EPAM hackathon",
        "Was asked to reinstall Windows because 'you're a programmer' :)",
        "Attended EPAM University courses",
        "Participated in internal hackathons",
        "Used EPAM's internal tools daily",
        "Attended company all-hands meetings",
        "Participated in team building activities",
        "Used EPAM's learning platform",
        "Attended technical conferences sponsored by EPAM",
        "Participated in code review processes",
        "Used EPAM's project management tools",
        "Attended client meetings",
        "Participated in agile ceremonies",
        "Used EPAM's communication platforms",
        "Attended performance review meetings",
        "Participated in knowledge sharing sessions",
        "Used EPAM's development environments",
        "Attended company town halls",
        "Participated in mentoring programs",
        "Used EPAM's cloud services",
        "Attended technical training sessions",
        "Participated in cross-team collaborations",
        "Used EPAM's security tools",
        "Attended company social events",
        "Participated in innovation initiatives",
        "Used EPAM's testing frameworks"
      ];
      
      const shuffled = statements.sort(() => 0.5 - Math.random());
      gameState.board = shuffled.slice(0, 25);
      gameState.showResult = false;
      gameState.lastUpdated = new Date();
    }

    await gameState.save();

    res.json({
      message: 'Board shuffled successfully',
      gameState: {
        board: gameState.board,
        selected: gameState.selected,
        showResult: gameState.showResult,
        gameStartTime: gameState.gameStartTime,
        lastUpdated: gameState.lastUpdated
      }
    });
  } catch (error) {
    console.error('Shuffle game state error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear selections only
router.post('/clear-selections', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const gameState = await GameState.findOneAndUpdate(
      { userId },
      { 
        selected: Array(25).fill(false),
        showResult: false,
        lastUpdated: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      message: 'Selections cleared successfully',
      gameState: {
        board: gameState.board,
        selected: gameState.selected,
        showResult: gameState.showResult,
        gameStartTime: gameState.gameStartTime,
        lastUpdated: gameState.lastUpdated
      }
    });
  } catch (error) {
    console.error('Clear selections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
