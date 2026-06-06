const express = require('express');
const router = express.Router();
const { protect } = require('../utils/authMiddleware');
const User = require('../models/User');

// Search users by name
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const users = await User.find({
      name: { $regex: q, $options: 'i' },
      _id: { $ne: req.user.id }
    }).select('name email streak maxStreak totalSolved').limit(5);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add friend
router.post('/add/:friendId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.friends.includes(req.params.friendId)) {
      return res.status(400).json({ message: 'Already friends' });
    }
    user.friends.push(req.params.friendId);
    await user.save();
    res.json({ message: 'Friend added!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/remove/:friendId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(f => f.toString() !== req.params.friendId);
    await user.save();
    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard (me + friends)
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'name streak maxStreak totalSolved handles');
    
    const me = {
      _id: user._id,
      name: user.name,
      streak: user.streak || 0,
      maxStreak: user.maxStreak || 0,
      totalSolved: user.totalSolved || 0,
      isMe: true
    };

    const friends = user.friends.map(f => ({
      _id: f._id,
      name: f.name,
      streak: f.streak || 0,
      maxStreak: f.maxStreak || 0,
      totalSolved: f.totalSolved || 0,
      isMe: false
    }));

    const leaderboard = [me, ...friends].sort((a, b) => b.totalSolved - a.totalSolved);
    res.json({ leaderboard, friendIds: user.friends.map(f => f._id.toString()) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;