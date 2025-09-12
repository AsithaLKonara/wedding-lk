const mongoose = require('mongoose');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Test specific collections
    const reviewsCount = await db.collection('reviews').countDocuments();
    const notificationsCount = await db.collection('notifications').countDocuments();
    const vendorsCount = await db.collection('vendors').countDocuments();
    const bookingsCount = await db.collection('bookings').countDocuments();
    
    console.log('📈 Collection counts:');
    console.log(`   - Reviews: ${reviewsCount}`);
    console.log(`   - Notifications: ${notificationsCount}`);
    console.log(`   - Vendors: ${vendorsCount}`);
    console.log(`   - Bookings: ${bookingsCount}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
