const mongoose = require('mongoose');

let isConnected = false;

async function setupTestDB() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:5',message:'setupTestDB entry',data:{isConnected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  if (isConnected) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:7',message:'Already connected, early return',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return;
  }

  // Use real MongoDB connection string from environment
  // Default to the provided MongoDB Atlas connection string
  const DEFAULT_DB_URI = 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0';
  const TEST_DB_URI = process.env.TEST_DB_URI || process.env.MONGODB_URI || DEFAULT_DB_URI;
  
  console.log('Connecting to MongoDB:', TEST_DB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:18',message:'Before connection check',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:20',message:'Closing existing connection',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      await mongoose.connection.close();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:22',message:'After close, before connect',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:24',message:'Before mongoose.connect',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    await mongoose.connect(TEST_DB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds - fail fast
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 1, // Limit connections
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:32',message:'After mongoose.connect success',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    isConnected = true;
    console.log('✓ Test database connected to MongoDB Atlas');
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:35',message:'Connection error',data:{error:error.message,readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('⚠ Test database connection error:', error);
    throw error; // Throw error to fail tests if DB connection fails
  }
}

async function teardownTestDB() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:38',message:'teardownTestDB entry',data:{isConnected,readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // CRITICAL FIX: Remove all event listeners to prevent Jest from hanging
  // Event listeners registered by lib/db.ts and lib/db-pool-manager.ts keep the process alive
  // This must happen REGARDLESS of connection state - listeners can exist without connection
  try {
    // Get all event names that have listeners
    const eventNames = ['connected', 'disconnected', 'error', 'open', 'connectionCreated', 
                       'connectionClosed', 'connectionPoolCreated', 'connectionPoolClosed'];
    
    // #region agent log
    const listenerCounts = {};
    eventNames.forEach(name => {
      listenerCounts[name] = mongoose.connection.listenerCount(name);
    });
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:45',message:'Removing event listeners',data:listenerCounts,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Remove all listeners from mongoose.connection to prevent Jest from hanging
    eventNames.forEach(eventName => {
      mongoose.connection.removeAllListeners(eventName);
    });
    
    // Also remove ALL listeners as a safety measure
    mongoose.connection.removeAllListeners();
    
    // #region agent log
    const afterListenerCounts = {};
    eventNames.forEach(name => {
      afterListenerCounts[name] = mongoose.connection.listenerCount(name);
    });
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:58',message:'After removing listeners',data:afterListenerCounts,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:61',message:'Error removing listeners',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }
  
  // CRITICAL: Always call mongoose.disconnect() to ensure complete cleanup
  // This must happen REGARDLESS of connection state to prevent Jest from hanging
  try {
    if (isConnected && mongoose.connection.readyState === 1) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:105',message:'Before dropDatabase',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Only drop database in test environment
      if (process.env.NODE_ENV === 'test') {
        await mongoose.connection.dropDatabase();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:110',message:'After dropDatabase',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:113',message:'Before connection.close',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      await mongoose.connection.close();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:116',message:'After connection.close',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
    
    // CRITICAL: ALWAYS call mongoose.disconnect() to ensure complete cleanup
    // This is the most aggressive way to close all connections and prevent Jest from hanging
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:120',message:'Before mongoose.disconnect (always)',data:{readyState:mongoose.connection.readyState,isConnected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    await mongoose.disconnect();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:123',message:'After mongoose.disconnect',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    isConnected = false;
    console.log('✓ Test database cleaned up');
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-setup.js:128',message:'Teardown error',data:{error:error.message,readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Error cleaning up test database:', error);
    // Still try to disconnect even if there was an error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
  }
}

// Helper to clear collections without dropping database
async function clearTestCollections() {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
    }
    console.log('✓ Test collections cleared');
  } catch (error) {
    console.error('Error clearing test collections:', error);
  }
}

module.exports = { setupTestDB, teardownTestDB, clearTestCollections };
