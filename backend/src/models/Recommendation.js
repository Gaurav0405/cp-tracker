const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // "2024-01-15"
  problems: [{
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    solved: { type: Boolean, default: false },
    solvedAt: { type: Date }
  }],
  weakTopics: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);