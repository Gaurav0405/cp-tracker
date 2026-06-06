const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { protect } = require('../utils/authMiddleware');

router.get('/search', protect, async (req, res) => {
  try {
    const { q, platform, difficulty } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    if (platform && platform !== 'all') query.platform = platform;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    const problems = await Problem.find(query).limit(20).select('title platform difficulty cf_rating tags url');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;