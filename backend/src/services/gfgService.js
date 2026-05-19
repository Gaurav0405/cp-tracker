const axios = require('axios');

const getGFGData = async (handle) => {
  try {
    const res = await axios.get(
      `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${handle}`,
      { timeout: 10000 }
    );

    const data = res.data;
    if (data.status === 'error') {
      throw new Error('User not found on GeeksForGeeks');
    }

    const info = data.info || {};
    const solvedStats = data.solvedStats || {};

    const easy = solvedStats.easy?.count || 0;
    const medium = solvedStats.medium?.count || 0;
    const hard = solvedStats.hard?.count || 0;

    return {
      platform: 'geeksforgeeks',
      handle,
      solvedCount: info.totalProblemsSolved || (easy + medium + hard),
      easy,
      medium,
      hard,
      score: info.codingScore || 0,
      monthlyScore: info.monthlyScore || 0,
      rank: info.instituteRank || 'N/A'
    };

  } catch (error) {
    throw new Error(`GeeksForGeeks error: ${error.message}`);
  }
};

module.exports = { getGFGData };