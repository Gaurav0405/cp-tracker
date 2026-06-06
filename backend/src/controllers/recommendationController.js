const Recommendation = require('../models/Recommendation');
const { generateRecommendations, analyzeWeakTopics } = require('../services/recommendationEngine');
const Problem = require('../models/Problem');
const { getCodeforcesProblems } = require('../services/problemSyncService');

const getTodayRecommendations = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    if (!user.handles || (!user.handles.leetcode && !user.handles.codeforces)) {
      return res.status(400).json({ message: 'No handles set' });
    }

    const { getCodeforcesData } = require('../services/codeforcesService');
    const { getLeetcodeData } = require('../services/leetcodeService');

    let stats = {};
    let topicCount = {};

    if (user.handles.codeforces) {
      try {
        stats.codeforces = await getCodeforcesData(user.handles.codeforces);
      } catch (e) {}
    }

    if (user.handles.leetcode) {
      try {
        stats.leetcode = await getLeetcodeData(user.handles.leetcode);
        if (stats.leetcode && stats.leetcode.topicCount) {
          topicCount = stats.leetcode.topicCount;
        }
      } catch (e) {}
    }

    if (Object.keys(topicCount).length === 0) {
      topicCount = {
        'Dynamic Programming': 5,
        'Graph Theory': 3,
        'Trees': 4,
        'Binary Search': 6,
        'Greedy': 2
      };
    }

    const recommendations = await generateRecommendations(req.user.id, stats, topicCount);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markSolved = async (req, res) => {
  try {
    const { problemId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const recommendation = await Recommendation.findOne({
      userId: req.user.id,
      date: today
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendations found for today' });
    }

    const problemEntry = recommendation.problems.find(
      p => p.problem.toString() === problemId
    );

    if (!problemEntry) {
      return res.status(404).json({ message: 'Problem not found in today\'s recommendations' });
    }

    problemEntry.solved = !problemEntry.solved;
    await recommendation.save();

    res.json({
      message: problemEntry.solved ? 'Marked as solved!' : 'Marked as unsolved',
      solved: problemEntry.solved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const syncProblems = async (req, res) => {
  try {
    const count = await getCodeforcesProblems();
    res.json({ message: `Synced ${count} problems` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTodayRecommendations, markSolved, syncProblems };