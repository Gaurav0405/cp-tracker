const axios = require('axios');
const Problem = require('../models/Problem');

// Sync Codeforces problems to DB
const syncCodeforcesProblems = async () => {
  try {
    console.log('🔄 Syncing Codeforces problems...');
    
    const res = await axios.get('https://codeforces.com/api/problemset.problems');
    const problems = res.data.result.problems;

    let added = 0;
    let skipped = 0;

    for (const p of problems) {
      if (!p.rating || !p.tags || p.tags.length === 0) {
        skipped++;
        continue;
      }

      // Map CF rating to difficulty
      let difficulty = 'medium';
      if (p.rating <= 1300) difficulty = 'easy';
      else if (p.rating >= 2000) difficulty = 'hard';

      const platformProblemId = `${p.contestId}${p.index}`;
      const url = `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;

      try {
        await Problem.findOneAndUpdate(
          { platform: 'codeforces', platformProblemId },
          {
            title: p.name,
            platform: 'codeforces',
            url,
            difficulty,
            cf_rating: p.rating,
            tags: p.tags,
            platformProblemId
          },
          { upsert: true, new: true }
        );
        added++;
      } catch (err) {
        skipped++;
      }
    }

    console.log(`✅ Codeforces sync done: ${added} problems added/updated, ${skipped} skipped`);
    return { added, skipped };

  } catch (error) {
    console.error('❌ Codeforces sync failed:', error.message);
    throw error;
  }
};

// Sync LeetCode problems to DB
const syncLeetcodeProblems = async () => {
  try {
    console.log('🔄 Syncing LeetCode problems...');

    const res = await axios.get(
      'https://leetcode.com/api/problems/all/',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        timeout: 30000
      }
    );

    const problems = res.data.stat_status_pairs;
    console.log(`Found ${problems.length} LeetCode problems`);

    let added = 0;
    let skipped = 0;

    for (const p of problems) {
      const stat = p.stat;
      const difficulty = p.difficulty.level === 1 ? 'easy' : p.difficulty.level === 2 ? 'medium' : 'hard';
      const slug = stat.question__title_slug;
      const url = `https://leetcode.com/problems/${slug}/`;
      const id = String(stat.frontend_question_id);

      try {
        await Problem.findOneAndUpdate(
          { platform: 'leetcode', platformProblemId: id },
          {
            title: stat.question__title,
            platform: 'leetcode',
            url,
            difficulty,
            tags: [],
            platformProblemId: id
          },
          { upsert: true, new: true }
        );
        added++;
      } catch (err) {
        skipped++;
      }
    }

    console.log(`✅ LeetCode sync done: ${added} problems added/updated, ${skipped} skipped`);
    return { added, skipped };

  } catch (error) {
    console.error('❌ LeetCode sync failed:', error.message);
    throw error;
  }
};

module.exports = { syncCodeforcesProblems, syncLeetcodeProblems };