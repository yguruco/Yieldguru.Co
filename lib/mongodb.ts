import mongoose from 'mongoose';

// Log environment for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('MONGODB_URI defined:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  // Only log a prefix of the connection string for security
  console.log('MONGODB_URI prefix:', process.env.MONGODB_URI.substring(0, 20) + '...');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yieldguru';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env or .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Attempting to connect to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connection successful');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          // If connection to Atlas fails, don't fall back to local
          // Just rethrow the error
          throw error;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error in dbConnect:', error);
    throw error;
  }
}

export default dbConnect;
