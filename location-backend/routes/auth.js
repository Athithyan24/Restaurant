const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to bundle signed token handshakes
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

// @route   POST /api/auth/login
// @desc    Authenticate User & Return Token Session
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Lookup user profile entry
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid departmental credentials.' });
    }

    // Cross-check encrypted credentials signatures
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid departmental credentials.' });
    }

    // Construct response packet expected by React's AuthContext state machine
    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server-side error handling authentication process.' });
  }
});

// @route   GET /api/auth/me
// @desc    Validate Existing JWT and Return User Profile Context
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve secure session parameters.' });
  }
});

module.exports = router;