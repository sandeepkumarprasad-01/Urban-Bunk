const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
