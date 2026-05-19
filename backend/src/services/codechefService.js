const axios = require('axios');

const getCodechefData = async (handle) => {
  try {
    const res = await axios.get(
      `https://codechef-api.vercel.app/handle/${handle}`
    );

    const data = res.data;
    if (!data || data.success === false) {
      throw new Error('User not found on CodeChef');
    }

    return {
      platform: 'codechef',
      handle,
      rating: data.currentRating || 0,
      maxRating: data.highestRating || 0,
      stars: data.stars || '1★',
      solvedCount: data.totalProblemsSolved || 0,
      globalRank: data.globalRank || 'N/A',
      countryRank: data.countryRank || 'N/A'
    };

  } catch (error) {
    throw new Error(`CodeChef error: ${error.message}`);
  }
};

module.exports = { getCodechefData };