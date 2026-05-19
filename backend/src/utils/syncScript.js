require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

// Load env from backend/.env
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Problem = require('../models/Problem');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  try {
    console.log('🔄 Syncing LeetCode problems...');

    const res = await axios.get('https://leetcode.com/api/problems/all/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      timeout: 30000
    });

    const problems = res.data.stat_status_pairs;
    console.log(`Found ${problems.length} problems`);

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
          { title: stat.question__title, platform: 'leetcode', url, difficulty, tags: [], platformProblemId: id },
          { upsert: true }
        );
        added++;
        if (added % 100 === 0) console.log(`Progress: ${added} added...`);
      } catch (err) {
        skipped++;
      }
    }

    console.log(`✅ LeetCode sync done: ${added} added, ${skipped} skipped`);
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }

  await mongoose.disconnect();
  console.log('Done!');
};

run();