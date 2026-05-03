const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function checkData() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
    await mongoose.connect(uri);
    console.log('✅ Connected to DB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const Venue = mongoose.models.Venue || mongoose.model('Venue', new mongoose.Schema({}, { strict: false }));
    const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
    const VendorProfile = mongoose.models.VendorProfile || mongoose.model('VendorProfile', new mongoose.Schema({}, { strict: false }));
    
    console.log({
      vendors: await Vendor.countDocuments(),
      vendorProfiles: await VendorProfile.countDocuments(),
      venues: await Venue.countDocuments(),
      reviews: await Review.countDocuments(),
      featuredVendors: await Vendor.countDocuments({ featured: true }),
      featuredVenues: await Venue.countDocuments({ featured: true })
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();
