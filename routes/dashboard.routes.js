const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard overview
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get host's listings
    const listings = await Listing.find({ owner: userId });
    const listingIds = listings.map(l => l._id);

    // Get booking stats
    const totalBookings = await Booking.countDocuments({
      listing: { $in: listingIds },
      status: { $in: ['confirmed', 'pending'] }
    });

    const pendingBookings = await Booking.countDocuments({
      listing: { $in: listingIds },
      status: 'pending'
    });

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { listing: { $in: listingIds }, status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get average rating
    const ratingResult = await Review.aggregate([
      { $match: { listing: { $in: listingIds } } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avgRating = ratingResult.length > 0 ? ratingResult[0].avg.toFixed(1) : '0.0';
    const reviewCount = ratingResult.length > 0 ? ratingResult[0].count : 0;

    // Recent bookings
    const recentBookings = await Booking.find({
      listing: { $in: listingIds }
    })
      .populate('listing')
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('dashboard/index', {
      stats: {
        totalListings: listings.length,
        totalBookings,
        pendingBookings,
        totalRevenue,
        avgRating,
        reviewCount
      },
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Dashboard — manage listings
router.get('/dashboard/listings', isAuthenticated, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ checkin: -1 });
    res.render('dashboard/listings', { listings });
  } catch (error) {
    console.error('Dashboard listings error:', error);
    res.status(500).send('Error loading listings');
  }
});

// Dashboard — manage bookings
router.get('/dashboard/bookings', isAuthenticated, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    const listingIds = listings.map(l => l._id);
    const tab = req.query.tab || 'pending';

    let query = { listing: { $in: listingIds } };
    if (tab === 'pending') query.status = 'pending';
    else if (tab === 'confirmed') query.status = 'confirmed';
    else if (tab === 'rejected') query.status = { $in: ['rejected', 'cancelled'] };

    const bookings = await Booking.find(query)
      .populate('listing')
      .populate('user')
      .sort({ createdAt: -1 });

    res.render('dashboard/bookings', { bookings, activeTab: tab });
  } catch (error) {
    console.error('Dashboard bookings error:', error);
    res.status(500).send('Error loading bookings');
  }
});

// Confirm a booking
router.post('/dashboard/bookings/:id/confirm', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking || !booking.listing.owner.equals(req.user._id)) {
      req.flash('error', 'Not authorized');
      return res.redirect('/dashboard/bookings');
    }

    booking.status = 'confirmed';
    await booking.save();
    req.flash('success', 'Booking confirmed!');
    res.redirect('/dashboard/bookings');
  } catch (error) {
    console.error('Confirm booking error:', error);
    req.flash('error', 'Could not confirm booking');
    res.redirect('/dashboard/bookings');
  }
});

// Reject a booking
router.post('/dashboard/bookings/:id/reject', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking || !booking.listing.owner.equals(req.user._id)) {
      req.flash('error', 'Not authorized');
      return res.redirect('/dashboard/bookings');
    }

    booking.status = 'rejected';
    await booking.save();
    req.flash('success', 'Booking rejected');
    res.redirect('/dashboard/bookings');
  } catch (error) {
    console.error('Reject booking error:', error);
    req.flash('error', 'Could not reject booking');
    res.redirect('/dashboard/bookings');
  }
});

// Toggle listing availability
router.post('/dashboard/listings/:id/toggle', isAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || !listing.owner.equals(req.user._id)) {
      req.flash('error', 'Not authorized');
      return res.redirect('/dashboard/listings');
    }

    listing.available = !listing.available;
    await listing.save();
    req.flash('success', `Listing ${listing.available ? 'activated' : 'deactivated'}`);
    res.redirect('/dashboard/listings');
  } catch (error) {
    console.error('Toggle error:', error);
    req.flash('error', 'Could not update listing');
    res.redirect('/dashboard/listings');
  }
});

module.exports = router;
