if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Favorite = require("./models/favorite.js");
const Review = require("./models/Review.js");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const flash = require("connect-flash");

// Import authentication configuration
require("./config/passport")(passport);

// Import routes and middleware
const authRoutes = require("./routes/auth");
const bookingsRoutes = require("./routes/bookings.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const { isAuthenticated, isOwner } = require("./middleware/auth");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    
    // Move app.listen here so the server only starts if DB connection works
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("\n============================================================");
    console.error("Γ¥î DATABASE CONNECTION ERROR");
    console.error("============================================================");
    console.error("Failed to connect to MongoDB.");
    console.error("If your friend downloaded this from GitHub, they are likely missing the `.env` file");
    console.error("which contains the MONGO_URL. Please follow the instructions in the README.md!");
    console.error("============================================================\n");
    console.error("Technical details:", err.message);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
    // Add clientPromise to re-use mongoose connection and prevent separate crash
    clientPromise: mongoose.connection.asPromise().then(() => mongoose.connection.getClient())
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Flash messages
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Make user and flash messages available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Use routes
app.use("/", authRoutes);
app.use("/", bookingsRoutes);
app.use("/", reviewsRoutes);
app.use("/", dashboardRoutes);

// Home page
app.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    const randomListings = [];
    
    if (allListings.length > 0) {
      const shuffled = [...allListings].sort(() => 0.5 - Math.random());
      randomListings.push(...shuffled.slice(0, 6));
    }
    
    res.render("home.ejs", { allListings: randomListings, categories: Listing.CATEGORIES });
  } catch (error) {
    console.error("Error fetching listings for home:", error);
    res.render("home.ejs", { allListings: [], categories: Listing.CATEGORIES });
  }
});

// Listings Index ΓÇö supports category filtering and sorting
app.get("/listings", async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};
    
    if (category && Listing.CATEGORIES.includes(category)) {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'price_low') sortOption = { price: 1 };
    else if (sort === 'price_high') sortOption = { price: -1 };
    else sortOption = { _id: -1 }; // newest first

    const allListings = await Listing.find(query).sort(sortOption);
    res.render("listings/index.ejs", { 
      allListings, 
      categories: Listing.CATEGORIES,
      activeCategory: category || '',
      activeSort: sort || 'newest'
    });
  } catch (error) {
    console.error('Listings error:', error);
    res.render("listings/index.ejs", { 
      allListings: [], 
      categories: Listing.CATEGORIES,
      activeCategory: '',
      activeSort: 'newest'
    });
  }
});

// New Route - Protected
app.get("/listings/new", isAuthenticated, (req, res) => {
  res.render("listings/new.ejs", {
    categories: Listing.CATEGORIES,
    propertyTypes: Listing.PROPERTY_TYPES
  });
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    // Get reviews for this listing
    const reviews = await Review.find({ listing: id })
      .populate('user')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
      : null;

    res.render("listings/show.ejs", { listing, reviews, avgRating });
  } catch (error) {
    console.error('Show listing error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect('/listings');
  }
});

// Create Route - Protected
app.post("/listings", isAuthenticated, async (req, res) => {
  try {
    const listingData = req.body.listing;
    
    // Handle image field
    if (listingData.image && typeof listingData.image === 'string') {
      listingData.image = {
        url: listingData.image,
        filename: listingData.image.split('/').pop() || 'image.jpg'
      };
    }
    
    // Set owner
    listingData.owner = req.user._id;
    
    // Handle amenities (comes as comma-separated or array)
    if (listingData.amenities && typeof listingData.amenities === 'string') {
      listingData.amenities = listingData.amenities.split(',').map(a => a.trim()).filter(a => a);
    }
    
    const newListing = new Listing(listingData);
    
    if (listingData.checkin) newListing.checkin = new Date(listingData.checkin);
    if (listingData.checkout) newListing.checkout = new Date(listingData.checkout);
    newListing.available = listingData.available === 'true';
    
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect("/listings");
  } catch (error) {
    console.error('Error creating listing:', error);
    req.flash('error', 'Error creating listing');
    res.redirect("/listings/new");
  }
});

// Edit Route - Protected (owner only)
app.get("/listings/:id/edit", isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { 
    listing,
    categories: Listing.CATEGORIES,
    propertyTypes: Listing.PROPERTY_TYPES
  });
});

// Update Route - Protected (owner only)
app.put("/listings/:id", isOwner, async (req, res) => {
  try {
    let { id } = req.params;
    const updateData = { ...req.body.listing };
    
    if (updateData.image && typeof updateData.image === 'string') {
      updateData.image = {
        url: updateData.image,
        filename: updateData.image.split('/').pop() || 'image.jpg'
      };
    }
    
    // Handle amenities
    if (updateData.amenities && typeof updateData.amenities === 'string') {
      updateData.amenities = updateData.amenities.split(',').map(a => a.trim()).filter(a => a);
    }
    
    if (updateData.checkin) updateData.checkin = new Date(updateData.checkin);
    if (updateData.checkout) updateData.checkout = new Date(updateData.checkout);
    updateData.available = updateData.available === 'true';
    
    await Listing.findByIdAndUpdate(id, updateData);
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    req.flash('error', 'Error updating listing');
    res.redirect(`/listings/${req.params.id}/edit`);
  }
});

// Delete Route - Protected (owner only)
app.delete("/listings/:id", isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted');
  res.redirect("/listings");
});

// ============ FAVORITES (User-specific) ============

app.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('listingId')
      .sort({ addedAt: -1 });
    
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

app.post("/favorites/:listingId", isAuthenticated, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const existingFavorite = await Favorite.findOne({ userId: req.user._id, listingId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    
    const favorite = new Favorite({ userId: req.user._id, listingId });
    await favorite.save();
    
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

app.get("/favorites/check/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    if (!req.user) {
      return res.json({ isFavorited: false });
    }
    const favorite = await Favorite.findOne({ userId: req.user._id, listingId });
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status' });
  }
});

app.delete("/favorites/by-listing/:listingId", isAuthenticated, async (req, res) => {
  try {
    const { listingId } = req.params;
    await Favorite.deleteOne({ userId: req.user._id, listingId });
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

app.delete("/favorites/:favoriteId", isAuthenticated, async (req, res) => {
  try {
    const { favoriteId } = req.params;
    await Favorite.findOneAndDelete({ _id: favoriteId, userId: req.user._id });
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

// Search Route
app.get("/search", async (req, res) => {
  try {
    const { location, checkin, checkout, guests } = req.query;
    
    let searchQuery = { available: true };
    
    if (location) {
      searchQuery.$or = [
        { location: { $regex: location, $options: 'i' } },
        { country: { $regex: location, $options: 'i' } },
        { title: { $regex: location, $options: 'i' } }
      ];
    }
    
    if (guests) {
      const guestCount = parseInt(guests);
      if (!isNaN(guestCount)) {
        searchQuery.maxGuests = { $gte: guestCount };
      }
    }
    
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

// Server startup moved to main().then() above to ensure DB connects first
