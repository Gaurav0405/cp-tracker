const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', statsRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CP Tracker API is running!' });
});

module.exports = app;