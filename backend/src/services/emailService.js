const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendDailyReminder = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"CP Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔥 Don\'t break your streak! Solve a problem today',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0;padding:0;background:#0d1117;font-family:'Inter',-apple-system,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:2rem;">
            
            <div style="text-align:center;margin-bottom:2rem;">
              <span style="font-size:1.5rem;font-weight:700;color:#58a6ff;">⚡ CP Tracker</span>
            </div>

            <div style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:2rem;margin-bottom:1.5rem;">
              <h1 style="color:#f0f6fc;font-size:1.25rem;font-weight:700;margin:0 0 0.75rem;">
                Hey ${name}! 👋
              </h1>
              <p style="color:#8b949e;font-size:0.95rem;line-height:1.6;margin:0 0 1.5rem;">
                You haven't solved any problems today. Don't let your streak break!
                Your daily problem recommendations are waiting for you.
              </p>
              <a 
                href="https://buildmyresumes.online/dashboard"
                style="display:inline-block;background:#1f6feb;color:white;padding:0.75rem 1.5rem;border-radius:8px;font-size:0.95rem;font-weight:600;text-decoration:none;"
              >
                View Today's Problems →
              </a>
            </div>

            <div style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:1.25rem;text-align:center;">
              <p style="color:#8b949e;font-size:0.8rem;margin:0;">
                Keep solving, keep growing 🚀<br/>
                <a href="https://buildmyresumes.online" style="color:#58a6ff;">buildmyresumes.online</a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Reminder sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    return false;
  }
};

module.exports = { sendDailyReminder };