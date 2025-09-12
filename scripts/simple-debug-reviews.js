const mongoose = require('mongoose');

async function debugReviews() {
  try {
    console.log('🔍 Debugging Reviews API...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Test 1: Basic query without population
    console.log('\n📊 Test 1: Basic query without population');
    const basicReviews = await db.collection('reviews').find({ status: 'approved' }).limit(3).toArray();
    console.log('Found reviews:', basicReviews.length);
    if (basicReviews.length > 0) {
      console.log('Sample review ID:', basicReviews[0]._id);
      console.log('Sample review userId:', basicReviews[0].userId);
      console.log('Sample review vendorId:', basicReviews[0].vendorId);
    }
    
    // Test 2: Check if user and vendor exist
    console.log('\n📊 Test 2: Checking references');
    if (basicReviews.length > 0) {
      const sampleReview = basicReviews[0];
      
      const user = await db.collection('users').findOne({ _id: sampleReview.userId });
      const vendor = await db.collection('vendors').findOne({ _id: sampleReview.vendorId });
      
      console.log('User exists:', !!user);
      console.log('Vendor exists:', !!vendor);
      
      if (user) console.log('User name:', user.name);
      if (vendor) console.log('Vendor name:', vendor.businessName);
    }
    
    // Test 3: Count total reviews
    console.log('\n📊 Test 3: Total review count');
    const totalReviews = await db.collection('reviews').countDocuments({ status: 'approved' });
    console.log('Total approved reviews:', totalReviews);
    
    // Test 4: Try to simulate the API query
    console.log('\n📊 Test 4: Simulating API query');
    const apiQuery = await db.collection('reviews').find({ status: 'approved' })
      .limit(10)
      .toArray();
    console.log('API query result count:', apiQuery.length);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugReviews();
