// Script to create test users for each role
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Try to load from .env first, then fall back to .env.local if needed
require('dotenv').config();
// If any required variables are missing, try .env.local as fallback
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: '.env.local' });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env or .env.local');
  process.exit(1);
}

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User collection
    const User = mongoose.connection.collection('users');

    // Create test users for each role if they don't exist
    const testUsers = [
      {
        name: 'Test Investor',
        email: 'investor@test.com',
        password: await bcrypt.hash('Investor123!', 10),
        role: 'Investor',
        status: 'Active',
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Operator',
        email: 'operator@test.com',
        password: await bcrypt.hash('Operator123!', 10),
        role: 'Operator',
        status: 'Active',
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        console.log(`User ${user.email} already exists`);
      } else {
        // Create the user
        await User.insertOne(user);
        console.log(`Created user ${user.email} with role ${user.role}`);
      }
    }

    // List all users (limited info)
    const users = await User.find({}).project({ name: 1, email: 1, role: 1, _id: 0 }).toArray();
    console.log('All users:');
    console.log(JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createTestUsers();
