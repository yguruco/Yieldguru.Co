// Script to check if there are any users in the database
const mongoose = require('mongoose');
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

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User collection
    const User = mongoose.connection.collection('users');

    // Count users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);

    // List all users (limited info)
    const users = await User.find({}).project({ name: 1, email: 1, role: 1, _id: 0 }).toArray();
    console.log('Users:');
    console.log(JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
checkUsers();
