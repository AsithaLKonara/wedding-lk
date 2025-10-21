import mongoose from 'mongoose';
// Import all models to ensure they are registered
import './models';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI environment variable is not set. Using fallback connection.');
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
      maxPoolSize: 20, // Increased pool size for better performance
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 10000, // Increased timeout for better reliability
      socketTimeoutMS: 30000, // Reduced socket timeout for faster failure detection
      connectTimeoutMS: 10000, // Connection timeout
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
      compressors: ['zlib'], // Enable compression
      zlibCompressionLevel: 6, // Compression level
      heartbeatFrequencyMS: 10000, // Heartbeat frequency
      maxStalenessSeconds: 90, // Max staleness for secondary reads
    };

    if (!MONGODB_URI) {
      console.warn('⚠️ No MongoDB URI found. Using local fallback for development.');
      // Use a local MongoDB connection for development
      const fallbackUri = 'mongodb://localhost:27017/weddinglk-dev';
      cached.promise = mongoose.connect(fallbackUri, opts).then((mongoose) => {
        console.log('✅ Connected to local MongoDB for development');
        return mongoose;
      }).catch((error) => {
        console.error('❌ Local MongoDB connection error:', error);
        throw new Error(`Failed to connect to local MongoDB: ${error.message}`);
      });
      return;
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas with optimized settings');
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
let slowQueryThreshold = 1000; // 1 second
mongoose.connection.on('open', () => {
  const originalExec = mongoose.Query.prototype.exec;
  mongoose.Query.prototype.exec = function() {
    const start = Date.now();
    return originalExec.apply(this, arguments).then((result) => {
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

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});

// Export connection for direct access
export const getConnection = () => mongoose.connection;
