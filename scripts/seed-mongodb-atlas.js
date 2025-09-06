#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Debug: Check if MONGODB_URI is loaded
console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');

// Define schemas directly in the script
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

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K.5K2e', // admin123
    role: 'admin',
    phone: '+94771234567',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      zipCode: '00100'
    },
    status: 'active',
    isVerified: true,
    isActive: true,
    isEmailVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K.5K2e', // admin123
    role: 'user',
    phone: '+94771234568',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      zipCode: '00100'
    },
    status: 'active',
    isVerified: true,
    isActive: true,
    isEmailVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K.5K2e', // admin123
    role: 'user',
    phone: '+94771234569',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      zipCode: '00100'
    },
    status: 'active',
    isVerified: true,
    isActive: true,
    isEmailVerified: true
  },
  {
    name: 'Wedding Planner Pro',
    email: 'planner@weddinglk.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K.5K2e', // admin123
    role: 'wedding_planner',
    phone: '+94771234570',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      zipCode: '00100'
    },
    status: 'active',
    isVerified: true,
    isActive: true,
    isEmailVerified: true
  }
];

const sampleVendors = [
  {
    businessName: 'Royal Wedding Photography',
    ownerName: 'David Wilson',
    email: 'david@royalphotography.com',
    phone: '+94771234571',
    category: 'photography',
    description: 'Professional wedding photography services with over 10 years of experience',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      address: '123 Galle Road, Colombo 03'
    },
    services: [
      { name: 'Full Day Photography', price: 50000, description: 'Complete wedding day coverage' },
      { name: 'Half Day Photography', price: 30000, description: 'Ceremony and reception coverage' },
      { name: 'Engagement Session', price: 15000, description: 'Pre-wedding photo session' }
    ],
    rating: { average: 4.8, count: 25 },
    isVerified: true,
    isActive: true
  },
  {
    businessName: 'Spice Garden Catering',
    ownerName: 'Maria Fernando',
    email: 'maria@spicegarden.com',
    phone: '+94771234572',
    category: 'catering',
    description: 'Authentic Sri Lankan cuisine for your special day',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      address: '456 Kandy Road, Colombo 07'
    },
    services: [
      { name: 'Buffet Service', price: 2500, description: 'Per person buffet with 15+ dishes' },
      { name: 'Plated Service', price: 3500, description: 'Elegant plated dinner service' },
      { name: 'Cocktail Reception', price: 1500, description: 'Appetizers and drinks for cocktail hour' }
    ],
    rating: { average: 4.6, count: 18 },
    isVerified: true,
    isActive: true
  },
  {
    businessName: 'Harmony Music Band',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@harmonymusic.com',
    phone: '+94771234573',
    category: 'entertainment',
    description: 'Live music entertainment for weddings and special events',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      address: '789 Union Place, Colombo 02'
    },
    services: [
      { name: 'Full Band Performance', price: 75000, description: '5-piece band with sound system' },
      { name: 'DJ Service', price: 25000, description: 'Professional DJ with music library' },
      { name: 'Acoustic Duo', price: 35000, description: 'Intimate acoustic performance' }
    ],
    rating: { average: 4.7, count: 22 },
    isVerified: true,
    isActive: true
  }
];

const sampleVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Elegant ballroom with crystal chandeliers and marble floors',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo',
      address: '100 Galle Face, Colombo 03',
      coordinates: { latitude: 6.9271, longitude: 79.8612 }
    },
    capacity: { min: 100, max: 300 },
    pricing: {
      startingPrice: 150000,
      packages: [
        { name: 'Basic Package', price: 150000, description: 'Venue rental only' },
        { name: 'Standard Package', price: 200000, description: 'Venue + basic decorations' },
        { name: 'Premium Package', price: 250000, description: 'Venue + full decorations + lighting' }
      ]
    },
    amenities: ['Air Conditioning', 'Parking', 'Bridal Suite', 'Sound System', 'Lighting'],
    images: ['venue1.jpg', 'venue2.jpg'],
    rating: { average: 4.5, count: 15 },
    isActive: true,
    isAvailable: true
  },
  {
    name: 'Garden Paradise Resort',
    description: 'Beautiful outdoor garden venue with natural surroundings',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Negombo',
      address: '200 Beach Road, Negombo',
      coordinates: { latitude: 7.2095, longitude: 79.8350 }
    },
    capacity: { min: 50, max: 200 },
    pricing: {
      startingPrice: 100000,
      packages: [
        { name: 'Garden Package', price: 100000, description: 'Garden venue rental' },
        { name: 'Beach Package', price: 150000, description: 'Beachfront ceremony + garden reception' },
        { name: 'Luxury Package', price: 200000, description: 'Full resort experience' }
      ]
    },
    amenities: ['Garden Setting', 'Beach Access', 'Parking', 'Restrooms', 'Catering Kitchen'],
    images: ['garden1.jpg', 'garden2.jpg'],
    rating: { average: 4.8, count: 20 },
    isActive: true,
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting MongoDB Atlas seeding...');
    
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Task.deleteMany({});
    await Post.deleteMany({});

    // Seed users
    console.log('👥 Seeding users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Seed vendors
    console.log('🏢 Seeding vendors...');
    const vendors = await Vendor.insertMany(sampleVendors);
    console.log(`✅ Created ${vendors.length} vendors`);

    // Seed venues
    console.log('🏛️ Seeding venues...');
    const venues = await Venue.insertMany(sampleVenues);
    console.log(`✅ Created ${venues.length} venues`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const bookings = await Booking.insertMany([
      {
        client: users[1]._id,
        vendor: vendors[0]._id,
        service: vendors[0].services[0],
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'confirmed',
        paymentStatus: 'completed',
        totalAmount: 50000,
        notes: 'Full day photography for wedding ceremony and reception'
      },
      {
        client: users[2]._id,
        vendor: vendors[1]._id,
        service: vendors[1].services[0],
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount: 75000,
        notes: 'Buffet service for 30 guests'
      }
    ]);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const reviews = await Review.insertMany([
      {
        client: users[1]._id,
        vendor: vendors[0]._id,
        booking: bookings[0]._id,
        rating: 5,
        comment: 'Excellent photography service! David captured every special moment beautifully.',
        isVerified: true
      },
      {
        client: users[2]._id,
        vendor: vendors[1]._id,
        rating: 4,
        comment: 'Great food and service. Highly recommended for authentic Sri Lankan cuisine.',
        isVerified: true
      }
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Create sample tasks
    console.log('📋 Creating sample tasks...');
    const tasks = await Task.insertMany([
      {
        title: 'Book photographer',
        description: 'Research and book wedding photographer',
        assignedTo: users[1]._id,
        createdBy: users[3]._id, // wedding planner
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Finalize guest list',
        description: 'Confirm final guest count for catering',
        assignedTo: users[1]._id,
        createdBy: users[3]._id,
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`✅ Created ${tasks.length} tasks`);

    // Create sample posts
    console.log('📝 Creating sample posts...');
    const posts = await Post.insertMany([
      {
        content: 'Just had the most amazing wedding photography session with Royal Wedding Photography! The team was professional and the photos are stunning. Highly recommended! 📸✨',
        images: ['photo1.jpg', 'photo2.jpg'],
        tags: ['photography', 'wedding', 'recommendation'],
        author: {
          type: 'user',
          id: users[1]._id,
          name: users[1].name,
          avatar: null,
          verified: true
        },
        engagement: { likes: 12, comments: 3, shares: 1, views: 45 },
        status: 'active',
        isActive: true
      },
      {
        content: 'New wedding package available! Our premium photography package now includes engagement session, full day coverage, and 500+ edited photos. Book now for 20% off!',
        images: ['package1.jpg'],
        tags: ['photography', 'package', 'offer'],
        author: {
          type: 'vendor',
          id: vendors[0]._id,
          name: vendors[0].businessName,
          avatar: null,
          verified: true
        },
        engagement: { likes: 8, comments: 2, shares: 0, views: 32 },
        status: 'active',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${posts.length} posts`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Vendors: ${vendors.length}`);
    console.log(`- Venues: ${venues.length}`);
    console.log(`- Bookings: ${bookings.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Posts: ${posts.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@weddinglk.com / admin123');
    console.log('User: john@example.com / admin123');
    console.log('User: jane@example.com / admin123');
    console.log('Planner: planner@weddinglk.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the seeding
seedDatabase();
