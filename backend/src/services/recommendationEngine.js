const Problem = require('../models/Problem');
const Recommendation = require('../models/Recommendation');

const TOPIC_MAP = {
  'Dynamic Programming': ['dp', 'dynamic programming'],
  'Graph Theory': ['graphs', 'graph theory', 'dfs and similar', 'bfs'],
  'Trees': ['trees', 'tree', 'binary tree'],
  'Binary Search': ['binary search'],
  'Greedy': ['greedy'],
  'Two Pointers': ['two pointers'],
  'Sorting': ['sortings', 'sorting'],
  'Math': ['math', 'mathematics', 'number theory'],
  'String': ['strings', 'string'],
  'Array': ['arrays', 'array'],
  'Backtracking': ['backtracking'],
  'Trie': ['trie', 'tries'],
  'Union Find': ['dsu', 'union find'],
  'Segment Tree': ['data structures', 'segment tree'],
  'Bit Manipulation': ['bitmasks', 'bit manipulation'],
  'Stack': ['stacks', 'stack'],
  'Recursion': ['recursion', 'divide and conquer'],
  'Sliding Window': ['sliding window', 'two pointers'],
  'Monotonic Stack': ['monotonic stack', 'stacks'],
  'Shortest Path': ['shortest paths', 'shortest path'],
  'Topological Sort': ['graphs', 'topological sort']
};

const analyzeWeakTopics = (topicCount) => {
  const scored = [];
  for (const [topic, count] of Object.entries(topicCount)) {
    scored.push({ topic, count });
  }
  scored.sort((a, b) => a.count - b.count);
  return scored.slice(0, 5).map(t => t.topic);
};

const getTargetDifficulty = (stats) => {
  const lc = stats.leetcode;
  const cf = stats.codeforces;

  if (cf) {
    if (cf.rating < 1200) return { min: 800, max: 1400 };
    if (cf.rating < 1600) return { min: 1200, max: 1800 };
    if (cf.rating < 2000) return { min: 1600, max: 2200 };
    return { min: 2000, max: 3500 };
  }

  if (lc) {
    const hard = lc.hard || 0;
    const medium = lc.medium || 0;
    if (hard > 20) return 'hard';
    if (medium > 50) return 'medium';
    return 'easy';
  }

  return 'easy';
};

const generateRecommendations = async (userId, stats, topicCount) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const existing = await Recommendation.findOne({ userId, date: today });
    if (existing) {
      return await existing.populate('problems.problem');
    }

    const weakTopics = analyzeWeakTopics(topicCount);
    console.log('🧠 Weak topics detected:', weakTopics);

    const targetDifficulty = getTargetDifficulty(stats);
    const recommendedProblems = [];
    const addedIds = new Set();

    // Round 1 — Get up to 3 Codeforces problems by weak topic tags
    for (const topic of weakTopics) {
      if (recommendedProblems.length >= 3) break;

      const tagVariants = TOPIC_MAP[topic] || [topic.toLowerCase()];

      const cfQuery = {
        platform: 'codeforces',
        tags: { $in: tagVariants.map(t => new RegExp(t, 'i')) },
        cf_rating: typeof targetDifficulty === 'object'
          ? { $gte: targetDifficulty.min, $lte: targetDifficulty.max }
          : { $gte: 800, $lte: 1600 }
      };

      const cfProblems = await Problem.find(cfQuery).limit(1);
      for (const p of cfProblems) {
        if (!addedIds.has(p._id.toString())) {
          addedIds.add(p._id.toString());
          recommendedProblems.push({ problem: p._id, solved: false });
        }
      }
    }

    // Round 2 — Fill remaining slots with LeetCode problems
    const lcDifficulty = typeof targetDifficulty === 'object' ? 'medium' : targetDifficulty;
    const lcProblems = await Problem.find({
      platform: 'leetcode',
      difficulty: lcDifficulty,
      _id: { $nin: [...addedIds] }
    }).skip(Math.floor(Math.random() * 1000)).limit(5 - recommendedProblems.length);

    for (const p of lcProblems) {
      if (recommendedProblems.length >= 5) break;
      if (!addedIds.has(p._id.toString())) {
        addedIds.add(p._id.toString());
        recommendedProblems.push({ problem: p._id, solved: false });
      }
    }

    // Round 3 — Final fallback if still under 5
    if (recommendedProblems.length < 5) {
      const fallback = await Problem.find({
        difficulty: lcDifficulty,
        _id: { $nin: [...addedIds] }
      }).limit(5 - recommendedProblems.length);

      for (const p of fallback) {
        if (!addedIds.has(p._id.toString())) {
          addedIds.add(p._id.toString());
          recommendedProblems.push({ problem: p._id, solved: false });
        }
      }
    }

    const recommendation = await Recommendation.create({
      userId,
      date: today,
      problems: recommendedProblems,
      weakTopics
    });

    return await Recommendation.findById(recommendation._id)
      .populate('problems.problem');

  } catch (error) {
    throw new Error(`Recommendation engine error: ${error.message}`);
  }
};

module.exports = { generateRecommendations, analyzeWeakTopics };