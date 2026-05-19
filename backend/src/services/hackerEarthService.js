const axios = require('axios');

const getHackerEarthData = async (handle) => {
  try {
    const res = await axios.get(
      `https://www.hackerearth.com/api/developer/challenges/?username=${handle}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
      }
    );

    const data = res.data;

    return {
      platform: 'hackerearth',
      handle,
      solvedCount: data.total || 0,
      rating: data.rating || 0,
      percentile: data.percentile || 0
    };

  } catch (error) {
    throw new Error(`HackerEarth error: ${error.message}`);
  }
};

module.exports = { getHackerEarthData };