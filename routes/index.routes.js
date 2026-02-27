const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const { isAuthenticated, isOwner } = require('../middleware/auth');

// Index Route
router.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route - Protected
router.get("/listings/new", isAuthenticated, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate('owner');
  res.render("listings/show.ejs", { listing });
});

// Create Route - Protected
router.post("/listings", isAuthenticated, async (req, res) => {
  try {
    const listingData = req.body.listing;
    
    // Handle image field - if it's a string, convert to object format
    if (listingData.image && typeof listingData.image === 'string') {
      listingData.image = {
        url: listingData.image,
        filename: listingData.image.split('/').pop() || 'image.jpg'
      };
    }
    
    // Add the current user as the owner
    listingData.owner = req.user._id;
    
    const newListing = new Listing(listingData);
    
    // Convert string dates to Date objects
    if (listingData.checkin) {
      newListing.checkin = new Date(listingData.checkin);
    }
    if (listingData.checkout) {
      newListing.checkout = new Date(listingData.checkout);
    }
    // Convert available string to boolean
    newListing.available = listingData.available === 'true';
    
    await newListing.save();
    res.redirect("/listings");
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(400).send('Error creating listing');
  }
});

// Edit Route - Protected (owner only)
router.get("/listings/:id/edit", isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// Update Route - Protected (owner only)
router.put("/listings/:id", isOwner, async (req, res) => {
  try {
    let { id } = req.params;
    const updateData = { ...req.body.listing };
    
    // Handle image field - if it's a string, convert to object format
    if (updateData.image && typeof updateData.image === 'string') {
      updateData.image = {
        url: updateData.image,
        filename: updateData.image.split('/').pop() || 'image.jpg'
      };
    }
    
    // Convert string dates to Date objects
    if (updateData.checkin) {
      updateData.checkin = new Date(updateData.checkin);
    }
    if (updateData.checkout) {
      updateData.checkout = new Date(updateData.checkout);
    }
    // Convert available string to boolean
    updateData.available = updateData.available === 'true';
    
    await Listing.findByIdAndUpdate(id, updateData);
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(400).send('Error updating listing');
  }
});

// Delete Route - Protected (owner only)
router.delete("/listings/:id", isOwner, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

module.exports = router;
