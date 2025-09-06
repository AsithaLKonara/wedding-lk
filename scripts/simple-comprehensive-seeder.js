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

// Simple schemas
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
  category: String,
  description: String,
  location: {
    country: String,
    state: String,
    city: String,
    address: String
  },
  contact: {
    email: { type: String, required: true, unique: true },
    phone: String,
    website: String
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
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
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
const Review = mongoose.model('Review', reviewSchema);
const Task = mongoose.model('Task', taskSchema);
const Post = mongoose.model('Post', postSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Payment = mongoose.model('Payment', paymentSchema);
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
      Review.deleteMany({}),
      Task.deleteMany({}),
      Post.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Payment.deleteMany({}),
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
    for (let i = 0; i < 15; i++) {
      const vendor = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
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
        businessName: faker.company.name(),
        ownerName: vendorUser.name,
        category,
        description: faker.lorem.paragraph(),
        location: {
          country: vendorUser.location.country,
          state: vendorUser.location.state,
          city: vendorUser.location.city,
          address: vendorUser.location.address
        },
        contact: {
          email: vendorUser.email || faker.internet.email(),
          phone: vendorUser.phone,
          website: faker.internet.url()
        },
        services: [
          {
            name: `${category} Service 1`,
            price: faker.number.int({ min: 10000, max: 100000 }),
            description: faker.lorem.sentence()
          },
          {
            name: `${category} Service 2`,
            price: faker.number.int({ min: 50000, max: 200000 }),
            description: faker.lorem.sentence()
          }
        ],
        rating: {
          average: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          count: faker.number.int({ min: 5, max: 50 })
        },
        isVerified: vendorUser.isVerified,
        isActive: true
      });
      
      vendors.push(vendor);
    }
    
    await Vendor.insertMany(vendors);
    console.log(`✅ Created ${vendors.length} vendors`);

    // Seed Venues
    console.log('🏛️ Seeding venues...');
    const venues = [];
    const venueTypes = ['Hotel', 'Garden', 'Beach', 'Historic', 'Modern', 'Traditional'];
    
    for (let i = 0; i < 10; i++) {
      const venueType = venueTypes[i % venueTypes.length];
      
      const venue = new Venue({
        name: `${venueType} ${faker.company.name()}`,
        description: faker.lorem.paragraphs(2),
        location: {
          country: 'Sri Lanka',
          state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province']),
          city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Negombo']),
          address: faker.location.streetAddress(),
          coordinates: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude()
          }
        },
        capacity: {
          min: faker.number.int({ min: 50, max: 200 }),
          max: faker.number.int({ min: 200, max: 1000 })
        },
        pricing: {
          startingPrice: faker.number.int({ min: 50000, max: 200000 }),
          packages: [
            {
              name: 'Basic Package',
              price: faker.number.int({ min: 50000, max: 100000 }),
              description: 'Basic venue rental'
            },
            {
              name: 'Premium Package',
              price: faker.number.int({ min: 100000, max: 200000 }),
              description: 'Premium venue with amenities'
            }
          ]
        },
        amenities: faker.helpers.arrayElements([
          'Parking', 'Air Conditioning', 'Sound System', 'Lighting', 'Catering Kitchen',
          'Bridal Suite', 'Groom Room', 'Photography Spots', 'Garden', 'Pool'
        ], { min: 3, max: 8 }),
        images: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
        rating: {
          average: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          count: faker.number.int({ min: 3, max: 30 })
        },
        isActive: true,
        isAvailable: faker.datatype.boolean(0.8)
      });
      
      venues.push(venue);
    }
    
    await Venue.insertMany(venues);
    console.log(`✅ Created ${venues.length} venues`);

    // Seed Bookings
    console.log('📅 Seeding bookings...');
    const regularUsers = users.filter(user => user.role === 'user');
    const bookings = [];
    
    for (let i = 0; i < 30; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const vendor = faker.helpers.arrayElement(vendors);
      
      const booking = new Booking({
        client: user._id,
        vendor: vendor._id,
        service: faker.helpers.arrayElement(vendor.services),
        date: faker.date.future(),
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled', 'completed']),
        paymentStatus: faker.helpers.arrayElement(['pending', 'paid', 'completed', 'refunded']),
        totalAmount: faker.number.int({ min: 100000, max: 2000000 }),
        notes: faker.lorem.sentence()
      });
      
      bookings.push(booking);
    }
    
    await Booking.insertMany(bookings);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Seed Reviews
    console.log('⭐ Seeding reviews...');
    const reviews = [];
    
    // Vendor reviews
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const vendor = faker.helpers.arrayElement(vendors);
      
      const review = new Review({
        client: user._id,
        vendor: vendor._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        isVerified: faker.datatype.boolean(0.7)
      });
      
      reviews.push(review);
    }
    
    // Venue reviews
    for (let i = 0; i < 30; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const venue = faker.helpers.arrayElement(venues);
      
      const review = new Review({
        client: user._id,
        venue: venue._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        isVerified: faker.datatype.boolean(0.7)
      });
      
      reviews.push(review);
    }
    
    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Seed Tasks
    console.log('📋 Seeding tasks...');
    const planners = users.filter(user => user.role === 'wedding_planner');
    const tasks = [];
    
    for (let i = 0; i < 40; i++) {
      const planner = faker.helpers.arrayElement(planners);
      const user = faker.helpers.arrayElement(regularUsers);
      
      const task = new Task({
        title: faker.helpers.arrayElement([
          'Book photographer',
          'Choose wedding dress',
          'Plan ceremony music',
          'Arrange catering',
          'Book venue',
          'Send invitations',
          'Plan decorations',
          'Organize transportation'
        ]),
        description: faker.lorem.sentence(),
        assignedTo: user._id,
        createdBy: planner._id,
        status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        dueDate: faker.date.future()
      });
      
      tasks.push(task);
    }
    
    await Task.insertMany(tasks);
    console.log(`✅ Created ${tasks.length} tasks`);

    // Seed Conversations and Messages
    console.log('💬 Seeding conversations and messages...');
    const conversations = [];
    const messages = [];
    
    for (let i = 0; i < 25; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const vendor = faker.helpers.arrayElement(vendorUsers);
      
      const conversation = new Conversation({
        participants: [user._id, vendor._id],
        type: 'direct',
        lastMessage: faker.lorem.sentence(),
        lastMessageAt: faker.date.recent(),
        isActive: faker.datatype.boolean(0.8)
      });
      
      conversations.push(conversation);
      
      // Create messages for this conversation
      const messageCount = faker.number.int({ min: 3, max: 15 });
      for (let j = 0; j < messageCount; j++) {
        const sender = j % 2 === 0 ? user : vendor;
        
        const message = new Message({
          conversation: conversation._id,
          sender: sender._id,
          content: faker.lorem.sentence(),
          type: faker.helpers.arrayElement(['text', 'image', 'file']),
          isRead: faker.datatype.boolean(0.7),
          attachments: faker.datatype.boolean() ? [faker.image.url()] : []
        });
        
        messages.push(message);
      }
    }
    
    await Conversation.insertMany(conversations);
    await Message.insertMany(messages);
    console.log(`✅ Created ${conversations.length} conversations and ${messages.length} messages`);

    // Seed Notifications
    console.log('🔔 Seeding notifications...');
    const notifications = [];
    
    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(users);
      
      const notification = new Notification({
        user: user._id,
        title: faker.helpers.arrayElement([
          'New booking request',
          'Payment received',
          'Review submitted',
          'Task assigned',
          'Message received',
          'Booking confirmed',
          'Payment reminder'
        ]),
        message: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(['booking', 'payment', 'message', 'task', 'review', 'system']),
        isRead: faker.datatype.boolean(0.6),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        actionUrl: faker.internet.url()
      });
      
      notifications.push(notification);
    }
    
    await Notification.insertMany(notifications);
    console.log(`✅ Created ${notifications.length} notifications`);

    // Seed Posts
    console.log('📝 Seeding posts...');
    const posts = [];
    
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      
      const post = new Post({
        content: faker.lorem.paragraphs(2),
        images: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }, () => faker.image.url()),
        tags: faker.helpers.arrayElements(['wedding', 'photography', 'catering', 'venue', 'planning'], { min: 1, max: 3 }),
        author: {
          type: user.role === 'admin' ? 'user' : (user.role === 'wedding_planner' ? 'planner' : user.role),
          id: user._id,
          name: user.name,
          avatar: null,
          verified: user.isVerified
        },
        engagement: {
          likes: faker.number.int({ min: 0, max: 50 }),
          comments: faker.number.int({ min: 0, max: 20 }),
          shares: faker.number.int({ min: 0, max: 10 }),
          views: faker.number.int({ min: 0, max: 200 })
        },
        status: 'active',
        isActive: true
      });
      
      posts.push(post);
    }
    
    await Post.insertMany(posts);
    console.log(`✅ Created ${posts.length} posts`);

    // Seed Payments
    console.log('💳 Seeding payments...');
    const payments = [];
    
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const user = users.find(u => u._id.toString() === booking.client.toString());
      
      const paymentCount = faker.number.int({ min: 1, max: 3 });
      
      for (let j = 0; j < paymentCount; j++) {
        const payment = new Payment({
          user: user._id,
          booking: booking._id,
          amount: faker.number.int({ min: 10000, max: booking.totalAmount / paymentCount }),
          currency: 'LKR',
          status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'refunded']),
          paymentMethod: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'mobile_payment', 'cash']),
          transactionId: faker.string.alphanumeric(20),
          paymentDate: faker.date.recent(),
          description: faker.helpers.arrayElement([
            'Deposit Payment',
            'Final Payment',
            'Additional Services',
            'Venue Booking Fee'
          ])
        });
        
        payments.push(payment);
      }
    }
    
    await Payment.insertMany(payments);
    console.log(`✅ Created ${payments.length} payments`);

    // Seed Services
    console.log('🛠️ Seeding services...');
    const services = [];
    
    for (let i = 0; i < 100; i++) {
      const vendor = faker.helpers.arrayElement(vendors);
      
      const service = new Service({
        name: faker.helpers.arrayElement([
          'Wedding Photography',
          'Catering Service',
          'Music Entertainment',
          'Floral Arrangements',
          'Makeup Artist',
          'Wedding Dress',
          'Transportation',
          'Venue Decoration'
        ]),
        description: faker.lorem.paragraph(),
        vendor: vendor._id,
        category: vendor.category,
        price: faker.number.int({ min: 10000, max: 500000 }),
        currency: 'LKR',
        duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend']),
        isActive: faker.datatype.boolean(0.9),
        features: faker.helpers.arrayElements([
          'Professional service',
          'High quality materials',
          'Experienced team',
          'Customizable options',
          '24/7 support'
        ], { min: 2, max: 5 })
      });
      
      services.push(service);
    }
    
    await Service.insertMany(services);
    console.log(`✅ Created ${services.length} services`);

    // Seed Documents
    console.log('📄 Seeding documents...');
    const documents = [];
    
    for (let i = 0; i < 30; i++) {
      const user = faker.helpers.arrayElement(users);
      
      const document = new Document({
        user: user._id,
        name: faker.helpers.arrayElement([
          'Wedding Contract',
          'Payment Receipt',
          'Vendor Agreement',
          'Venue Booking Form',
          'Insurance Document',
          'Marriage Certificate',
          'ID Copy',
          'Bank Statement'
        ]),
        type: faker.helpers.arrayElement(['contract', 'receipt', 'certificate', 'agreement', 'form']),
        url: faker.internet.url(),
        size: faker.number.int({ min: 1000, max: 10000000 }),
        mimeType: faker.helpers.arrayElement(['application/pdf', 'image/jpeg', 'image/png', 'application/msword']),
        isVerified: faker.datatype.boolean(0.7),
        uploadedAt: faker.date.recent()
      });
      
      documents.push(document);
    }
    
    await Document.insertMany(documents);
    console.log(`✅ Created ${documents.length} documents`);

    // Seed Venue Boosts
    console.log('🚀 Seeding venue boosts...');
    const boosts = [];
    
    for (let i = 0; i < 15; i++) {
      const venue = faker.helpers.arrayElement(venues);
      const user = faker.helpers.arrayElement(users);
      
      const boost = new VenueBoost({
        venue: venue._id,
        user: user._id,
        type: faker.helpers.arrayElement(['featured', 'sponsored', 'promoted']),
        duration: faker.number.int({ min: 7, max: 30 }),
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
        cost: faker.number.int({ min: 5000, max: 50000 }),
        currency: 'LKR',
        status: faker.helpers.arrayElement(['active', 'expired', 'pending']),
        impressions: faker.number.int({ min: 100, max: 10000 }),
        clicks: faker.number.int({ min: 10, max: 1000 })
      });
      
      boosts.push(boost);
    }
    
    await VenueBoost.insertMany(boosts);
    console.log(`✅ Created ${boosts.length} venue boosts`);

    // Seed Vendor Profiles
    console.log('👤 Seeding vendor profiles...');
    const vendorProfiles = [];
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendorUser = vendorUsers[i];
      const vendor = vendors[i];
      
      const profile = new VendorProfile({
        user: vendorUser._id,
        vendor: vendor._id,
        bio: faker.lorem.paragraphs(2),
        experience: faker.number.int({ min: 1, max: 20 }),
        specialties: faker.helpers.arrayElements([
          'Wedding Photography',
          'Event Planning',
          'Catering',
          'Music',
          'Decorations',
          'Makeup',
          'Transportation'
        ], { min: 2, max: 5 }),
        portfolio: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => faker.image.url()),
        certifications: faker.helpers.arrayElements([
          'Professional Photography Certificate',
          'Event Planning Certification',
          'Food Safety Certificate',
          'Business License'
        ], { min: 0, max: 3 }),
        languages: faker.helpers.arrayElements(['English', 'Sinhala', 'Tamil'], { min: 1, max: 3 }),
        availability: faker.helpers.arrayElement(['available', 'busy', 'unavailable']),
        responseTime: faker.helpers.arrayElement(['within 1 hour', 'within 24 hours', 'within 48 hours'])
      });
      
      vendorProfiles.push(profile);
    }
    
    await VendorProfile.insertMany(vendorProfiles);
    console.log(`✅ Created ${vendorProfiles.length} vendor profiles`);

    // Seed Wedding Planner Profiles
    console.log('💒 Seeding wedding planner profiles...');
    const weddingPlannerProfiles = [];
    const weddingPlanners = users.filter(user => user.role === 'wedding_planner');
    
    for (let i = 0; i < weddingPlanners.length; i++) {
      const planner = weddingPlanners[i];
      
      const profile = new WeddingPlannerProfile({
        user: planner._id,
        bio: faker.lorem.paragraphs(3),
        experience: faker.number.int({ min: 2, max: 25 }),
        specialties: faker.helpers.arrayElements([
          'Traditional Weddings',
          'Modern Weddings',
          'Destination Weddings',
          'Small Intimate Weddings',
          'Large Scale Events',
          'Cultural Weddings'
        ], { min: 2, max: 4 }),
        portfolio: Array.from({ length: faker.number.int({ min: 8, max: 20 }) }, () => faker.image.url()),
        certifications: faker.helpers.arrayElements([
          'Certified Wedding Planner',
          'Event Management Certificate',
          'Business Management',
          'Customer Service Excellence'
        ], { min: 1, max: 4 }),
        languages: faker.helpers.arrayElements(['English', 'Sinhala', 'Tamil'], { min: 1, max: 3 }),
        serviceAreas: faker.helpers.arrayElements([
          'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Anuradhapura'
        ], { min: 2, max: 5 }),
        pricing: {
          consultation: faker.number.int({ min: 5000, max: 25000 }),
          fullPlanning: faker.number.int({ min: 50000, max: 200000 }),
          dayOfCoordination: faker.number.int({ min: 25000, max: 100000 }),
          currency: 'LKR'
        },
        availability: faker.helpers.arrayElement(['available', 'busy', 'unavailable']),
        responseTime: faker.helpers.arrayElement(['within 1 hour', 'within 24 hours', 'within 48 hours'])
      });
      
      weddingPlannerProfiles.push(profile);
    }
    
    await WeddingPlannerProfile.insertMany(weddingPlannerProfiles);
    console.log(`✅ Created ${weddingPlannerProfiles.length} wedding planner profiles`);

    console.log('\n🎉 Comprehensive database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏪 Vendors: ${vendors.length}`);
    console.log(`🏛️ Venues: ${venues.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log(`💬 Conversations: ${conversations.length}`);
    console.log(`📨 Messages: ${messages.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`📝 Posts: ${posts.length}`);
    console.log(`🛠️ Services: ${services.length}`);
    console.log(`📄 Documents: ${documents.length}`);
    console.log(`🚀 Venue Boosts: ${boosts.length}`);
    console.log(`👤 Vendor Profiles: ${vendorProfiles.length}`);
    console.log(`💒 Wedding Planner Profiles: ${weddingPlannerProfiles.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@weddinglk.com / admin123');
    console.log('Users: Various test users with password123');
    console.log('Vendors: Various test vendors with password123');
    console.log('Planners: Various test planners with password123');
    
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
