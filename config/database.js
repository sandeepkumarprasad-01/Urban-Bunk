const mongoose = require("mongoose");
require('dotenv').config();

// Use MongoDB Atlas if available, otherwise fallback to local MongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to DB");
    console.log(`📍 Database: ${MONGO_URL.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  } catch (err) {
    console.log("❌ DB Error:", err);
    console.log("\n💡 Setup Instructions:");
    console.log("1. Copy .env.example to .env");
    console.log("2. Get MongoDB Atlas connection string: https://www.mongodb.com/atlas");
    console.log("3. Update MONGO_URL in .env file");
    process.exit(1);
  }
};

module.exports = connectDB;
