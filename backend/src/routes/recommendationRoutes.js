const express = require('express');
const router = express.Router();
const {
  getTodayRecommendations,
  markSolved,
  syncProblems
} = require('../controllers/recommendationController');
const { protect } = require('../utils/authMiddleware');
const Recommendation = require('../models/Recommendation');

router.get('/today', protect, getTodayRecommendations);
router.post('/solved', protect, markSolved);
router.post('/sync', protect, syncProblems);

// Clear today's recommendations to force regeneration
router.delete('/clear', protect, async (req, res) => {
  await Recommendation.deleteMany({ userId: req.user.id });
  res.json({ message: 'Cleared!' });
});

module.exports = router;