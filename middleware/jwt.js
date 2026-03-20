const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'urbanbunk-jwt-secret-change-in-production';

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware: Require authentication
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
}

// Middleware: Optional auth (attaches user if token present, but doesn't require it)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) req.user = user;
    }
  } catch (e) {
    // Token invalid — that's fine, just proceed without user
  }
  next();
}

// Middleware: Require ownership of a listing
async function requireOwner(req, res, next) {
  try {
    const Listing = require('../models/listing');
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.owner || !listing.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    req.listing = listing;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { generateToken, requireAuth, optionalAuth, requireOwner, JWT_SECRET };
