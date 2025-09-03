import mongoose from 'mongoose';
// Import all models to ensure they are registered
import './models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not found, using fallback connection string');
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
  // If already connected, return the connection
  if (cached.conn) {
    return cached.conn;
  }

  // If already connecting, wait for the existing promise
  if (cached.connecting && cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      cached.connecting = false;
      throw error;
    }
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    // Use the MONGODB_URI from environment or fallback
    const uri = MONGODB_URI || 'mongodb://localhost:27017/weddinglk';
    
    const opts = {
      bufferCommands: false, // Disable buffering to prevent timeout issues
      maxPoolSize: 1, // Minimal pool for Vercel serverless
      minPoolSize: 0, // No minimum pool for serverless
      serverSelectionTimeoutMS: 10000, // Increased timeout for MongoDB Atlas
      socketTimeoutMS: 30000, // Socket timeout
      family: 4, // Use IPv4
      autoIndex: false,
      maxIdleTimeMS: 30000, // Increased idle time
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 30000, // Increased connection timeout for Atlas
      heartbeatFrequencyMS: 10000,
      maxConnecting: 1, // Minimal for serverless
      // MongoDB Atlas specific options
      directConnection: false,
      // Retry logic
      retryDelay: 1000,
      maxRetries: 5,
      // Buffer timeout settings
      bufferMaxEntries: 0, // Disable buffering
      // Additional Atlas options
      compressors: ['zlib'],
      zlibCompressionLevel: 6,
    };

    console.log(`🔌 Attempting to connect to MongoDB: ${uri.replace(/\/\/.*@/, '//***@')}`);
    
    cached.connecting = true;
    cached.promise = mongoose.connect(uri, opts);
  }

  try {
    cached.conn = await cached.promise;
    cached.connecting = false;
    
    console.log('✅ MongoDB connected successfully');
    
    // Enable query performance monitoring
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', false);
    }
    
    // Set global performance options
    mongoose.set('strictQuery', false);
    
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.connecting = false;
    console.error('❌ MongoDB connection failed:', e);
    
    // For development/production, try to continue without database
    console.warn('⚠️ Continuing without database connection');
    return null;
  }
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
