const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function createPackagesWithVendors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get vendors
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendors = await Vendor.find({}).limit(5);
    console.log(`👥 Found ${vendors.length} vendors`);

    if (vendors.length === 0) {
      console.log('❌ No vendors found, cannot create packages');
      return;
    }

    // Create Package schema
    const PackageSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      originalPrice: Number,
      features: [String],
      venues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
      vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
      featured: { type: Boolean, default: false },
      rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
      }
    }, { timestamps: true });

    const Package = mongoose.model('Package', PackageSchema);

    // Create packages with vendors
    const packages = [
      {
        name: "Complete Wedding Package",
        description: "All-inclusive wedding package with venue, catering, photography, and decoration",
        price: 1500000,
        originalPrice: 1800000,
        features: ["All-inclusive", "Professional team", "Customizable"],
        vendors: vendors.slice(0, 3).map(v => v._id),
        featured: true
      },
      {
        name: "Beach Wedding Package",
        description: "Romantic beach wedding package with ocean views",
        price: 1200000,
        originalPrice: 1400000,
        features: ["Beach setting", "Tropical theme", "Romantic atmosphere"],
        vendors: vendors.slice(1, 4).map(v => v._id),
        featured: true
      },
      {
        name: "Budget Wedding Package",
        description: "Affordable wedding package with essential services",
        price: 800000,
        originalPrice: 1000000,
        features: ["Budget-friendly", "Essential services", "Quality vendors"],
        vendors: vendors.slice(2, 5).map(v => v._id),
        featured: false
      }
    ];

    console.log('\n📦 Creating packages with vendors...');
    
    for (const packageData of packages) {
      const newPackage = new Package(packageData);
      await newPackage.save();
      console.log(`   ✅ Created: ${packageData.name} with ${packageData.vendors.length} vendors`);
    }

    // Verify packages were created
    const totalPackages = await Package.countDocuments();
    console.log(`\n🎉 Successfully created packages!`);
    console.log(`📊 Total packages in database: ${totalPackages}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createPackagesWithVendors();
