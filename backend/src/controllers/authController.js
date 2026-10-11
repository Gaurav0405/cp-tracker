const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

const getFirebaseAdmin = () => {
  if (admin.apps.length) return admin.app();

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    const error = new Error('Google sign-in is not configured on the server');
    error.code = 'FIREBASE_AUTH_NOT_CONFIGURED';
    throw error;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    const error = new Error('Firebase service account configuration is invalid');
    error.code = 'FIREBASE_AUTH_NOT_CONFIGURED';
    throw error;
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'cp-tracker-ba295'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== 'string' || !name.trim() ||
        typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email, and a password of at least 6 characters are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: 'local'
    });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar || '',
        streak: user.streak || 0,
        maxStreak: user.maxStreak || 0
      }
    });
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (user.authProvider === 'google') {
      return res.status(400).json({ message: 'Please sign in with Google' });
    }
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar || '',
        streak: user.streak || 0,
        maxStreak: user.maxStreak || 0
      }
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (typeof idToken !== 'string' || !idToken) {
      return res.status(400).json({ message: 'A Firebase ID token is required' });
    }

    const firebaseApp = getFirebaseAdmin();
    let identity;
    try {
      identity = await firebaseApp.auth().verifyIdToken(idToken, true);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired Google sign-in token' });
    }

    if (
      identity.firebase?.sign_in_provider !== 'google.com' ||
      typeof identity.email !== 'string' ||
      identity.email_verified !== true
    ) {
      return res.status(401).json({ message: 'A verified Google account is required' });
    }

    const email = identity.email.trim().toLowerCase();
    const googleId = identity.uid;
    let user = await User.findOne({ googleId });

    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.authProvider !== 'google') {
          return res.status(409).json({
            message: 'An account already exists for this email. Sign in with your password first; accounts are not linked automatically.'
          });
        }
        if (existingUser.googleId && existingUser.googleId !== googleId) {
          return res.status(409).json({ message: 'This email is already linked to a different Google account' });
        }
        existingUser.googleId = googleId;
        user = await existingUser.save();
      } else {
        user = await User.create({
          name: typeof identity.name === 'string' && identity.name.trim()
            ? identity.name.trim()
            : email.split('@')[0],
          email,
          googleId,
          authProvider: 'google',
          avatar: typeof identity.picture === 'string' ? identity.picture : ''
        });
      }
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar || '',
        streak: user.streak || 0,
        maxStreak: user.maxStreak || 0
      }
    });
  } catch (error) {
    if (error.code === 'FIREBASE_AUTH_NOT_CONFIGURED') {
      console.error(error.message);
      return res.status(503).json({ message: 'Google sign-in is temporarily unavailable' });
    }
    console.error('Google authentication failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      avatar: user.avatar || '',
      streak: user.streak || 0,
      maxStreak: user.maxStreak || 0
    });
  } catch (error) {
    console.error('Get current user failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, googleAuth, getMe };
