const cron = require('node-cron');
const User = require('../models/User');
const { sendDailyReminder } = require('../services/emailService');

const startCronJobs = () => {
  // Run every day at 8 PM IST (14:30 UTC)
  cron.schedule('30 14 * * *', async () => {
    console.log('🕐 Running daily reminder cron job...');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Find users who haven't visited today and have an email
      const users = await User.find({
        lastActiveDate: { $ne: today },
        email: { $exists: true, $ne: '' },
        authProvider: 'local' // only email users for now
      }).select('name email lastActiveDate');

      console.log(`Found ${users.length} inactive users to remind`);

      let sent = 0;
      for (const user of users) {
        const success = await sendDailyReminder(user.email, user.name);
        if (success) sent++;
        // Small delay to avoid Gmail rate limits
        await new Promise(r => setTimeout(r, 500));
      }

      console.log(`✅ Sent ${sent}/${users.length} reminders`);
    } catch (error) {
      console.error('❌ Cron job failed:', error.message);
    }
  });

  console.log('⏰ Cron jobs started');
};

module.exports = { startCronJobs };