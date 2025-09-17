const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkDatabaseCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📋 Database Collections:');
    console.log('========================');
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count} documents`);
    }

    // Check specific collections
    console.log('\n🔍 Checking specific collections:');
    
    // Check packages collection
    const packagesCount = await db.collection('packages').countDocuments();
    console.log(`📦 packages: ${packagesCount} documents`);
    
    // Check vendors collection
    const vendorsCount = await db.collection('vendors').countDocuments();
    console.log(`👥 vendors: ${vendorsCount} documents`);
    
    // Check bookings collection
    const bookingsCount = await db.collection('bookings').countDocuments();
    console.log(`📅 bookings: ${bookingsCount} documents`);

    // Sample package data
    if (packagesCount > 0) {
      console.log('\n📦 Sample Package:');
      const samplePackage = await db.collection('packages').findOne();
      console.log(JSON.stringify(samplePackage, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkDatabaseCollections();
