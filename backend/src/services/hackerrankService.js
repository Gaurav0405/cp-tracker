const axios = require('axios');

const getHackerRankData = async (handle) => {
  try {
    const res = await axios.get(
      `https://www.hackerrank.com/rest/hackers/${handle}/scores_elo`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
      }
    );

    const data = res.data;

    // Get badges
    const badgesRes = await axios.get(
      `https://www.hackerrank.com/rest/hackers/${handle}/badges`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000
      }
    );

    const badges = badgesRes.data.models || [];
    const totalSolved = badges.reduce((sum, badge) => {
      return sum + (badge.solved || 0);
    }, 0);

    return {
      platform: 'hackerrank',
      handle,
      solvedCount: totalSolved,
      badges: badges.map(b => ({
        name: b.name,
        stars: b.stars,
        solved: b.solved
      }))
    };

  } catch (error) {
    throw new Error(`HackerRank error: ${error.message}`);
  }
};

module.exports = { getHackerRankData };