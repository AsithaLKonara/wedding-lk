import mongoose from 'mongoose';
// Safely read listener counts from mongoose.connection across different versions/mocks.
const getListenerCount = (event: string): number => {
  const anyConn = mongoose.connection as any;
  if (typeof anyConn.listenerCount === 'function') {
    return anyConn.listenerCount(event);
  }
  return 0;
};

// #region agent log
fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:1',message:'lib/db.ts module loading',data:{listenerCount:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:29',message:'connectDB entry',data:{hasCachedConn:!!cached.conn,hasPromise:!!cached.promise,readyState:mongoose.connection.readyState,listenerCount:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  if (cached.conn) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:31',message:'Returning cached connection',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:53',message:'Before mongoose.connect',data:{readyState:mongoose.connection.readyState,listenerCount:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:55',message:'After mongoose.connect success',data:{readyState:mongoose.connection.readyState,listenerCount:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('✅ Connected to MongoDB Atlas with optimized settings');
      // Initialize performance optimizations
      initializePerformanceOptimizations();
      return mongoose;
    }).catch((error) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:61',message:'mongoose.connect error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('❌ MongoDB connection error:', error);
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    });
  }

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:65',message:'Awaiting cached.promise',data:{hasPromise:!!cached.promise},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    cached.conn = await cached.promise;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:67',message:'After await cached.promise',data:{readyState:mongoose.connection.readyState,listenerCount:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:69',message:'Error awaiting promise',data:{error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    cached.promise = null;
    throw e;
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:72',message:'connectDB exit',data:{readyState:mongoose.connection.readyState,listenerCount:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  return cached.conn;
}

// Add connection event listeners for better monitoring
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:74',message:'Registering event listeners',data:{listenerCountBefore:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion
mongoose.connection.on('connected', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:76',message:'connected event fired',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:81',message:'error event fired',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:86',message:'disconnected event fired',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Enhanced performance monitoring
mongoose.connection.on('connected', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:91',message:'connected event (performance) fired',data:{listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:104',message:'open event fired',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:118',message:'open event (slow queries) fired',data:{listenerCount:mongoose.connection.listenerCount('open')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
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
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:131',message:'All event listeners registered',data:{connectedListeners:mongoose.connection.listenerCount('connected'),openListeners:mongoose.connection.listenerCount('open'),errorListeners:mongoose.connection.listenerCount('error'),disconnectedListeners:mongoose.connection.listenerCount('disconnected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

// Graceful shutdown - only register in non-test environments
// In test environment, Jest handles cleanup and this handler can prevent exit
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.ts:191',message:'SIGINT handler',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  });
}

// Export connection for direct access
export const getConnection = () => mongoose.connection;
