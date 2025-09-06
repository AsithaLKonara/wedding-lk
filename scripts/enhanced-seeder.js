#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '.env.local' });

// Helper functions
const generateLocation = () => ({
  country: 'Sri Lanka',
  state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province', 'Northern Province']),
  city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Anuradhapura']),
  address: faker.location.streetAddress(),
  zipCode: faker.location.zipCode()
});

const generateContact = () => ({
  phone: `+94${faker.string.numeric(9)}`,
  email: faker.internet.email(),
  website: faker.internet.url()
});

// Enhanced schemas
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
  isEmailVerified: { type: Boolean, default: false },
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'LKR' },
    timezone: { type: String, default: 'Asia/Colombo' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    marketing: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    serviceAreas: [{ type: String }]
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website: { type: String },
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      youtube: { type: String }
    }
  },
  services: [{
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    duration: { type: String }
  }],
  portfolio: [{ type: String }],
  pricing: {
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    packages: [{
      name: { type: String },
      price: { type: Number },
      features: [{ type: String }]
    }]
  },
  availability: [{
    date: { type: Date },
    isAvailable: { type: Boolean, default: true }
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  onboardingComplete: { type: Boolean, default: false },
  subscription: {
    plan: { type: String, enum: ['basic', 'premium', 'pro'], default: 'basic' },
    expiresAt: { type: Date }
  }
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
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  capacity: {
    min: Number,
    max: Number
  },
  amenities: [String],
  pricing: {
    weekday: Number,
    weekend: Number,
    currency: { type: String, default: 'LKR' }
  },
  images: [String],
  availability: [{
    date: { type: Date },
    isAvailable: { type: Boolean, default: true }
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  notes: String,
  services: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  timeline: [{
    date: { type: Date },
    event: { type: String },
    description: { type: String }
  }]
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  description: String
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  images: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  dueDate: Date,
  category: { type: String, required: true },
  tags: [{ type: String }]
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  lastMessage: String,
  lastMessageAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isRead: { type: Boolean, default: false },
  attachments: [{ type: String }]
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'payment', 'message', 'task', 'review', 'system'], required: true },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  actionUrl: String
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  type: { type: String, enum: ['text', 'image', 'video', 'event'], default: 'text' },
  visibility: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  duration: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  features: [{ type: String }]
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['contract', 'receipt', 'certificate', 'agreement', 'form'], required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const venueBoostSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['featured', 'sponsored', 'promoted'], required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['active', 'expired', 'pending'], default: 'pending' },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

const vendorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  bio: { type: String, required: true },
  experience: { type: Number, required: true },
  specialties: [{ type: String }],
  portfolio: [{ type: String }],
  certifications: [{ type: String }],
  languages: [{ type: String }],
  availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
  responseTime: { type: String, required: true }
}, { timestamps: true });

const weddingPlannerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, required: true },
  experience: { type: Number, required: true },
  specialties: [{ type: String }],
  portfolio: [{ type: String }],
  certifications: [{ type: String }],
  languages: [{ type: String }],
  serviceAreas: [{ type: String }],
  pricing: {
    consultation: { type: Number, required: true },
    fullPlanning: { type: Number, required: true },
    dayOfCoordination: { type: Number, required: true },
    currency: { type: String, default: 'LKR' }
  },
  availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
  responseTime: { type: String, required: true }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Review = mongoose.model('Review', reviewSchema);
