# MongoDB Setup for Yieldguru

This document provides instructions on how to set up MongoDB for the Yieldguru platform.

## Why MongoDB?

We've migrated from localStorage to MongoDB for the following reasons:

1. **Avoid Storage Limitations**: Browser localStorage has a limit (typically 5-10MB) which can cause "QuotaExceededError" when storing large amounts of data.
2. **Persistent Storage**: Data is stored on a server rather than in the browser, making it accessible across devices and sessions.
3. **Scalability**: MongoDB can handle large amounts of data and scale as the application grows.
4. **Query Capabilities**: MongoDB provides powerful query capabilities for filtering and sorting data.

## Setup Instructions

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project.
3. Create a new cluster (the free tier is sufficient for development).

### 2. Configure Database Access

1. In the MongoDB Atlas dashboard, go to "Database Access" under the Security section.
2. Click "Add New Database User" and create a user with read and write permissions.
3. Set a secure password and remember it for later.

### 3. Configure Network Access

1. In the MongoDB Atlas dashboard, go to "Network Access" under the Security section.
2. Click "Add IP Address" and either add your specific IP or use "0.0.0.0/0" to allow access from anywhere (not recommended for production).

### 4. Get Your Connection String

1. In the MongoDB Atlas dashboard, click "Connect" on your cluster.
2. Select "Connect your application".
3. Copy the connection string.
4. Replace `<username>`, `<password>`, and `<dbname>` with your actual values.

### 5. Configure Environment Variables

1. Update the `.env` file in the root of your project with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>` with your actual values.

Note: For local development, you can also use `.env.local` which will override values in `.env`.

## Verifying the Setup

To verify that your MongoDB connection is working:

1. Start your application with `npm run dev`.
2. Submit a new RFT through the application.
3. Check your MongoDB Atlas dashboard to see if the data was stored in the database.

## Troubleshooting

If you encounter issues with the MongoDB connection:

1. **Connection String**: Make sure your connection string is correct and properly formatted.
2. **Network Access**: Ensure that your IP address is allowed in the Network Access settings.
3. **Database User**: Verify that your database user has the correct permissions.
4. **Environment Variables**: Check that your `.env.local` file is in the root directory and contains the correct connection string.

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js with MongoDB](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb)
