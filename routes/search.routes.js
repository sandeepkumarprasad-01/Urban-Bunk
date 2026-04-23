const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');

// Search Route
router.get("/search", async (req, res) => {
  try {
    const { location, checkin, checkout, guests } = req.query;
    
    // Build search query - include available listings or those that don't have available set to false
    let searchQuery = { available: { $ne: false } };
    
    // Add location filter (case-insensitive partial match)
    if (location) {
      searchQuery.$or = [
        { location: { $regex: location, $options: 'i' } },
        { country: { $regex: location, $options: 'i' } },
        { title: { $regex: location, $options: 'i' } }
      ];
    }
    
    // Add guest capacity filter
    if (guests) {
      const guestCount = parseInt(guests);
      if (!isNaN(guestCount)) {
        searchQuery.maxGuests = { $gte: guestCount };
      }
    }
    
    // Add date availability filter
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      
      searchQuery.$and = searchQuery.$and || [];
      searchQuery.$and.push(
        {
          $or: [
            { checkin: { $lte: checkinDate }, checkout: { $gte: checkoutDate } },
            { checkin: { $gte: checkinDate, $lte: checkoutDate } },
            { checkout: { $gte: checkinDate, $lte: checkoutDate } }
          ]
        }
      );
    }
    
    const searchResults = await Listing.find(searchQuery);
    
    res.render("search/results", { 
      searchResults, 
      searchQuery: { location, checkin, checkout, guests },
      totalResults: searchResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send('Search error');
  }
});

module.exports = router;
