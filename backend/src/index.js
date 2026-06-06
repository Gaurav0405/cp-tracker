require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const app = require('./app');
const { startCronJobs } = require('./utils/cronJobs');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      startCronJobs();
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });