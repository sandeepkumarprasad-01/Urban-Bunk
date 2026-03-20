const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/listing');
const { isAuthenticated } = require('../middleware/auth');

// Create a booking
router.post('/bookings/:listingId', isAuthenticated, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (checkInDate < now) {
      req.flash('error', 'Check-in date cannot be in the past');
      return res.redirect(`/listings/${listingId}`);
    }

    if (checkOutDate <= checkInDate) {
      req.flash('error', 'Check-out must be after check-in');
      return res.redirect(`/listings/${listingId}`);
    }

    // Find listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    if (!listing.available) {
      req.flash('error', 'This listing is not currently available');
      return res.redirect(`/listings/${listingId}`);
    }

    // Validate guests
    const guestCount = parseInt(guests);
    if (guestCount > listing.maxGuests) {
      req.flash('error', `Maximum ${listing.maxGuests} guests allowed`);
      return res.redirect(`/listings/${listingId}`);
    }

    // Check for conflicting bookings
    const conflicting = await Booking.findOne({
      listing: listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
      ]
    });

    if (conflicting) {
      req.flash('error', 'These dates are already booked. Please choose different dates.');
      return res.redirect(`/listings/${listingId}`);
    }

    // Calculate total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * nights;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    res.redirect(`/bookings/${booking._id}/confirmation`);
  } catch (error) {
    console.error('Booking error:', error);
    req.flash('error', 'Something went wrong while booking');
    res.redirect('/listings');
  }
});

// Booking confirmation page
router.get('/bookings/:id/confirmation', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user');

    if (!booking || booking.user._id.toString() !== req.user._id.toString()) {
      req.flash('error', 'Booking not found');
      return res.redirect('/bookings');
    }

    res.render('bookings/confirmation', { booking });
  } catch (error) {
    console.error('Error loading confirmation:', error);
    res.redirect('/bookings');
  }
});

// User's bookings page
router.get('/bookings', isAuthenticated, async (req, res) => {
  try {
    const now = new Date();
    const tab = req.query.tab || 'upcoming';

    let query = { user: req.user._id };

    if (tab === 'upcoming') {
      query.status = { $in: ['pending', 'confirmed'] };
      query.checkIn = { $gte: now };
    } else if (tab === 'past') {
      query.checkOut = { $lt: now };
      query.status = { $in: ['confirmed'] };
    } else if (tab === 'cancelled') {
      query.status = { $in: ['cancelled', 'rejected'] };
    }

    const bookings = await Booking.find(query)
      .populate('listing')
      .sort({ checkIn: tab === 'past' ? -1 : 1 });

    res.render('bookings/index', { bookings, activeTab: tab });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings');
  }
});

// Cancel a booking
router.post('/bookings/:id/cancel', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      req.flash('error', 'Booking not found');
      return res.redirect('/bookings');
    }

    if (booking.status === 'cancelled') {
      req.flash('error', 'Booking is already cancelled');
      return res.redirect('/bookings');
    }

    booking.status = 'cancelled';
    await booking.save();

    req.flash('success', 'Booking cancelled successfully');
    res.redirect('/bookings');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    req.flash('error', 'Could not cancel booking');
    res.redirect('/bookings');
  }
});

module.exports = router;
