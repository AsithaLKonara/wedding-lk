const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixPackagesWithVendors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all packages
    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
    const packages = await Package.find({});
    console.log(`📦 Found ${packages.length} packages`);

    // Get all vendors
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendors = await Vendor.find({});
    console.log(`👥 Found ${vendors.length} vendors`);

    if (vendors.length === 0) {
      console.log('❌ No vendors found, cannot update packages');
      return;
    }

    // Update each package with vendors
    for (let i = 0; i < packages.length; i++) {
      const packageData = packages[i];
      console.log(`\n🔧 Updating package: ${packageData.name}`);
      
      // Assign 2-3 vendors to each package
      const vendorIds = vendors.slice(0, Math.min(3, vendors.length)).map(v => v._id);
      
      await Package.findByIdAndUpdate(packageData._id, {
        vendors: vendorIds
      });
      
      console.log(`   ✅ Assigned ${vendorIds.length} vendors`);
    }

    console.log('\n🎉 Successfully updated all packages with vendors!');
    console.log('📊 Summary:');
    console.log(`   - Packages updated: ${packages.length}`);
    console.log(`   - Vendors assigned: ${vendors.length}`);
    console.log(`   - Each package now has vendor references`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixPackagesWithVendors();
