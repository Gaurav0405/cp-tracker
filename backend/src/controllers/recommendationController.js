const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const { generateRecommendations, analyzeWeakTopics } = require('../services/recommendationEngine');
const { getCodeforcesData } = require('../services/codeforcesService');
const { getLeetcodeData } = require('../services/leetcodeService');
const { syncCodeforcesProblems, syncLeetcodeProblems } = require('../services/problemSyncService');

// Get today's recommendations
const getTodayRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { leetcode, codeforces } = user.handles;

    // Fetch fresh stats
    const stats = {};
    let topicCount = {};

    if (leetcode) {
      try {
        const lcData = await getLeetcodeData(leetcode);
        stats.leetcode = lcData;
        topicCount = { ...topicCount, ...lcData.topicCount };
      } catch (e) {}
    }

    if (codeforces) {
      try {
        const cfData = await getCodeforcesData(codeforces);
        stats.codeforces = cfData;
        Object.entries(cfData.topicCount).forEach(([topic, count]) => {
          topicCount[topic] = (topicCount[topic] || 0) + count;
        });
      } catch (e) {}
    }

    if (Object.keys(topicCount).length === 0) {
      return res.status(400).json({ 
        message: 'Please add at least one platform handle first' 
      });
    }

    const recommendations = await generateRecommendations(
      req.user.id, 
      stats, 
      topicCount
    );

    res.json({
      date: new Date().toISOString().split('T')[0],
      weakTopics: recommendations.weakTopics,
      problems: recommendations.problems
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark a problem as solved
const markSolved = async (req, res) => {
  try {
    const { recommendationId, problemId } = req.body;

    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    const problemEntry = recommendation.problems.find(
      p => p.problem.toString() === problemId
    );

    if (problemEntry) {
      problemEntry.solved = true;
      problemEntry.solvedAt = new Date();
      await recommendation.save();
    }

    res.json({ message: 'Marked as solved!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sync problems from all platforms (admin trigger)
const syncProblems = async (req, res) => {
  try {
    res.json({ message: 'Sync started in background...' });

    // Run in background
    syncCodeforcesProblems().catch(console.error);
    syncLeetcodeProblems().catch(console.error);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTodayRecommendations, markSolved, syncProblems };