const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkBookingSchemaDetails() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get bookings collection
    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');
    
    // Get a detailed sample booking
    const sampleBooking = await bookingsCollection.findOne({});
    
    console.log('📋 Detailed Booking Schema:');
    console.log('============================');
    console.log(JSON.stringify(sampleBooking, null, 2));

    // Check what fields are actually used
    console.log('\n🔍 Field Usage Analysis:');
    console.log('=========================');
    
    const fieldCounts = await bookingsCollection.aggregate([
      { $project: { 
          hasUser: { $cond: [{ $ne: ['$user', null] }, 1, 0] },
          hasVendor: { $cond: [{ $ne: ['$vendor', null] }, 1, 0] },
          hasVenue: { $cond: [{ $ne: ['$venue', null] }, 1, 0] },
          hasEventDate: { $cond: [{ $ne: ['$eventDate', null] }, 1, 0] },
          hasDate: { $cond: [{ $ne: ['$date', null] }, 1, 0] },
          hasTotalAmount: { $cond: [{ $ne: ['$totalAmount', null] }, 1, 0] },
          hasAmount: { $cond: [{ $ne: ['$amount', null] }, 1, 0] },
          hasPayment: { $cond: [{ $ne: ['$payment', null] }, 1, 0] }
        }
      },
      { $group: {
          _id: null,
          totalDocs: { $sum: 1 },
          userCount: { $sum: '$hasUser' },
          vendorCount: { $sum: '$hasVendor' },
          venueCount: { $sum: '$hasVenue' },
          eventDateCount: { $sum: '$hasEventDate' },
          dateCount: { $sum: '$hasDate' },
          totalAmountCount: { $sum: '$hasTotalAmount' },
          amountCount: { $sum: '$hasAmount' },
          paymentCount: { $sum: '$hasPayment' }
        }
      }
    ]).toArray();

    if (fieldCounts.length > 0) {
      const counts = fieldCounts[0];
      console.log(`📊 Total Documents: ${counts.totalDocs}`);
      console.log(`👤 User field: ${counts.userCount}/${counts.totalDocs} (${Math.round(counts.userCount/counts.totalDocs*100)}%)`);
      console.log(`👥 Vendor field: ${counts.vendorCount}/${counts.totalDocs} (${Math.round(counts.vendorCount/counts.totalDocs*100)}%)`);
      console.log(`🏢 Venue field: ${counts.venueCount}/${counts.totalDocs} (${Math.round(counts.venueCount/counts.totalDocs*100)}%)`);
      console.log(`📅 eventDate field: ${counts.eventDateCount}/${counts.totalDocs} (${Math.round(counts.eventDateCount/counts.totalDocs*100)}%)`);
      console.log(`📅 date field: ${counts.dateCount}/${counts.totalDocs} (${Math.round(counts.dateCount/counts.totalDocs*100)}%)`);
      console.log(`💰 totalAmount field: ${counts.totalAmountCount}/${counts.totalDocs} (${Math.round(counts.totalAmountCount/counts.totalDocs*100)}%)`);
      console.log(`💰 amount field: ${counts.amountCount}/${counts.totalDocs} (${Math.round(counts.amountCount/counts.totalDocs*100)}%)`);
      console.log(`💳 payment field: ${counts.paymentCount}/${counts.totalDocs} (${Math.round(counts.paymentCount/counts.totalDocs*100)}%)`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkBookingSchemaDetails();
