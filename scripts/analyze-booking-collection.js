const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function analyzeBookingCollection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get bookings collection
    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');
    
    // Get total count
    const totalBookings = await bookingsCollection.countDocuments();
    console.log(`📅 Total bookings in database: ${totalBookings}`);

    // Get sample bookings
    console.log('\n📋 Sample Booking Documents:');
    console.log('============================');
    
    const sampleBookings = await bookingsCollection.find({}).limit(3).toArray();
    
    for (let i = 0; i < sampleBookings.length; i++) {
      const booking = sampleBookings[i];
      console.log(`\n📅 Booking ${i + 1}:`);
      console.log(`   ID: ${booking._id}`);
      console.log(`   User: ${booking.user || 'N/A'}`);
      console.log(`   Vendor: ${booking.vendor || 'N/A'}`);
      console.log(`   Venue: ${booking.venue || 'N/A'}`);
      console.log(`   Date: ${booking.date || 'N/A'}`);
      console.log(`   Status: ${booking.status || 'N/A'}`);
      console.log(`   Total Amount: ${booking.totalAmount || 'N/A'}`);
      console.log(`   Guest Count: ${booking.guestCount || 'N/A'}`);
      console.log(`   Created: ${booking.createdAt || 'N/A'}`);
    }

    // Check booking schema fields
    console.log('\n🔍 Booking Schema Analysis:');
    console.log('============================');
    
    const sampleBooking = sampleBookings[0];
    if (sampleBooking) {
      console.log('📋 Available fields in booking documents:');
      Object.keys(sampleBooking).forEach(field => {
        console.log(`   ✅ ${field}: ${typeof sampleBooking[field]}`);
      });
    }

    // Check for any bookings with our expected schema
    console.log('\n🔍 Checking for bookings with expected schema:');
    console.log('===============================================');
    
    const expectedSchemaBookings = await bookingsCollection.find({
      user: { $exists: true },
      vendor: { $exists: true },
      date: { $exists: true },
      totalAmount: { $exists: true }
    }).limit(5).toArray();
    
    console.log(`📊 Bookings with expected schema: ${expectedSchemaBookings.length}`);
    
    if (expectedSchemaBookings.length > 0) {
      console.log('\n✅ Found bookings with correct schema:');
      expectedSchemaBookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. User: ${booking.user}, Vendor: ${booking.vendor}, Amount: ${booking.totalAmount}`);
      });
    } else {
      console.log('\n❌ No bookings found with expected schema!');
    }

    // Check for old schema bookings
    console.log('\n🔍 Checking for old schema bookings:');
    console.log('====================================');
    
    const oldSchemaBookings = await bookingsCollection.find({
      $or: [
        { userId: { $exists: true } },
        { packageId: { $exists: true } },
        { vendorId: { $exists: true } }
      ]
    }).limit(5).toArray();
    
    console.log(`📊 Bookings with old schema: ${oldSchemaBookings.length}`);
    
    if (oldSchemaBookings.length > 0) {
      console.log('\n⚠️ Found bookings with old schema:');
      oldSchemaBookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. Old fields: ${Object.keys(booking).filter(k => k.includes('Id')).join(', ')}`);
      });
    }

    // Check booking status distribution
    console.log('\n📊 Booking Status Distribution:');
    console.log('================================');
    
    const statusCounts = await bookingsCollection.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    statusCounts.forEach(status => {
      console.log(`   ${status._id || 'No Status'}: ${status.count} bookings`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

analyzeBookingCollection();
