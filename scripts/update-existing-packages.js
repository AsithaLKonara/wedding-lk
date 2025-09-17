const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function updateExistingPackages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get vendors
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendors = await Vendor.find({}).limit(5);
    console.log(`👥 Found ${vendors.length} vendors`);

    // Get existing packages
    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
    const packages = await Package.find({});
    console.log(`📦 Found ${packages.length} packages`);

    if (packages.length === 0) {
      console.log('❌ No packages found to update');
      return;
    }

    // Update each package with vendors
    console.log('\n🔧 Updating existing packages with vendors...');
    
    for (const packageData of packages) {
      console.log(`   Updating: ${packageData.name}`);
      
      // Assign 2-3 vendors to each package
      const vendorIds = vendors.slice(0, Math.min(3, vendors.length)).map(v => v._id);
      
      await Package.findByIdAndUpdate(packageData._id, {
        vendors: vendorIds
      });
      
      console.log(`   ✅ Assigned ${vendorIds.length} vendors`);
    }

    // Verify updates
    const updatedPackages = await Package.find({}).populate('vendors', 'name businessName category');
    console.log('\n📊 Updated Packages:');
    for (const pkg of updatedPackages) {
      console.log(`   📦 ${pkg.name}: ${pkg.vendors.length} vendors`);
      pkg.vendors.forEach(vendor => {
        console.log(`      👥 ${vendor.name} (${vendor.category})`);
      });
    }

    console.log('\n🎉 Successfully updated all packages with vendors!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateExistingPackages();
