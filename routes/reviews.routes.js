const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

// Create a review
router.post('/listings/:id/reviews', isAuthenticated, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listingId = req.params.id;

    // Check if user already reviewed this listing
    const existing = await Review.findOne({ user: req.user._id, listing: listingId });
    if (existing) {
      req.flash('error', 'You have already reviewed this listing');
      return res.redirect(`/listings/${listingId}`);
    }

    const review = new Review({
      user: req.user._id,
      listing: listingId,
      rating: parseInt(rating),
      comment
    });

    await review.save();
    req.flash('success', 'Review submitted successfully!');
    res.redirect(`/listings/${listingId}`);
  } catch (error) {
    console.error('Review error:', error);
    req.flash('error', 'Could not submit review');
    res.redirect(`/listings/${req.params.id}`);
  }
});

// Delete a review
router.post('/listings/:id/reviews/:reviewId/delete', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review || review.user.toString() !== req.user._id.toString()) {
      req.flash('error', 'Cannot delete this review');
      return res.redirect(`/listings/${req.params.id}`);
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/listings/${req.params.id}`);
  } catch (error) {
    console.error('Delete review error:', error);
    req.flash('error', 'Could not delete review');
    res.redirect(`/listings/${req.params.id}`);
  }
});

module.exports = router;
