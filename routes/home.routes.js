const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');

// Home Route
router.get("/", async (req, res) => {
  try {
    // Get 3 random listings for the home page
    const allListings = await Listing.find({});
    const randomListings = [];
    
    if (allListings.length > 0) {
      // Shuffle array and take first 3
      const shuffled = [...allListings].sort(() => 0.5 - Math.random());
      randomListings.push(...shuffled.slice(0, 3));
    }
    
    res.render("home.ejs", { allListings: randomListings });
  } catch (error) {
    console.error("Error fetching listings for home:", error);
    res.render("home.ejs", { allListings: [] });
  }
});

module.exports = router;
