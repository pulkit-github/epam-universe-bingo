const mongoose = require('mongoose');
const Score = require('../models/Score');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bingo-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function cleanupDuplicates() {
  try {
    console.log('Starting cleanup of duplicate scores...');
    
    // Get all scores grouped by userId
    const scoresByUser = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          scores: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 } // Only users with more than one score
        }
      }
    ]);

    console.log(`Found ${scoresByUser.length} users with duplicate scores`);

    for (const userGroup of scoresByUser) {
      const userId = userGroup._id;
      const scores = userGroup.scores;
      
      console.log(`\nProcessing user ${userId} with ${scores.length} scores:`);
      
      // Sort by createdAt (keep the most recent)
      scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Keep the most recent score
      const keepScore = scores[0];
      const deleteScores = scores.slice(1);
      
      console.log(`Keeping score: ${keepScore._id} (created: ${keepScore.createdAt})`);
      console.log(`Deleting ${deleteScores.length} duplicate scores:`);
      
      for (const score of deleteScores) {
        console.log(`  - ${score._id} (created: ${score.createdAt})`);
        await Score.findByIdAndDelete(score._id);
      }
    }

    console.log('\nCleanup completed successfully!');
    
    // Verify no duplicates remain
    const remainingDuplicates = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (remainingDuplicates.length === 0) {
      console.log('✅ No duplicate scores remain');
    } else {
      console.log(`❌ ${remainingDuplicates.length} users still have duplicate scores`);
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupDuplicates();
