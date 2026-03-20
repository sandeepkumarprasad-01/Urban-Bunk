if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const { default: MongoStore } = require('connect-mongo');
const passport = require("passport");
const flash = require("connect-flash");

// Import authentication configuration
require("./config/passport")(passport);

// Import routes
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home.routes");
const indexRoutes = require("./routes/index.routes"); // handles /listings, etc.
const bookingsRoutes = require("./routes/bookings.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const searchRoutes = require("./routes/search.routes");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("\n============================================================");
    console.error("❌ DATABASE CONNECTION ERROR");
    console.error("============================================================");
    console.error("Failed to connect to MongoDB.");
    console.error("Make sure you have a .env file with MONGO_URL set.");
    console.error("============================================================\n");
    console.error("Technical details:", err.message);
    process.exit(1);
  });

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
    collectionName: 'sessions'
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

// Make user and flash messages available to all templates MUST BE AFTER PASSPORT
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.categories = ['Beach', 'Mountain', 'City', 'Countryside', 'Lake', 'Desert', 'Island', 'Cabin'];
  next();
});

// Use routes
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/", indexRoutes);
app.use("/", bookingsRoutes);
app.use("/", reviewsRoutes);
app.use("/", dashboardRoutes);
app.use("/", favoritesRoutes);
app.use("/", searchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (!res.headersSent) {
    res.status(500).send('Something broke!');
  }
});
