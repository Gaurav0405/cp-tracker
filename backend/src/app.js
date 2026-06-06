const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const friendRoutes = require('./routes/friendRoutes');
const problemRoutes = require('./routes/problemRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://buildmyresumes.online', 'http://buildmyresumes.online'],
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', statsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/problems', problemRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CP Tracker API is running!' });
});

module.exports = app;