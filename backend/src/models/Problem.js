const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { 
    type: String, 
    enum: ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'hackerrank', 'hackerearth'],
    required: true 
  },
  url: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  cf_rating: { type: Number }, // Codeforces specific
  tags: [{ type: String }],
  platformProblemId: { type: String }, // e.g. "1547C" for CF, "300" for LC
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate problems
problemSchema.index({ platform: 1, platformProblemId: 1 }, { unique: true });

module.exports = mongoose.model('Problem', problemSchema);