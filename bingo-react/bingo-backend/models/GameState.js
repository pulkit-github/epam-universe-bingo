const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One game state per user
  },
  board: {
    type: [String],
    required: true,
    default: function() {
      // Generate a random board of 25 statements
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
      
      // Shuffle and take first 25
      const shuffled = statements.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 25);
    }
  },
  selected: {
    type: [Boolean],
    required: true,
    default: Array(25).fill(false)
  },
  showResult: {
    type: Boolean,
    default: false
  },
  gameStartTime: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
gameStateSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Index for efficient queries
gameStateSchema.index({ userId: 1 });

module.exports = mongoose.model('GameState', gameStateSchema);