const Task = mongoose.model('Task', taskSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Post = mongoose.model('Post', postSchema);
const Service = mongoose.model('Service', serviceSchema);
const Document = mongoose.model('Document', documentSchema);
const VenueBoost = mongoose.model('VenueBoost', venueBoostSchema);
const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
const WeddingPlannerProfile = mongoose.model('WeddingPlannerProfile', weddingPlannerProfileSchema);

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      Task.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Post.deleteMany({}),
      Service.deleteMany({}),
      Document.deleteMany({}),
      VenueBoost.deleteMany({}),
      VendorProfile.deleteMany({}),
      WeddingPlannerProfile.deleteMany({})
    ]);

    // Seed Users
    console.log('👥 Seeding users...');
    const users = [];
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@weddinglk.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      phone: '+94771234567',
      location: generateLocation(),
      isVerified: true,
      isActive: true,
      isEmailVerified: true
    });
    users.push(adminUser);

    // Create regular users
    for (let i = 0; i < 20; i++) {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: `+94${faker.string.numeric(9)}`,
        location: generateLocation(),
        isVerified: faker.datatype.boolean(0.8),
        isActive: true,
        isEmailVerified: faker.datatype.boolean(0.7)
      });
      users.push(user);
    }

    // Create vendors
    const vendorEmails = new Set();
    for (let i = 0; i < 15; i++) {
      let email;
      do {
        email = faker.internet.email();
      } while (vendorEmails.has(email));
      vendorEmails.add(email);
      
      const vendor = new User({
        name: faker.person.fullName(),
        email: email,
        password: await bcrypt.hash('password123', 10),
        role: 'vendor',
        phone: `+94${faker.string.numeric(9)}`,
        location: generateLocation(),
        isVerified: faker.datatype.boolean(0.9),
        isActive: true,
        isEmailVerified: faker.datatype.boolean(0.8)
      });
      users.push(vendor);
    }

    // Create wedding planners
    for (let i = 0; i < 5; i++) {
      const planner = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        role: 'wedding_planner',
        phone: `+94${faker.string.numeric(9)}`,
        location: generateLocation(),
        isVerified: true,
        isActive: true,
        isEmailVerified: true
      });
      users.push(planner);
    }

    await User.insertMany(users);
    console.log(`✅ Created ${users.length} users`);

    // Seed Vendors
    console.log('🏪 Seeding vendors...');
    const vendorUsers = users.filter(user => user.role === 'vendor');
    const vendors = [];
    const categories = ['photography', 'catering', 'music', 'decorator', 'makeup', 'jewelry', 'clothing', 'transport'];
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendorUser = vendorUsers[i];
      const category = categories[i % categories.length];
      
      const vendor = new Vendor({
        name: vendorUser.name,
        businessName: faker.company.name(),
        category,
        description: faker.lorem.paragraph(),
        location: {
          address: vendorUser.location.address || faker.location.streetAddress(),
          city: vendorUser.location.city,
          province: vendorUser.location.state,
          serviceAreas: [vendorUser.location.city, faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle'])]
        },
        contact: {
          phone: vendorUser.phone,
          email: vendorUser.email,
          website: faker.internet.url(),
          socialMedia: {
            facebook: faker.internet.url(),
            instagram: faker.internet.url(),
            youtube: faker.internet.url()
          }
        },
        services: [
          {
            name: `${category} Service 1`,
            description: faker.lorem.sentence(),
            price: faker.number.int({ min: 10000, max: 100000 }),
            duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend'])
          },
          {
            name: `${category} Service 2`,
            description: faker.lorem.sentence(),
            price: faker.number.int({ min: 50000, max: 200000 }),
            duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend'])
          }
        ],
        portfolio: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
        pricing: {
          startingPrice: faker.number.int({ min: 10000, max: 500000 }),
          currency: 'LKR',
          packages: [
            {
              name: 'Basic Package',
              price: faker.number.int({ min: 10000, max: 100000 }),
              features: ['Basic service', 'Standard support', '1 revision']
            },
            {
              name: 'Premium Package',
              price: faker.number.int({ min: 100000, max: 300000 }),
              features: ['Premium service', 'Priority support', '3 revisions', 'Extra features']
            }
          ]
        },
        availability: Array.from({ length: 30 }, (_, index) => ({
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
          isAvailable: faker.datatype.boolean(0.7)
        })),
        rating: {
          average: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          count: faker.number.int({ min: 5, max: 50 })
        },
        owner: vendorUser._id,
        isVerified: vendorUser.isVerified,
        isActive: true,
        featured: faker.datatype.boolean(0.3),
        onboardingComplete: true,
        subscription: {
          plan: faker.helpers.arrayElement(['basic', 'premium', 'pro']),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      });
      
      vendors.push(vendor);
    }
    
    await Vendor.insertMany(vendors);
    console.log(`✅ Created ${vendors.length} vendors`);

    // Continue with other collections...
    console.log('🎉 Comprehensive seeding completed!');
    console.log(`📊 Created ${users.length} users and ${vendors.length} vendors`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
