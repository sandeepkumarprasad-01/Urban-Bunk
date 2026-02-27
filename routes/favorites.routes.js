const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite.js');

// Favorites Routes
router.get("/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find({})
      .populate('listingId')
      .sort({ addedAt: -1 });
    
    // Transform the data to match the template expectations
    const transformedFavorites = favorites.map(fav => ({
      ...fav.toObject(),
      listing: fav.listingId
    }));
    
    res.render("favorites", { favorites: transformedFavorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).send('Error fetching favorites');
  }
});

// Add to favorites
router.post("/favorites/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ listingId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    
    const favorite = new Favorite({ listingId });
    await favorite.save();
    
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

// Check if listing is favorited
router.get("/favorites/check/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const favorite = await Favorite.findOne({ listingId });
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status' });
  }
});

// Remove from favorites by listing ID
router.delete("/favorites/by-listing/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    await Favorite.deleteOne({ listingId });
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

// Remove from favorites
router.delete("/favorites/:favoriteId", async (req, res) => {
  try {
    const { favoriteId } = req.params;
    await Favorite.findByIdAndDelete(favoriteId);
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

module.exports = router;
