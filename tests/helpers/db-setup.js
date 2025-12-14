const mongoose = require('mongoose');

let testDb;

async function setupTestDB() {
  // Connect to test database
  const testDbUri = process.env.TEST_DB_URI || 'mongodb://localhost:27017/weddinglk_test';
  
  try {
    await mongoose.connect(testDbUri);
    testDb = mongoose.connection;
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection failed:', error);
    throw error;
  }
}

async function teardownTestDB() {
  if (testDb) {
    await testDb.dropDatabase();
    await mongoose.connection.close();
    console.log('Test database cleaned up');
  }
}

async function clearTestData() {
  if (testDb) {
    const collections = await testDb.db.listCollections().toArray();
    
    for (const collection of collections) {
      await testDb.db.collection(collection.name).deleteMany({});
    }
    
    console.log('Test data cleared');
  }
}

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearTestData
};
