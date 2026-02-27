// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

// Middleware to check if user is the owner of the listing
const isOwner = async (req, res, next) => {
  try {
    const Listing = require('../models/listing');
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    // If listing has no owner, deny access
    if (!listing.owner) {
      req.flash('error', 'This listing cannot be edited or deleted');
      return res.redirect(`/listings/${req.params.id}`);
    }

    // Check if user is logged in and is the owner
    if (!req.isAuthenticated() || !listing.owner.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to perform this action');
      return res.redirect(`/listings/${req.params.id}`);
    }

    req.listing = listing; // Attach listing to request object
    next();
  } catch (error) {
    console.error('Owner check error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect('/listings');
  }
};

module.exports = {
  isAuthenticated,
  isOwner
};
