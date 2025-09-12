const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin'], default: 'user' },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    bio: String,
    location: {
      city: String,
      province: String,
      address: String
    },
    weddingDate: Date,
    budget: Number,
    guestCount: Number
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    smsUpdates: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: String,
    city: String,
    province: String,
    coordinates: { lat: Number, lng: Number }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  services: [{
    name: String,
    description: String,
    price: Number,
    duration: String
  }],
  pricing: {
    startingPrice: Number,
    currency: { type: String, default: 'LKR' },
    packages: [{
      name: String,
      description: String,
      price: Number,
      includes: [String]
    }]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  portfolio: [String],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Venue Schema
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: String,
    city: String,
    province: String,
    coordinates: { lat: Number, lng: Number }
  },
  capacity: {
    min: Number,
    max: Number
  },
  amenities: [String],
  pricing: {
    startingPrice: Number,
    currency: { type: String, default: 'LKR' }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  images: [String],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  planner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: {
    name: String,
    description: String,
    price: Number
  },
  eventDate: { type: Date, required: true },
  eventTime: String,
  duration: Number,
  guestCount: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  payment: {
    amount: Number,
    currency: String,
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    method: String,
    transactionId: String
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  overallRating: { type: Number, min: 1, max: 5, required: true },
  categoryRatings: {
    service: { type: Number, min: 1, max: 5, default: 5 },
    quality: { type: Number, min: 1, max: 5, default: 5 },
    value: { type: Number, min: 1, max: 5, default: 5 },
    communication: { type: Number, min: 1, max: 5, default: 5 },
    timeliness: { type: Number, min: 1, max: 5, default: 5 }
  },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  pros: [String],
  cons: [String],
  images: [String],
  videos: [String],
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  isAnonymous: { type: Boolean, default: false },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notHelpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reportCount: { type: Number, default: 0 },
  vendorResponse: {
    comment: String,
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'approved' },
  moderationNotes: String,
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  category: { type: String, enum: ['info', 'success', 'warning', 'error', 'reminder'], default: 'info' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  shortMessage: String,
  actionText: String,
  actionUrl: String,
  data: mongoose.Schema.Types.Mixed,
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  deliveryStatus: {
    inApp: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'delivered' },
    email: { type: String, enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'], default: 'pending' },
    sms: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'], default: 'pending' },
    push: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'], default: 'pending' }
  },
  read: { type: Boolean, default: false },
  readAt: Date,
  clicked: { type: Boolean, default: false },
  clickedAt: Date,
  actionTaken: { type: Boolean, default: false },
  actionTakenAt: Date,
  scheduledFor: Date,
  expiresAt: Date,
  groupKey: String,
  parentNotificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  read: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  method: { type: String, enum: ['card', 'bank_transfer', 'cash'], default: 'card' },
  transactionId: String,
  stripePaymentIntentId: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calendar Event Schema
const calendarEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, enum: ['booking', 'meeting', 'consultation', 'event'], default: 'booking' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled'], default: 'scheduled' },
  location: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Message = mongoose.model('Message', messageSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

// Helper functions
const categories = ['photographer', 'catering', 'decoration', 'music', 'transport', 'makeup', 'florist', 'videographer'];
const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Negombo', 'Matara', 'Kurunegala'];
const provinces = ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'North Central Province', 'North Western Province', 'Uva Province', 'Sabaragamuwa Province'];

function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomCity() {
  return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomProvince() {
  return provinces[Math.floor(Math.random() * provinces.length)];
}

function generateRandomRating() {
  return Math.round((Math.random() * 2 + 3) * 100) / 100; // 3.0 to 5.0
}

function generateRandomPrice(min = 50000, max = 500000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Main seeding function
async function seedComprehensiveData() {
  try {
    await connectDB();
    
    console.log('🚀 Starting comprehensive relational data seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
      Message.deleteMany({}),
      Payment.deleteMany({}),
      CalendarEvent.deleteMany({})
    ]);
    
    console.log('✅ Existing data cleared');
    
    // Create Admin Users
    console.log('👑 Creating admin users...');
    const adminUsers = [];
    for (let i = 1; i <= 3; i++) {
      const admin = new User({
        name: `Admin ${i}`,
        email: `admin${i}@weddinglk.com`,
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        profile: {
          firstName: `Admin`,
          lastName: `${i}`,
          phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
          bio: `System administrator ${i} for WeddingLK platform`,
          location: {
            city: 'Colombo',
            province: 'Western Province',
            address: `${i} Admin Street, Colombo`
          }
        },
        isVerified: true,
        isActive: true
      });
      await admin.save();
      adminUsers.push(admin);
    }
    console.log(`✅ Created ${adminUsers.length} admin users`);
    
    // Create Wedding Planners
    console.log('💍 Creating wedding planners...');
    const planners = [];
    for (let i = 1; i <= 10; i++) {
      const planner = new User({
        name: `Wedding Planner ${i}`,
        email: `planner${i}@weddinglk.com`,
        password: await bcrypt.hash('planner123', 10),
        role: 'wedding_planner',
        profile: {
          firstName: `Planner`,
          lastName: `${i}`,
          phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
          bio: `Professional wedding planner with ${Math.floor(Math.random() * 10) + 5} years of experience`,
          location: {
            city: getRandomCity(),
            province: getRandomProvince(),
            address: `${i} Planner Avenue`
          },
          budget: generateRandomPrice(100000, 2000000),
          guestCount: Math.floor(Math.random() * 200) + 50
        },
        isVerified: true,
        isActive: true
      });
      await planner.save();
      planners.push(planner);
    }
    console.log(`✅ Created ${planners.length} wedding planners`);
    
    // Create Vendor Users and Vendors
    console.log('🏢 Creating vendors...');
    const vendors = [];
    const vendorUsers = [];
    
    for (let i = 1; i <= 50; i++) {
      const category = getRandomCategory();
      const city = getRandomCity();
      const province = getRandomProvince();
      
      // Create vendor user
      const vendorUser = new User({
        name: `Vendor Owner ${i}`,
        email: `vendor${i}@weddinglk.com`,
        password: await bcrypt.hash('vendor123', 10),
        role: 'vendor',
        profile: {
          firstName: `Vendor`,
          lastName: `Owner ${i}`,
          phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
          bio: `Professional ${category} service provider`,
          location: {
            city: city,
            province: province,
            address: `${i} Main Street`
          }
        },
        isVerified: Math.random() > 0.3,
        isActive: true
      });
      await vendorUser.save();
      vendorUsers.push(vendorUser);
      
      // Create vendor profile
      const vendor = new Vendor({
        name: `Vendor Owner ${i}`,
        businessName: `${faker.company.name()} ${i}`,
        email: `vendor${i}@weddinglk.com`,
        category: category,
        description: `Professional ${category} services for your special day. We provide high-quality services to make your wedding memorable.`,
        location: {
          address: `${i} Main Street`,
          city: city,
          province: province,
          coordinates: {
            lat: 6.9 + Math.random() * 0.1,
            lng: 79.8 + Math.random() * 0.2
          }
        },
        contact: {
          phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
          email: `vendor${i}@weddinglk.com`,
          website: `https://vendor${i}.com`
        },
        services: [{
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Service`,
          description: `Professional ${category} service`,
          price: generateRandomPrice(50000, 200000),
          duration: 'Full day'
        }],
        pricing: {
          startingPrice: generateRandomPrice(100000, 300000),
          currency: 'LKR',
          packages: [
            {
              name: 'Basic Package',
              description: 'Essential services',
              price: generateRandomPrice(100000, 200000),
              includes: ['Basic service', 'Standard equipment', 'Basic support']
            },
            {
              name: 'Premium Package',
              description: 'Complete services',
              price: generateRandomPrice(200000, 400000),
              includes: ['Premium service', 'Professional equipment', 'Full support', 'Extra features']
            }
          ]
        },
        rating: {
          average: generateRandomRating(),
          count: Math.floor(Math.random() * 50) + 10
        },
        portfolio: [
          `https://example.com/portfolio${i}_1.jpg`,
          `https://example.com/portfolio${i}_2.jpg`,
          `https://example.com/portfolio${i}_3.jpg`
        ],
        isVerified: Math.random() > 0.3,
        isActive: true,
        featured: Math.random() > 0.8,
        owner: vendorUser._id
      });
      await vendor.save();
      vendors.push(vendor);
    }
    console.log(`✅ Created ${vendors.length} vendors`);
    
    // Create Venues
    console.log('🏛️ Creating venues...');
    const venues = [];
    for (let i = 1; i <= 30; i++) {
      const city = getRandomCity();
      const province = getRandomProvince();
      
      const venue = new Venue({
        name: `${faker.company.name()} ${i}`,
        description: `Beautiful wedding venue perfect for your special day. Features elegant decor, spacious layout, and professional service.`,
        location: {
          address: `${i} Wedding Street`,
          city: city,
          province: province,
          coordinates: {
            lat: 6.9 + Math.random() * 0.1,
            lng: 79.8 + Math.random() * 0.2
          }
        },
        capacity: {
          min: Math.floor(Math.random() * 50) + 50,
          max: Math.floor(Math.random() * 200) + 100
        },
        amenities: ['Parking', 'Air Conditioning', 'Sound System', 'Lighting', 'Catering Kitchen', 'Bridal Suite'],
        pricing: {
          startingPrice: generateRandomPrice(100000, 500000),
          currency: 'LKR'
        },
        rating: {
          average: generateRandomRating(),
          count: Math.floor(Math.random() * 30) + 5
        },
        images: [
          `https://example.com/venue${i}_1.jpg`,
          `https://example.com/venue${i}_2.jpg`,
          `https://example.com/venue${i}_3.jpg`
        ],
        isVerified: Math.random() > 0.2,
        isActive: true,
        featured: Math.random() > 0.7,
        owner: vendorUsers[Math.floor(Math.random() * vendorUsers.length)]._id
      });
      await venue.save();
      venues.push(venue);
    }
    console.log(`✅ Created ${venues.length} venues`);
    
    // Create Regular Users
    console.log('👥 Creating regular users...');
    const users = [];
    for (let i = 1; i <= 100; i++) {
      const user = new User({
        name: `User ${i}`,
        email: `user${i}@weddinglk.com`,
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        profile: {
          firstName: `User`,
          lastName: `${i}`,
          phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
          bio: `Wedding planning enthusiast`,
          location: {
            city: getRandomCity(),
            province: getRandomProvince(),
            address: `${i} User Street`
          },
          weddingDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
          budget: generateRandomPrice(500000, 3000000),
          guestCount: Math.floor(Math.random() * 200) + 50
        },
        isVerified: Math.random() > 0.4,
        isActive: true
      });
      await user.save();
      users.push(user);
    }
    console.log(`✅ Created ${users.length} regular users`);
    
    // Create Bookings
    console.log('📅 Creating bookings...');
    const bookings = [];
    for (let i = 1; i <= 200; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const venue = Math.random() > 0.5 ? venues[Math.floor(Math.random() * venues.length)] : null;
      const planner = Math.random() > 0.7 ? planners[Math.floor(Math.random() * planners.length)] : null;
      
      const booking = new Booking({
        user: user._id,
        vendor: vendor._id,
        venue: venue ? venue._id : null,
        planner: planner ? planner._id : null,
        service: {
          name: vendor.services[0].name,
          description: vendor.services[0].description,
          price: vendor.services[0].price
        },
        eventDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        eventTime: `${Math.floor(Math.random() * 12) + 8}:00`,
        duration: Math.floor(Math.random() * 8) + 4,
        guestCount: Math.floor(Math.random() * 200) + 50,
        status: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
        payment: {
          amount: vendor.services[0].price,
          currency: 'LKR',
          status: ['pending', 'paid', 'refunded'][Math.floor(Math.random() * 3)],
          method: ['card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 3)],
          transactionId: `TXN${Math.floor(Math.random() * 1000000)}`
        },
        notes: `Booking notes for ${vendor.businessName}`
      });
      await booking.save();
      bookings.push(booking);
    }
    console.log(`✅ Created ${bookings.length} bookings`);
    
    // Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = [];
    for (let i = 1; i <= 300; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const booking = bookings[Math.floor(Math.random() * bookings.length)];
      
      const overallRating = Math.floor(Math.random() * 5) + 1;
      const review = new Review({
        userId: user._id,
        vendorId: vendor._id,
        bookingId: booking._id,
        overallRating: overallRating,
        categoryRatings: {
          service: overallRating,
          quality: overallRating,
          value: overallRating,
          communication: overallRating,
          timeliness: overallRating
        },
        title: `Great ${vendor.category} service!`,
        comment: `Excellent service from ${vendor.businessName}. Highly recommended for your wedding!`,
        pros: ['Professional', 'Punctual', 'Great quality'],
        cons: ['Could be cheaper'],
        images: [`https://example.com/review${i}_1.jpg`],
        isVerified: Math.random() > 0.3,
        helpful: [],
        notHelpful: [],
        reportCount: 0,
        status: 'approved'
      });
      await review.save();
      reviews.push(review);
    }
    console.log(`✅ Created ${reviews.length} reviews`);
    
    // Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = [];
    for (let i = 1; i <= 500; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const types = ['booking_confirmed', 'payment_received', 'review_posted', 'message_received', 'reminder'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const notification = new Notification({
        userId: user._id,
        type: type,
        category: ['info', 'success', 'warning', 'error', 'reminder'][Math.floor(Math.random() * 5)],
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        title: `Notification ${i}`,
        message: `This is a ${type} notification for ${user.name}`,
        shortMessage: `Short: ${type} notification`,
        actionText: 'View Details',
        actionUrl: '/dashboard',
        data: {
          bookingId: bookings[Math.floor(Math.random() * bookings.length)]._id,
          vendorId: vendors[Math.floor(Math.random() * vendors.length)]._id
        },
        channels: {
          inApp: true,
          email: Math.random() > 0.5,
          sms: Math.random() > 0.8,
          push: Math.random() > 0.7
        },
        deliveryStatus: {
          inApp: 'delivered',
          email: Math.random() > 0.5 ? 'delivered' : 'pending',
          sms: Math.random() > 0.8 ? 'delivered' : 'pending',
          push: Math.random() > 0.7 ? 'delivered' : 'pending'
        },
        read: Math.random() > 0.5,
        readAt: Math.random() > 0.5 ? new Date() : null,
        clicked: Math.random() > 0.7,
        clickedAt: Math.random() > 0.7 ? new Date() : null,
        actionTaken: Math.random() > 0.8,
        actionTakenAt: Math.random() > 0.8 ? new Date() : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      await notification.save();
      notifications.push(notification);
    }
    console.log(`✅ Created ${notifications.length} notifications`);
    
    // Create Messages
    console.log('💬 Creating messages...');
    const messages = [];
    for (let i = 1; i <= 400; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const booking = bookings[Math.floor(Math.random() * bookings.length)];
      
      const message = new Message({
        sender: Math.random() > 0.5 ? user._id : vendor.owner,
        recipient: Math.random() > 0.5 ? vendor.owner : user._id,
        booking: booking._id,
        content: `Message ${i}: ${faker.lorem.sentence()}`,
        type: 'text',
        read: Math.random() > 0.3,
        readAt: Math.random() > 0.3 ? new Date() : null
      });
      await message.save();
      messages.push(message);
    }
    console.log(`✅ Created ${messages.length} messages`);
    
    // Create Payments
    console.log('💳 Creating payments...');
    const payments = [];
    for (let i = 1; i <= 150; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const booking = bookings[Math.floor(Math.random() * bookings.length)];
      
      const payment = new Payment({
        user: user._id,
        vendor: vendor._id,
        booking: booking._id,
        amount: generateRandomPrice(50000, 500000),
        currency: 'LKR',
        status: ['pending', 'completed', 'failed', 'refunded'][Math.floor(Math.random() * 4)],
        method: ['card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 3)],
        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
        stripePaymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
        description: `Payment for ${vendor.businessName} services`
      });
      await payment.save();
      payments.push(payment);
    }
    console.log(`✅ Created ${payments.length} payments`);
    
    // Create Calendar Events
    console.log('📅 Creating calendar events...');
    const calendarEvents = [];
    for (let i = 1; i <= 300; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const booking = bookings[Math.floor(Math.random() * bookings.length)];
      
      const startDate = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + Math.random() * 8 * 60 * 60 * 1000);
      
      const event = new CalendarEvent({
        user: user._id,
        vendor: vendor._id,
        booking: booking._id,
        title: `Event ${i}`,
        description: `Calendar event for ${vendor.businessName}`,
        startDate: startDate,
        endDate: endDate,
        type: ['booking', 'meeting', 'consultation', 'event'][Math.floor(Math.random() * 4)],
        status: ['scheduled', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        location: `${vendor.location.city}, ${vendor.location.province}`,
        notes: `Notes for event ${i}`
      });
      await event.save();
      calendarEvents.push(event);
    }
    console.log(`✅ Created ${calendarEvents.length} calendar events`);
    
    // Update vendor ratings based on reviews
    console.log('📊 Updating vendor ratings...');
    for (const vendor of vendors) {
      const vendorReviews = reviews.filter(r => r.vendorId.toString() === vendor._id.toString());
      if (vendorReviews.length > 0) {
        const averageRating = vendorReviews.reduce((sum, review) => sum + review.overallRating, 0) / vendorReviews.length;
        vendor.rating.average = Math.round(averageRating * 100) / 100;
        vendor.rating.count = vendorReviews.length;
        await vendor.save();
      }
    }
    console.log('✅ Updated vendor ratings');
    
    // Update venue ratings based on reviews
    console.log('📊 Updating venue ratings...');
    for (const venue of venues) {
      const venueReviews = reviews.filter(r => r.venueId && r.venueId.toString() === venue._id.toString());
      if (venueReviews.length > 0) {
        const averageRating = venueReviews.reduce((sum, review) => sum + review.overallRating, 0) / venueReviews.length;
        venue.rating.average = Math.round(averageRating * 100) / 100;
        venue.rating.count = venueReviews.length;
        await venue.save();
      }
    }
    console.log('✅ Updated venue ratings');
    
    console.log('🎉 Comprehensive relational data seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`👑 Admin Users: ${adminUsers.length}`);
    console.log(`💍 Wedding Planners: ${planners.length}`);
    console.log(`🏢 Vendors: ${vendors.length}`);
    console.log(`🏛️ Venues: ${venues.length}`);
    console.log(`👥 Regular Users: ${users.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`💬 Messages: ${messages.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log(`📅 Calendar Events: ${calendarEvents.length}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
if (require.main === module) {
  seedComprehensiveData();
}

module.exports = { seedComprehensiveData };
