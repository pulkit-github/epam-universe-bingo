const mongoose = require('mongoose');
const Score = require('../models/Score');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bingo-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAndFixIndex() {
  try {
    console.log('Checking current database state...');
    
    // Check if there are still duplicate scores
    const duplicates = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          scores: { $push: '$$ROOT' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${duplicates.length} users with duplicate scores`);

    if (duplicates.length > 0) {
      console.log('Cleaning up remaining duplicates...');
      for (const userGroup of duplicates) {
        const userId = userGroup._id;
        const scores = userGroup.scores;
        
        console.log(`\nProcessing user ${userId} with ${scores.length} scores:`);
        
        // Sort by createdAt (keep the most recent)
        scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Keep the most recent score
        const keepScore = scores[0];
        const deleteScores = scores.slice(1);
        
        console.log(`Keeping score: ${keepScore._id} (created: ${keepScore.createdAt})`);
        
        for (const score of deleteScores) {
          console.log(`  - Deleting ${score._id} (created: ${score.createdAt})`);
          await Score.findByIdAndDelete(score._id);
        }
      }
    }

    // Drop and recreate the unique index
    console.log('\nDropping existing indexes...');
    try {
      await Score.collection.dropIndex('userId_1');
      console.log('Dropped existing userId index');
    } catch (err) {
      console.log('No existing userId index to drop');
    }

    console.log('Creating unique index on userId...');
    await Score.collection.createIndex({ userId: 1 }, { unique: true });
    console.log('✅ Unique index created successfully');

    // Verify the index
    const indexes = await Score.collection.getIndexes();
    console.log('\nCurrent indexes:');
    indexes.forEach(index => {
      console.log(`- ${JSON.stringify(index)}`);
    });

    // Test the unique constraint
    console.log('\nTesting unique constraint...');
    const testScores = await Score.find({});
    console.log(`Total scores in database: ${testScores.length}`);
    
    const uniqueUsers = new Set(testScores.map(s => s.userId.toString()));
    console.log(`Unique users: ${uniqueUsers.size}`);
    
    if (testScores.length === uniqueUsers.size) {
      console.log('✅ Database is clean - one score per user');
    } else {
      console.log('❌ Database still has duplicates');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAndFixIndex();
