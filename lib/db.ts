import mongoose from 'mongoose';
// Safely read listener counts from mongoose.connection across different versions/mocks.
const getListenerCount = (event: string): number => {
  const anyConn = mongoose.connection as any;
  if (typeof anyConn.listenerCount === 'function') {
    return anyConn.listenerCount(event);
  }
  return 0;
};


// Import all models to ensure they are registered
import './models';
// Import performance optimizations
import { initializePerformanceOptimizations } from './performance-optimizer';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI environment variable is not set. MongoDB Atlas connection string is required. Local MongoDB is not supported.');
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
    };

    if (!MONGODB_URI) {
      const errorMsg = '❌ MONGODB_URI environment variable is required. Please set it to your MongoDB Atlas connection string. Local MongoDB is not supported.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }


    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {

      console.log('✅ Connected to MongoDB Atlas with optimized settings');
      // Initialize performance optimizations
      initializePerformanceOptimizations();
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

// Enhanced performance monitoring
mongoose.connection.on('connected', () => {

  console.log('📊 MongoDB Performance Stats:');
  const pool = (mongoose.connection as any).pool;
  if (pool) {
    console.log(`   Pool Size: ${pool.size()}`);
    console.log(`   Available: ${pool.available()}`);
    console.log(`   Pending: ${pool.pending()}`);
    console.log(`   Total Connections: ${pool.totalConnectionCount}`);
    console.log(`   Active Connections: ${pool.activeConnectionCount}`);
  }
});

// Query performance monitoring
mongoose.connection.on('open', () => {

  // Enable query logging in development
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.log(`🔍 MongoDB Query: ${collectionName}.${method}`, {
        query: JSON.stringify(query),
        doc: doc ? JSON.stringify(doc) : 'N/A'
      });
    });
  }
});

// Monitor slow queries
const slowQueryThreshold = 1000; // 1 second
mongoose.connection.on('open', () => {

  const originalExec = mongoose.Query.prototype.exec;
  mongoose.Query.prototype.exec = function(...args: any[]) {
    const start = Date.now();
    return (originalExec as any).apply(this, args).then((result: any) => {
      const duration = Date.now() - start;
      if (duration > slowQueryThreshold) {
        console.warn(`🐌 Slow Query Detected: ${duration}ms`, {
          collection: this.model?.collection?.name || 'unknown',
          query: this.getQuery(),
          duration: `${duration}ms`
        });
      }
      return result;
    });
  };
});


// Graceful shutdown - only register in non-test environments
// In test environment, Jest handles cleanup and this handler can prevent exit
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  });
}

// Export connection for direct access
export const getConnection = () => mongoose.connection;
