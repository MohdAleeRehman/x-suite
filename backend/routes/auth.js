const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user info
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName
    }
  });
});

// @route   POST /api/auth/seed
// @desc    Seed the initial umair user (run once)
// @access  Public (should be disabled in production)
router.post('/seed', async (req, res) => {
  try {
    const existing = await User.findOne({ username: 'umair' });
    if (existing) {
      return res.json({ message: 'User umair already exists' });
    }

    const user = await User.create({
      username: 'umair',
      password: 'umair@xsuite2026',
      displayName: 'Umair'
    });

    res.status(201).json({
      message: 'User umair created successfully',
      username: user.username
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Error seeding user' });
  }
});

module.exports = router;
