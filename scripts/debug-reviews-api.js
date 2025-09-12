const mongoose = require('mongoose');

async function debugReviewsAPI() {
  try {
    console.log('🔍 Debugging Reviews API...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Import models
    const Review = require('../lib/models/review').default;
    const User = require('../lib/models/user').default;
    const Vendor = require('../lib/models/vendor').default;
    
    // Test 1: Basic query without population
    console.log('\n📊 Test 1: Basic query without population');
    const basicReviews = await Review.find({ status: 'approved' }).limit(3).lean();
    console.log('Found reviews:', basicReviews.length);
    if (basicReviews.length > 0) {
      console.log('Sample review:', JSON.stringify(basicReviews[0], null, 2));
    }
    
    // Test 2: Query with population
    console.log('\n📊 Test 2: Query with population');
    const populatedReviews = await Review.find({ status: 'approved' })
      .populate('userId', 'name avatar')
      .populate('vendorId', 'businessName')
      .limit(3)
      .lean();
    console.log('Found populated reviews:', populatedReviews.length);
    
    // Test 3: Check if population is failing
    console.log('\n📊 Test 3: Checking population references');
    const sampleReview = basicReviews[0];
    if (sampleReview) {
      console.log('Sample review userId:', sampleReview.userId);
      console.log('Sample review vendorId:', sampleReview.vendorId);
      
      const user = await User.findById(sampleReview.userId);
      const vendor = await Vendor.findById(sampleReview.vendorId);
      
      console.log('User found:', !!user);
      console.log('Vendor found:', !!vendor);
      
      if (user) console.log('User name:', user.name);
      if (vendor) console.log('Vendor name:', vendor.businessName);
    }
    
    // Test 4: Count total reviews
    console.log('\n📊 Test 4: Total review count');
    const totalReviews = await Review.countDocuments({ status: 'approved' });
    console.log('Total approved reviews:', totalReviews);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugReviewsAPI();
