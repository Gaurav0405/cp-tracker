const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  handles: {
  leetcode: { type: String, default: '' },
  codeforces: { type: String, default: '' },
  codechef: { type: String, default: '' },
  geeksforgeeks: { type: String, default: '' },
  hackerrank: { type: String, default: '' },
  hackerearth: { type: String, default: '' },
},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);