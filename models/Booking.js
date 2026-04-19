const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  // Payment fields
  paymentId: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', null],
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paidAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient lookups
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
