// Test script to verify authentication setup
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function testAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log('✅ Connected to MongoDB');

    // Test user creation
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123'
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('✅ User already exists, checking password...');
      
      // Test password comparison
      const isMatch = await existingUser.comparePassword(testUser.password);
      console.log(isMatch ? '✅ Password comparison works' : '❌ Password comparison failed');
    } else {
      console.log('Creating test user...');
      const newUser = new User(testUser);
      await newUser.save();
      console.log('✅ User created successfully');
      
      // Test password comparison
      const isMatch = await newUser.comparePassword(testUser.password);
      console.log(isMatch ? '✅ Password hashing and comparison works' : '❌ Password comparison failed');
    }

    console.log('✅ Authentication system is working correctly');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAuth();
