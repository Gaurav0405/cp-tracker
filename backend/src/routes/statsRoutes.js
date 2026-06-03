const express = require('express');
const router = express.Router();
const { saveHandles, getStats } = require('../controllers/statsController');
const { protect } = require('../utils/authMiddleware');

router.post('/handles', protect, saveHandles);
router.get('/stats', protect, getStats);

// Public profile - no auth needed
router.get('/public/:username', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ name: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      handles: user.handles,
      streak: user.streak || 0,
      maxStreak: user.maxStreak || 0,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;