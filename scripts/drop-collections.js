#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function dropCollections() {
  try {
    console.log('🗑️ Dropping all collections...');
    
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections`);

    // Drop each collection
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`✅ Dropped collection: ${collection.name}`);
    }

    console.log('🎉 All collections dropped successfully!');
    
  } catch (error) {
    console.error('❌ Error dropping collections:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  dropCollections();
}

module.exports = { dropCollections };
