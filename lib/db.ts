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
  // DISABLED: Using local JSON database instead of MongoDB
  console.log('⚠️ MongoDB connection disabled - using local JSON database');
  return null;
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
