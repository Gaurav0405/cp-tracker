const express = require('express');
const router = express.Router();
const { saveHandles, getStats } = require('../controllers/statsController');
const { protect } = require('../utils/authMiddleware');
const User = require('../models/User');

router.post('/handles', protect, saveHandles);
router.get('/stats', protect, getStats);

// Avatar upload
router.post('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'No avatar provided' });
    if (avatar.length > 500000) return res.status(400).json({ message: 'Image too large. Max 500KB.' });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    ).select('-password');
    res.json({ message: 'Avatar updated!', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public profile
router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      name: user.name,
      handles: user.handles,
      streak: user.streak || 0,
      maxStreak: user.maxStreak || 0,
      createdAt: user.createdAt,
      avatar: user.avatar || '',
      totalSolved: user.totalSolved || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;