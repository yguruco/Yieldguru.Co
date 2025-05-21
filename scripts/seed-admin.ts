import connectToDatabase from '../lib/mongodb';
import User from '../models/User';

async function seedAdmin() {
  try {
    // Check for required environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.error('Missing required environment variables for admin seeding');
      console.error('Please set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in .env.local');
      process.exit(1);
    }

    // Connect to database
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findByEmail(adminEmail);
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'Admin',
      status: 'Active',
    });

    await admin.save();
    console.log(`Admin user created with email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAdmin();
