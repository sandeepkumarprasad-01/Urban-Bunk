const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  checkin: {
    type: Date,
    default: Date.now,
  },
  checkout: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    default: 2,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
