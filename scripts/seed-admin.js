// This script is used to seed the admin user
// It's meant to be run with: pnpm seed:admin

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    // Check for required environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;
    const mongoUri = process.env.MONGODB_URI;

    if (!adminEmail || !adminPassword || !adminName) {
      console.error('Missing required environment variables for admin seeding');
      console.error('Please set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in .env.local');
      process.exit(1);
    }

    if (!mongoUri) {
      console.error('Missing MONGODB_URI environment variable');
      process.exit(1);
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      await client.close();
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const admin = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(admin);
    console.log(`Admin user created with email: ${adminEmail}`);
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAdmin();
