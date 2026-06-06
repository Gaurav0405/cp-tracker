const User = require('../models/User');
const { getCodeforcesData } = require('../services/codeforcesService');
const { getLeetcodeData } = require('../services/leetcodeService');
const { getCodechefData } = require('../services/codechefService');
const { getGFGData } = require('../services/gfgService');
const { getHackerRankData } = require('../services/hackerrankService');
const { getHackerEarthData } = require('../services/hackerEarthService');

const saveHandles = async (req, res) => {
  try {
    const { leetcode, codeforces, codechef, geeksforgeeks, hackerrank, hackerearth } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { handles: { leetcode, codeforces, codechef, geeksforgeeks, hackerrank, hackerearth } },
      { new: true }
    ).select('-password');
    res.json({ message: 'Handles saved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const currentUser = await User.findById(req.user.id);

    if (currentUser.lastActiveDate === yesterday) {
      currentUser.streak = (currentUser.streak || 0) + 1;
    } else if (currentUser.lastActiveDate !== today) {
      currentUser.streak = 1;
    }

    if (currentUser.streak > (currentUser.maxStreak || 0)) {
      currentUser.maxStreak = currentUser.streak;
    }

    currentUser.lastActiveDate = today;

    const user = currentUser;
    const { leetcode, codeforces, codechef, geeksforgeeks, hackerrank, hackerearth } = user.handles;

    const results = {};
    const errors = {};
    const promises = [];

    if (codeforces) {
      promises.push(
        getCodeforcesData(codeforces)
          .then(data => { results.codeforces = data; })
          .catch(err => { errors.codeforces = err.message; })
      );
    }
    if (leetcode) {
      promises.push(
        getLeetcodeData(leetcode)
          .then(data => { results.leetcode = data; })
          .catch(err => { errors.leetcode = err.message; })
      );
    }
    if (codechef) {
      promises.push(
        getCodechefData(codechef)
          .then(data => { results.codechef = data; })
          .catch(err => { errors.codechef = err.message; })
      );
    }
    if (geeksforgeeks) {
      promises.push(
        getGFGData(geeksforgeeks)
          .then(data => { results.geeksforgeeks = data; })
          .catch(err => { errors.geeksforgeeks = err.message; })
      );
    }
    if (hackerrank) {
      promises.push(
        getHackerRankData(hackerrank)
          .then(data => { results.hackerrank = data; })
          .catch(err => { errors.hackerrank = err.message; })
      );
    }
    if (hackerearth) {
      promises.push(
        getHackerEarthData(hackerearth)
          .then(data => { results.hackerearth = data; })
          .catch(err => { errors.hackerearth = err.message; })
      );
    }

    await Promise.all(promises);

    const totalSolved =
      (results.codeforces?.solvedCount || 0) +
      (results.leetcode?.solvedCount || 0) +
      (results.codechef?.solvedCount || 0) +
      (results.geeksforgeeks?.solvedCount || 0) +
      (results.hackerrank?.solvedCount || 0) +
      (results.hackerearth?.solvedCount || 0);

    // Save totalSolved to user for leaderboard
    currentUser.totalSolved = totalSolved;
    await currentUser.save();

    res.json({
      handles: user.handles,
      stats: results,
      totalSolved,
      errors,
      streak: currentUser.streak,
      maxStreak: currentUser.maxStreak
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { saveHandles, getStats };