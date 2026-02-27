const express = require("express");

const app = express();
const PORT = 8080;

// Configuration
require("./config/middleware")(app);
require("./config/auth-setup")(app);
require("./config/routes")(app);

// Sample data route for Atlas
app.get("/seed", async (req, res) => {
  try {
    const Listing = require("./models/listing");
    
    // Clear existing data
    await Listing.deleteMany({});
    
    // Add comprehensive sample listings
    const sampleListings = [
      {
        title: "Beach Villa Paradise",
        description: "Luxurious beachfront villa with stunning ocean views and private beach access",
        image: { 
          url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "beach-villa.jpg" 
        },
        price: 150, 
        location: "Miami Beach", 
        country: "USA", 
        maxGuests: 4, 
        available: true,
        checkin: new Date('2024-12-15'), 
        checkout: new Date('2025-02-15')
      },
      {
        title: "Mountain Retreat Cabin",
        description: "Cozy mountain cabin perfect for winter getaways with fireplace and hot tub",
        image: { 
          url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "mountain-cabin.jpg" 
        },
        price: 120, 
        location: "Aspen", 
        country: "USA", 
        maxGuests: 6, 
        available: true,
        checkin: new Date('2024-12-20'), 
        checkout: new Date('2025-03-20')
      },
      {
        title: "City Loft Downtown",
        description: "Modern downtown loft with city views and walking distance to attractions",
        image: { 
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "city-loft.jpg" 
        },
        price: 95, 
        location: "New York", 
        country: "USA", 
        maxGuests: 2, 
        available: true,
        checkin: new Date('2025-01-01'), 
        checkout: new Date('2025-06-01')
      },
      {
        title: "Desert Luxury Resort",
        description: "Luxury desert resort with pool, spa, and world-class golf course",
        image: { 
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "desert-resort.jpg" 
        },
        price: 200, 
        location: "Las Vegas", 
        country: "USA", 
        maxGuests: 8, 
        available: true,
        checkin: new Date('2025-01-15'), 
        checkout: new Date('2025-04-15')
      },
      {
        title: "Lakefront Cottage",
        description: "Peaceful lakefront property with private dock and beautiful sunset views",
        image: { 
          url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "lake-cottage.jpg" 
        },
        price: 180, 
        location: "Lake Tahoe", 
        country: "USA", 
        maxGuests: 5, 
        available: false,
        checkin: new Date('2024-11-01'), 
        checkout: new Date('2025-01-31')
      },
      {
        title: "Tropical Beach Bungalow",
        description: "Cozy beach bungalow surrounded by palm trees and crystal clear waters",
        image: { 
          url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "tropical-bungalow.jpg" 
        },
        price: 85, 
        location: "Maui", 
        country: "USA", 
        maxGuests: 3, 
        available: true,
        checkin: new Date('2025-02-01'), 
        checkout: new Date('2025-05-01')
      },
      {
        title: "Urban Penthouse Suite",
        description: "Luxurious penthouse with panoramic city views and rooftop terrace",
        image: { 
          url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "penthouse-suite.jpg" 
        },
        price: 350, 
        location: "San Francisco", 
        country: "USA", 
        maxGuests: 4, 
        available: true,
        checkin: new Date('2025-03-01'), 
        checkout: new Date('2025-08-01')
      },
      {
        title: "Countryside Farmhouse",
        description: "Charming farmhouse surrounded by rolling hills and organic gardens",
        image: { 
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "farmhouse.jpg" 
        },
        price: 75, 
        location: "Nashville", 
        country: "USA", 
        maxGuests: 6, 
        available: true,
        checkin: new Date('2025-04-01'), 
        checkout: new Date('2025-09-01')
      },
      {
        title: "Secluded Forest Cabin",
        description: "Private cabin nestled in the forest with hiking trails and wildlife viewing",
        image: { 
          url: "https://images.unsplash.com/photo-1518780664697-55e3189dbe39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "forest-cabin.jpg" 
        },
        price: 65, 
        location: "Portland", 
        country: "USA", 
        maxGuests: 2, 
        available: true,
        checkin: new Date('2025-05-01'), 
        checkout: new Date('2025-10-01')
      },
      {
        title: "Beachfront Condo",
        description: "Modern beachfront condo with ocean views and resort amenities",
        image: { 
          url: "https://images.unsplash.com/photo-1445068651481-c3c1c6e6b5a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", 
          filename: "beachfront-condo.jpg" 
        },
        price: 110, 
        location: "San Diego", 
        country: "USA", 
        maxGuests: 4, 
        available: true,
        checkin: new Date('2025-06-01'), 
        checkout: new Date('2025-11-01')
      }
    ];

    await Listing.insertMany(sampleListings);
    console.log(`✅ ${sampleListings.length} sample listings added to Atlas!`);
    res.send(`✅ ${sampleListings.length} sample listings added to MongoDB Atlas! Visit <a href='/'>home</a> or <a href='/listings'>listings</a>`);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).send('❌ Error adding sample data');
  }
});

// Database connection and server start
const connectDB = require("./config/database");
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
