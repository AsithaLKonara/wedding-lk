// Jest setup file for WeddingLK tests

// Helper to safely get listener count (handles mocked mongoose)
function getListenerCount(event = 'connected') {
  try {
    const mongoose = require('mongoose');
    if (typeof mongoose.connection?.listenerCount === 'function') {
      return mongoose.connection.listenerCount(event);
    }
  } catch (e) {
    // Ignore errors
  }
  return 0;
}

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
// Use real MongoDB for tests - can be overridden by TEST_DB_URI env var
// CRITICAL: Set MONGODB_URI before any imports to prevent lib/db.ts from using fallback
const DEFAULT_DB_URI = 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0';
process.env.MONGODB_URI = process.env.TEST_DB_URI || process.env.MONGODB_URI || DEFAULT_DB_URI;
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:8',message:'MONGODB_URI set',data:{hasMongoUri:!!process.env.MONGODB_URI,uriPreview:process.env.MONGODB_URI?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

// Mock external services
// NextAuth has been removed - using custom authentication system instead

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_secret_123'
      }),
      confirm: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded'
      })
    },
    refunds: {
      create: jest.fn().mockResolvedValue({
        id: 'rf_test_123',
        status: 'succeeded'
      })
    }
  }));
});

// Use real MongoDB connection for all tests
// No mocking of mongoose - we use the real database
// The db-setup.js helper will handle the connection

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test-image-id',
        secure_url: 'https://res.cloudinary.com/test/image/upload/test-image-id.jpg'
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

// Global test utilities
global.testHelpers = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }),
  
  createMockVendor: (overrides = {}) => ({
    id: 'test-vendor-id',
    name: 'Test Vendor',
    businessName: 'Test Business',
    email: 'vendor@example.com',
    category: 'photographer',
    ...overrides
  }),
  
  createMockVenue: (overrides = {}) => ({
    id: 'test-venue-id',
    name: 'Test Venue',
    description: 'Test venue description',
    capacity: 100,
    basePrice: 50000,
    ...overrides
  }),
  
  createMockBooking: (overrides = {}) => ({
    id: 'test-booking-id',
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    eventDate: '2024-12-25',
    guestCount: 100,
    status: 'pending',
    ...overrides
  })
};

// Setup and teardown
const { setupTestDB, teardownTestDB } = require('./helpers/db-setup');

beforeAll(async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:95',message:'beforeAll entry',data:{mongooseListeners:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  // Setup test database - always use real database
  console.log('Setting up test environment with real MongoDB...');
  try {
    await setupTestDB();
    // #region agent log
    const mongoose = require('mongoose');
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:99',message:'after setupTestDB',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:102',message:'beforeAll error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Failed to connect to test database:', error.message);
    // Continue with tests - some may work without DB
  }
}, 15000); // 15 second timeout for beforeAll

afterAll(async () => {
  // #region agent log
  const mongoose = require('mongoose');
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:106',message:'afterAll entry',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  // Cleanup test database
  console.log('Cleaning up test environment...');
  try {
    await teardownTestDB();
    // #region agent log
    const mongoose = require('mongoose');
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:110',message:'after teardownTestDB',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:112',message:'afterAll error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Error during teardown:', error);
  }
  
  // Final aggressive cleanup to ensure Jest can exit cleanly without open handles.
  try {
    const mongoose = require('mongoose');
    // Remove ALL listeners one more time
    mongoose.connection.removeAllListeners();
    // Force disconnect if still connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch(() => {});
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:125',message:'Final cleanup completed',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // Ignore errors in final cleanup
  }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:138',message:'Unhandled rejection',data:{reason:String(reason)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// CRITICAL: Global cleanup function that runs on process exit
// This ensures all listeners are removed even if tests import lib/db.ts
function globalCleanup() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:152',message:'Global cleanup - entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const mongoose = require('mongoose');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:156',message:'Global cleanup - removing all listeners',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Remove ALL listeners from mongoose connection
    mongoose.connection.removeAllListeners();
    
    // Force disconnect mongoose (more aggressive than close)
    // Note: In 'exit' handler, we can't await, so we use sync approach
    if (mongoose.connection.readyState !== 0) {
      // Try to disconnect synchronously if possible
      try {
        mongoose.connection.closeSync && mongoose.connection.closeSync();
      } catch (e) {
        // If sync close not available, disconnect will happen async but process will exit
        mongoose.disconnect().catch(() => {});
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:170',message:'Global cleanup - completed',data:{mongooseListeners:getListenerCount('connected'),readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:173',message:'Global cleanup - error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Ignore errors in global cleanup
  }
}

// Register cleanup on process exit (runs when Jest is about to exit)
// Note: 'exit' handler runs synchronously, so we also register 'beforeExit'
process.on('exit', globalCleanup);
process.on('beforeExit', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:192',message:'beforeExit event',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  globalCleanup();
});
process.on('SIGTERM', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:199',message:'SIGTERM event',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  globalCleanup();
});
process.on('SIGINT', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:205',message:'SIGINT event',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  globalCleanup();
});

// Final cleanup hook that runs after ALL test suites complete
// This ensures Jest exits even if other cleanup mechanisms fail,
// without forcing an additional process.exit from here.
afterAll(async () => {
  // #region agent log
  const mongoose = require('mongoose');
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:214',message:'Final global cleanup - entry',data:{mongooseReadyState:mongoose.connection.readyState,mongooseListeners:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  try {
    const mongoose = require('mongoose');
    mongoose.connection.removeAllListeners();
    await mongoose.disconnect().catch(() => {});
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup.js:220',message:'Final global cleanup - completed',data:{mongooseReadyState:mongoose.connection.readyState,mongooseListeners:getListenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // Ignore errors
  }
}, 10000);

// Increase timeout for integration tests
jest.setTimeout(30000);