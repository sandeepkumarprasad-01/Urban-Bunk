const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

// Register form
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - UrbanBUNK',
    errors: req.flash('error'),
    success: req.flash('success')
  });
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long');
      return res.redirect('/register');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      req.flash('error', 'User with this email or username already exists');
      return res.redirect('/register');
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - UrbanBUNK',
    errors: req.flash('error'),
    success: req.flash('success')
  });
});

// Login handler
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
});

module.exports = router;
