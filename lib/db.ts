import mongoose from 'mongoose';
// Import all models to ensure they are registered
import './models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required for MongoDB Atlas connection');
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  connecting: boolean;
}

declare global {
  var mongoose: ConnectionCache | undefined;
}

const cached: ConnectionCache = global.mongoose || { conn: null, promise: null, connecting: false };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Add connection event listeners for better monitoring
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Performance monitoring
mongoose.connection.on('connected', () => {
  if (process.env.NODE_ENV === 'development') {
    const pool = (mongoose.connection as any).pool;
    if (pool) {
      console.log(`📊 MongoDB Performance Stats:`);
      console.log(`   Pool Size: ${pool.size()}`);
      console.log(`   Available: ${pool.available()}`);
      console.log(`   Pending: ${pool.pending()}`);
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});

// Export connection for direct access
export const getConnection = () => mongoose.connection;
