const axios = require('axios');

const getCodeforcesData = async (handle) => {
  try {
    // Get user info (rating, rank)
    const userRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const user = userRes.data.result[0];

    // Get user submissions
    const subRes = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}&count=1000`
    );
    const submissions = subRes.data.result;

    // Get contest history
    const contestRes = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const contests = contestRes.data.result;

    // Process solved problems (only accepted, no duplicates)
    const solvedSet = new Set();
    const topicCount = {};
    let solvedCount = 0;

    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!solvedSet.has(problemId)) {
          solvedSet.add(problemId);
          solvedCount++;

          // Count topics
          if (sub.problem.tags) {
            sub.problem.tags.forEach((tag) => {
              topicCount[tag] = (topicCount[tag] || 0) + 1;
            });
          }
        }
      }
    });

    // Build rating graph data
    const ratingGraph = contests.map((c) => ({
      contestName: c.contestName,
      rating: c.newRating,
      date: new Date(c.ratingUpdateTimeSeconds * 1000)
    }));

    return {
      platform: 'codeforces',
      handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'unrated',
      solvedCount,
      topicCount,
      ratingGraph,
      avatar: user.avatar
    };

  } catch (error) {
    throw new Error(`Codeforces error: ${error.message}`);
  }
};

module.exports = { getCodeforcesData };