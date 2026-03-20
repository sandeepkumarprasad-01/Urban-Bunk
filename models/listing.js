const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CATEGORIES = [
  'Beach', 'Mountain', 'City', 'Countryside', 'Lake', 'Desert', 'Island', 'Cabin'
];

const PROPERTY_TYPES = [
  'Apartment', 'House', 'Villa', 'Cabin', 'Tent', 'Treehouse', 'Resort', 'Houseboat'
];

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
  category: {
    type: String,
    enum: CATEGORIES,
    default: 'City'
  },
  propertyType: {
    type: String,
    enum: PROPERTY_TYPES,
    default: 'Apartment'
  },
  amenities: {
    type: [String],
    default: ['WiFi', 'Air Conditioning']
  },
  checkin: {
    type: Date,
    default: Date.now,
  },
  checkout: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
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

listingSchema.statics.CATEGORIES = CATEGORIES;
listingSchema.statics.PROPERTY_TYPES = PROPERTY_TYPES;

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
