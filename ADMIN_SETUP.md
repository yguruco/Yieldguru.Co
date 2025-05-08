# Admin User Setup for Yieldguru

This document provides instructions on how to set up the admin user for the Yieldguru platform.

## Overview

The Yieldguru platform uses MongoDB to store all user data, including admin users. Admin users have special privileges and can access the admin dashboard.

## Setting Up the Admin User

### Option 1: Using the Seed Script (Recommended)

The easiest way to create an admin user is to use the provided seed script:

1. Make sure your MongoDB connection is properly configured in `.env.local`
2. Optionally, customize the admin credentials in `.env.local`:
   ```
   ADMIN_EMAIL=your-admin-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ADMIN_NAME=Your Name
   ```
3. Run the seed script:
   ```bash
   pnpm seed-admin
   ```

This script will:
- Check if an admin user already exists with the specified email
- If not, create a new admin user with the provided credentials
- If an admin already exists, ask if you want to update the password

### Option 2: Manual Creation via MongoDB

If you prefer to create the admin user manually:

1. Connect to your MongoDB database using MongoDB Compass or another tool
2. Navigate to the `users` collection
3. Create a new document with the following structure:
   ```json
   {
     "name": "Administrator",
     "email": "admin@yieldguru.co",
     "password": "<hashed-password>",
     "role": "Admin",
     "status": "Active",
     "lastLogin": ISODate("2023-01-01T00:00:00.000Z"),
     "createdAt": ISODate("2023-01-01T00:00:00.000Z"),
     "updatedAt": ISODate("2023-01-01T00:00:00.000Z")
   }
   ```

Note: The password must be hashed using bcrypt. You can use an online bcrypt generator to create a hashed password.

## Logging In as Admin

Once the admin user is set up:

1. Navigate to `/login/admin` in your browser
2. Enter the admin email and password
3. You will be redirected to the admin dashboard upon successful login

## Security Considerations

- Change the default admin credentials before deploying to production
- Use a strong, unique password for the admin account
- Consider implementing additional security measures such as two-factor authentication for admin accounts
- Regularly audit admin actions and rotate admin passwords

## Troubleshooting

If you encounter issues with admin login:

1. Verify that the admin user exists in the database
2. Check that the password is correctly hashed
3. Ensure that the role is set to "Admin"
4. Check the server logs for any authentication errors

For persistent issues, you can reset the admin password using the seed script with the `ADMIN_PASSWORD` environment variable updated.
