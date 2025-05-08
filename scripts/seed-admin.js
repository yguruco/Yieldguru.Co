// This script seeds the initial admin user in the database
// Run with: node scripts/seed-admin.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yieldguru';

// Admin credentials - can be overridden with environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yieldguru.co';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

// Define the User schema (simplified version of the one in models/User.ts)
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: String,
  role: {
    type: String,
    enum: ['Admin', 'Investor', 'Operator'],
    default: 'Admin'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create the User model
const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists`);
      
      // Ask if we should update the password
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Do you want to update the admin password? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
          
          // Update the admin user
          await User.findByIdAndUpdate(existingAdmin._id, {
            password: hashedPassword
          });
          
          console.log('Admin password updated successfully');
        } else {
          console.log('Admin password not updated');
        }
        
        readline.close();
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
      });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      // Create the admin user
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'Admin',
        status: 'Active',
        lastLogin: new Date()
      });
      
      await admin.save();
      console.log(`Admin user created with email: ${ADMIN_EMAIL}`);
      
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();
