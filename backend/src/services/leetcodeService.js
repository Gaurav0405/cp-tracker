const axios = require('axios');

const getLeetcodeData = async (handle) => {
  try {
    // LeetCode uses GraphQL API
    const query = `
      query getUserData($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          tagProblemCounts {
            advanced {
              tagName
              problemsSolved
            }
            intermediate {
              tagName
              problemsSolved
            }
            fundamental {
              tagName
              problemsSolved
            }
          }
        }
      }
    `;

    const res = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username: handle } },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const user = res.data.data.matchedUser;
    if (!user) throw new Error('User not found on LeetCode');

    // Extract solved counts by difficulty
    const stats = user.submitStatsGlobal.acSubmissionNum;
    const easy = stats.find(s => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find(s => s.difficulty === 'Hard')?.count || 0;
    const solvedCount = easy + medium + hard;

    // Build topic count
    const topicCount = {};
    const allTags = [
      ...user.tagProblemCounts.fundamental,
      ...user.tagProblemCounts.intermediate,
      ...user.tagProblemCounts.advanced
    ];
    allTags.forEach(tag => {
      if (tag.problemsSolved > 0) {
        topicCount[tag.tagName] = tag.problemsSolved;
      }
    });

    return {
      platform: 'leetcode',
      handle,
      solvedCount,
      easy,
      medium,
      hard,
      ranking: user.profile.ranking,
      topicCount
    };

  } catch (error) {
    throw new Error(`LeetCode error: ${error.message}`);
  }
};

module.exports = { getLeetcodeData };