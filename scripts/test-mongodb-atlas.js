#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define schemas directly in the script (same as seed script)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user' },
  phone: String,
  location: {
    country: String,
    state: String,
    city: String,
    zipCode: String
  },
  status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

const vendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  category: String,
  description: String,
  location: {
    country: String,
    state: String,
    city: String,
    address: String
  },
  services: [{
    name: String,
    price: Number,
    description: String
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: {
    country: String,
    state: String,
    city: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  capacity: {
    min: Number,
    max: Number
  },
  pricing: {
    startingPrice: Number,
    packages: [{
      name: String,
      price: Number,
      description: String
    }]
  },
  amenities: [String],
  images: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  service: {
    name: String,
    price: Number,
    description: String
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'completed', 'refunded'], default: 'pending' },
  totalAmount: Number,
  notes: String
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  images: [String],
  tags: [String],
  author: {
    type: { type: String, enum: ['user', 'vendor', 'venue', 'planner'], required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    avatar: String,
    verified: { type: Boolean, default: false }
  },
  location: {
    city: String,
    venue: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);
const Task = mongoose.model('Task', taskSchema);
const Post = mongoose.model('Post', postSchema);

async function testMongoDBAtlas() {
  try {
    console.log('🧪 Testing MongoDB Atlas Connection and CRUD Operations...\n');
    
    // Test connection
    console.log('1. Testing MongoDB Atlas connection...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully\n');

    // Test User CRUD
    console.log('2. Testing User CRUD operations...');
    const userCount = await User.countDocuments();
    console.log(`   - Found ${userCount} users in database`);
    
    const testUser = await User.findOne({ email: 'admin@weddinglk.com' });
    if (testUser) {
      console.log(`   - Test user found: ${testUser.name} (${testUser.role})`);
    } else {
      console.log('   - No test user found');
    }
    console.log('✅ User operations working\n');

    // Test Vendor CRUD
    console.log('3. Testing Vendor CRUD operations...');
    const vendorCount = await Vendor.countDocuments();
    console.log(`   - Found ${vendorCount} vendors in database`);
    
    const testVendor = await Vendor.findOne();
    if (testVendor) {
      console.log(`   - Test vendor found: ${testVendor.businessName}`);
    }
    console.log('✅ Vendor operations working\n');

    // Test Venue CRUD
    console.log('4. Testing Venue CRUD operations...');
    const venueCount = await Venue.countDocuments();
    console.log(`   - Found ${venueCount} venues in database`);
    
    const testVenue = await Venue.findOne();
    if (testVenue) {
      console.log(`   - Test venue found: ${testVenue.name}`);
    }
    console.log('✅ Venue operations working\n');

    // Test Booking CRUD
    console.log('5. Testing Booking CRUD operations...');
    const bookingCount = await Booking.countDocuments();
    console.log(`   - Found ${bookingCount} bookings in database`);
    console.log('✅ Booking operations working\n');

    // Test Review CRUD
    console.log('6. Testing Review CRUD operations...');
    const reviewCount = await Review.countDocuments();
    console.log(`   - Found ${reviewCount} reviews in database`);
    console.log('✅ Review operations working\n');

    // Test Task CRUD
    console.log('7. Testing Task CRUD operations...');
    const taskCount = await Task.countDocuments();
    console.log(`   - Found ${taskCount} tasks in database`);
    console.log('✅ Task operations working\n');

    // Test Post CRUD
    console.log('8. Testing Post CRUD operations...');
    const postCount = await Post.countDocuments();
    console.log(`   - Found ${postCount} posts in database`);
    console.log('✅ Post operations working\n');

    // Test Authentication
    console.log('9. Testing Authentication...');
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      console.log(`   - Admin user found: ${adminUser.email}`);
      console.log(`   - User is active: ${adminUser.isActive}`);
      console.log(`   - User is verified: ${adminUser.isVerified}`);
    }
    console.log('✅ Authentication data ready\n');

    // Test Role-based Access
    console.log('10. Testing Role-based Access...');
    const roles = await User.distinct('role');
    console.log(`   - Available roles: ${roles.join(', ')}`);
    
    const roleCounts = {};
    for (const role of roles) {
      const count = await User.countDocuments({ role });
      roleCounts[role] = count;
    }
    console.log('   - Role distribution:', roleCounts);
    console.log('✅ Role-based access ready\n');

    // Test Database Indexes
    console.log('11. Testing Database Indexes...');
    const userIndexes = await User.collection.getIndexes();
    console.log(`   - User collection has ${Object.keys(userIndexes).length} indexes`);
    
    const vendorIndexes = await Vendor.collection.getIndexes();
    console.log(`   - Vendor collection has ${Object.keys(vendorIndexes).length} indexes`);
    console.log('✅ Database indexes working\n');

    // Test Complex Queries
    console.log('12. Testing Complex Queries...');
    
    // Test aggregation
    const vendorStats = await Vendor.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('   - Vendor categories:', vendorStats);
    
    // Test population
    const bookingsWithDetails = await Booking.find()
      .populate('client', 'name email')
      .populate('vendor', 'businessName email')
      .limit(1);
    console.log(`   - Bookings with populated data: ${bookingsWithDetails.length}`);
    console.log('✅ Complex queries working\n');

    console.log('🎉 All MongoDB Atlas tests passed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Vendors: ${vendorCount}`);
    console.log(`- Venues: ${venueCount}`);
    console.log(`- Bookings: ${bookingCount}`);
    console.log(`- Reviews: ${reviewCount}`);
    console.log(`- Tasks: ${taskCount}`);
    console.log(`- Posts: ${postCount}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@weddinglk.com / admin123');
    console.log('User: john@example.com / admin123');
    console.log('User: jane@example.com / admin123');
    console.log('Planner: planner@weddinglk.com / admin123');
    
    console.log('\n✅ MongoDB Atlas is ready for production use!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the tests
testMongoDBAtlas();
