const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './env.local' });

// Import models using dynamic imports for TypeScript files
let User, Vendor, Venue, Post;

async function loadModels() {
  try {
    const userModule = await import('../lib/models/user.js');
    const vendorModule = await import('../lib/models/vendor.js');
    const venueModule = await import('../lib/models/venue.js');
    const postModule = await import('../lib/models/post.js');
    
    User = userModule.default;
    Vendor = vendorModule.default;
    Venue = venueModule.default;
    Post = postModule.default;
  } catch (error) {
    console.error('Error loading models:', error);
    // Fallback to direct mongoose schema creation
    createModelsDirectly();
  }
}

function createModelsDirectly() {
  const mongoose = require('mongoose');
  
  // User Schema - Updated to match the actual User model
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user' },
    roleVerified: { type: Boolean, default: true },
    roleVerifiedAt: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: true },
    isPhoneVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active' },
    location: {
      country: { type: String, required: true, default: 'Sri Lanka' },
      state: { type: String, required: true, default: 'Western Province' },
      city: { type: String, required: true, default: 'Colombo' },
      zipCode: { type: String },
      coordinates: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 }
      }
    },
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
    },
    socialAccounts: [{
      provider: { type: String, enum: ['google', 'facebook', 'instagram', 'linkedin'] },
      providerId: { type: String },
      accessToken: { type: String },
      refreshToken: { type: String },
      expiresAt: { type: Date },
      scope: { type: String },
      idToken: { type: String },
      linkedAt: { type: Date, default: Date.now },
      lastUsed: { type: Date }
    }],
    verificationDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastActiveAt: { type: Date, default: Date.now }
  }, { timestamps: true });

  // Vendor Schema
  const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    category: { type: String, enum: ["photographer", "decorator", "catering", "music", "transport", "makeup", "jewelry", "clothing"], required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      serviceAreas: [{ type: String }]
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String }
    },
    services: [{
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number },
      duration: { type: String }
    }],
    pricing: {
      startingPrice: { type: Number, required: true },
      currency: { type: String, default: "LKR" }
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });

  // Venue Schema
  const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      }
    },
    capacity: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    amenities: [{ type: String }],
    pricing: {
      startingPrice: { type: Number, required: true },
      currency: { type: String, default: "LKR" }
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });

  // Post Schema
  const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    author: {
      type: { type: String, enum: ['user', 'vendor', 'venue'], required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      avatar: { type: String },
      verified: { type: Boolean, default: false }
    },
    location: {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String }
    },
    engagement: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 }
    },
    userInteractions: {
      likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      sharedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    status: { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
  }, { timestamps: true });

  User = mongoose.models.User || mongoose.model('User', UserSchema);
  Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
  Venue = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
  Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create 3 admins
  for (let i = 1; i <= 3; i++) {
    users.push({
      name: `Admin ${i}`,
      email: `admin${i}@wedding.lk`,
      password: hashedPassword,
      role: 'admin',
      roleVerified: true,
      roleVerifiedAt: new Date(),
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: false,
          sms: false,
          push: false
        }
      },
      isEmailVerified: true,
      isPhoneVerified: false,
      isIdentityVerified: true,
      isActive: true,
      isVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    });
  }
  
  // Create 47 regular users
  for (let i = 1; i <= 47; i++) {
    const states = ['Western Province', 'Central Province', 'Southern Province', 'Northern Province'];
    const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna'];
    
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      role: 'user',
      roleVerified: true,
      roleVerifiedAt: new Date(),
      location: {
        country: 'Sri Lanka',
        state: states[i % 4],
        city: cities[i % 4]
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: false,
          sms: false,
          push: false
        }
      },
      isEmailVerified: true,
      isPhoneVerified: false,
      isIdentityVerified: false,
      isActive: true,
      isVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    });
  }
  
  await User.insertMany(users);
  console.log(`✅ Created ${users.length} users`);
}

async function seedVendors() {
  console.log('🌱 Seeding vendors...');
  
  // Get some users to be vendor owners
  const users = await User.find({ role: 'user' }).limit(50);
  
  const vendors = [];
  const categories = ['photographer', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing', 'decorator'];
  const businessNames = [
    'Perfect Moments Photography', 'Royal Catering Services', 'Harmony Music Band', 'Elegant Transport',
    'Glamour Makeup Studio', 'Diamond Jewelry House', 'Bridal Boutique', 'Floral Decorations',
    'Dream Wedding Photography', 'Gourmet Catering', 'Melody Band', 'Luxury Cars',
    'Beauty Studio', 'Gold & Silver Jewelry', 'Wedding Dresses', 'Garden Decorations'
  ];
  
  for (let i = 1; i <= 50; i++) {
    const category = categories[i % categories.length];
    const businessName = businessNames[i % businessNames.length] + ` ${i}`;
    
    vendors.push({
      name: `Vendor Owner ${i}`,
      businessName: businessName,
      category: category,
      description: `Professional ${category} services for your special day. We provide high-quality services to make your wedding memorable.`,
      location: {
        address: `${i} Main Street`,
        city: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura'][i % 5],
        province: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'North Central Province'][i % 5],
        serviceAreas: ['Colombo', 'Kandy', 'Galle']
      },
      contact: {
        email: `vendor${i}@example.com`,
        phone: `+94${Math.floor(Math.random() * 900000000) + 100000000}`,
        website: `https://vendor${i}.com`
      },
      services: [
        {
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Service`,
          description: `Professional ${category} service`,
          price: Math.floor(Math.random() * 100000) + 50000,
          duration: 'Full day'
        }
      ],
      pricing: {
        startingPrice: Math.floor(Math.random() * 200000) + 100000,
        currency: 'LKR'
      },
      rating: {
        average: Math.random() * 2 + 3, // 3-5 stars
        count: Math.floor(Math.random() * 50) + 10
      },
      owner: users[i % users.length]._id,
      isVerified: Math.random() > 0.3, // 70% verified
      isActive: true
    });
  }
  
  await Vendor.insertMany(vendors);
  console.log(`✅ Created ${vendors.length} vendors`);
}

async function seedVenues() {
  console.log('🌱 Seeding venues...');
  
  // Get some users to be venue owners
  const users = await User.find({ role: 'user' }).limit(50);
  
  const venues = [];
  const venueNames = [
    'Grand Ballroom Hotel', 'Garden Paradise Resort', 'Seaside Wedding Villa', 'Royal Palace Venue',
    'Elegant Garden Hall', 'Beachfront Resort', 'Traditional Manor House', 'Modern Event Center',
    'Historic Castle Venue', 'Luxury Hotel Ballroom', 'Tropical Garden Resort', 'Coastal Wedding Venue'
  ];
  
  for (let i = 1; i <= 50; i++) {
    const venueName = venueNames[i % venueNames.length] + ` ${i}`;
    
    venues.push({
      name: venueName,
      description: `Beautiful wedding venue perfect for your special day. Features elegant decor, spacious layout, and professional service.`,
      location: {
        address: `${i} Wedding Street`,
        city: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura'][i % 5],
        province: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'North Central Province'][i % 5],
        coordinates: {
          latitude: 6.9271 + (Math.random() - 0.5) * 0.1,
          longitude: 79.8612 + (Math.random() - 0.5) * 0.1
        }
      },
      capacity: {
        min: Math.floor(Math.random() * 50) + 50,
        max: Math.floor(Math.random() * 200) + 100
      },
      amenities: ['Parking', 'Air Conditioning', 'Sound System', 'Lighting', 'Catering Kitchen', 'Bridal Suite'],
      pricing: {
        startingPrice: Math.floor(Math.random() * 200000) + 50000,
        currency: 'LKR'
      },
      rating: {
        average: Math.random() * 2 + 3, // 3-5 stars
        count: Math.floor(Math.random() * 30) + 3
      },
      owner: users[i % users.length]._id,
      isVerified: Math.random() > 0.3, // 70% verified
      isActive: true
    });
  }
  
  await Venue.insertMany(venues);
  console.log(`✅ Created ${venues.length} venues`);
}

async function seedPosts() {
  console.log('🌱 Seeding posts...');
  
  // Get some users, vendors, and venues for posts
  const users = await User.find({ role: 'user' }).limit(20);
  const vendors = await Vendor.find().limit(15);
  const venues = await Venue.find().limit(10);
  
  const posts = [];
  const postContents = [
    "Just had our dream wedding at this amazing venue! The staff was incredible and everything was perfect. Highly recommend! 💕 #WeddingDay #DreamVenue",
    "Our wedding day was absolutely magical! The venue was stunning and the service was impeccable. Thank you for making our day so special! ✨ #PerfectDay #WeddingBliss",
    "What an incredible experience! The team went above and beyond to make our wedding unforgettable. Couldn't have asked for better! 🌟 #AmazingVenue #WeddingGoals",
    "From the moment we booked until the last guest left, everything was perfect. The attention to detail was outstanding! 💖 #WeddingPerfection #DreamComeTrue",
    "Our wedding was everything we dreamed of and more! The venue was beautiful and the staff was so professional. Highly recommend! 🎉 #WeddingDay #BestDayEver",
    "Thank you for making our special day absolutely perfect! The venue was gorgeous and the service was top-notch. We're so grateful! 💐 #WeddingJoy #PerfectVenue",
    "What an amazing wedding day! The venue exceeded all our expectations and the team was fantastic. Couldn't be happier! 🌺 #WeddingMagic #DreamVenue",
    "Our wedding was absolutely beautiful! The venue was perfect and the staff was so helpful throughout the entire process. Thank you! 💕 #WeddingBliss #AmazingDay",
    "From planning to execution, everything was flawless! The venue was stunning and the service was exceptional. Highly recommend! ✨ #WeddingPerfection #BestVenue",
    "Our wedding day was magical! The venue was gorgeous and the team made everything so easy for us. Thank you for the perfect day! 🌟 #WeddingDreams #PerfectDay"
  ];
  
  // Create posts from users
  for (let i = 0; i < Math.min(users.length, 20); i++) {
    const user = users[i];
    const venue = venues[i % venues.length];
    
    posts.push({
      content: postContents[i % postContents.length],
      images: ["/placeholder.svg?height=300&width=400"],
      tags: ["#WeddingDay", "#DreamVenue", "#PerfectDay", "#WeddingBliss"],
      author: {
        type: 'user',
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        verified: user.isVerified,
      },
      location: venue ? {
        name: venue.name,
        address: venue.location.address,
        city: venue.location.city,
        state: venue.location.state,
        country: venue.location.country,
      } : undefined,
      engagement: {
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 20) + 2,
        shares: Math.floor(Math.random() * 10) + 1,
        views: Math.floor(Math.random() * 200) + 50,
      },
      userInteractions: {
        likedBy: [],
        bookmarkedBy: [],
        sharedBy: [],
      },
      status: 'active',
      isActive: true,
      isVerified: false,
    });
  }
  
  // Create posts from vendors
  for (let i = 0; i < Math.min(vendors.length, 15); i++) {
    const vendor = vendors[i];
    const venue = venues[i % venues.length];
    
    posts.push({
      content: `Excited to share our latest wedding project! We had the pleasure of working with this amazing couple at ${venue?.name || 'a beautiful venue'}. The day was absolutely perfect! 🎉 #WeddingPhotography #WeddingDay #PerfectMoments`,
      images: ["/placeholder.svg?height=300&width=400"],
      tags: ["#WeddingPhotography", "#WeddingDay", "#PerfectMoments", "#WeddingVendor"],
      author: {
        type: 'vendor',
        id: vendor._id,
        name: vendor.businessName,
        avatar: vendor.avatar,
        verified: vendor.isVerified,
      },
      location: venue ? {
        name: venue.name,
        address: venue.location.address,
        city: venue.location.city,
        state: venue.location.state,
        country: venue.location.country,
      } : undefined,
      engagement: {
        likes: Math.floor(Math.random() * 150) + 20,
        comments: Math.floor(Math.random() * 30) + 5,
        shares: Math.floor(Math.random() * 15) + 2,
        views: Math.floor(Math.random() * 300) + 100,
      },
      userInteractions: {
        likedBy: [],
        bookmarkedBy: [],
        sharedBy: [],
      },
      status: 'active',
      isActive: true,
      isVerified: true,
    });
  }
  
  await Post.insertMany(posts);
  console.log(`✅ Created ${posts.length} posts`);
}

async function seedBookings() {
  console.log('🌱 Seeding bookings...');
  
  const users = await User.find({ role: 'user' }).limit(20);
  const venues = await Venue.find().limit(15);
  const vendors = await Vendor.find().limit(10);
  
  const bookings = [];
  
  for (let i = 1; i <= 30; i++) {
    const user = users[i % users.length];
    const venue = venues[i % venues.length];
    const vendor = vendors[i % vendors.length];
    
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 180) + 30); // 30-210 days from now
    
    const startTime = `${Math.floor(Math.random() * 8) + 10}:00`; // 10 AM to 6 PM
    const endTime = `${Math.floor(Math.random() * 6) + 18}:00`; // 6 PM to 12 AM
    
    const guestCount = Math.floor(Math.random() * 100) + 20; // 20-120 guests
    const basePrice = Math.floor(Math.random() * 200000) + 50000; // 50k-250k LKR
    
    bookings.push({
      client: user._id,
      venue: venue._id,
      vendor: vendor._id,
      date: eventDate,
      startTime: startTime,
      endTime: endTime,
      guestCount: guestCount,
      totalAmount: basePrice,
      status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
      specialRequirements: i % 3 === 0 ? `Special requirements for booking ${i}: ${['Vegetarian menu', 'Live music', 'Photography', 'Decorations'][Math.floor(Math.random() * 4)]}` : undefined,
      paymentStatus: ['pending', 'partial', 'completed'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
    });
  }
  
  // Create Booking model
  const BookingSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guestCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    specialRequirements: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
  }, { timestamps: true });
  
  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
  await Booking.insertMany(bookings);
  console.log(`✅ Created ${bookings.length} bookings`);
}

async function seedReviews() {
  console.log('🌱 Seeding reviews...');
  
  const bookings = await mongoose.models.Booking?.find({ status: 'completed' }).limit(20);
  if (!bookings || bookings.length === 0) {
    console.log('⚠️ No completed bookings found, skipping reviews');
    return;
  }
  
  const reviews = [];
  const reviewTexts = [
    "Absolutely amazing venue! The staff was incredible and everything was perfect.",
    "Great service and beautiful location. Highly recommend for weddings!",
    "Professional team and excellent facilities. Made our day special.",
    "Outstanding venue with top-notch service. Worth every penny!",
    "Beautiful setting and wonderful staff. Couldn't have asked for better.",
    "Perfect venue for our wedding. Everything went smoothly.",
    "Excellent service and beautiful ambiance. Highly recommended!",
    "Fantastic experience from start to finish. Great value for money.",
    "Lovely venue with professional staff. Made our event memorable.",
    "Outstanding service and beautiful location. Perfect for special occasions."
  ];
  
  for (let i = 0; i < Math.min(bookings.length, 15); i++) {
    const booking = bookings[i];
    
    reviews.push({
      client: booking.client,
      venue: booking.venue,
      vendor: booking.vendor,
      booking: booking._id,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      isVerified: Math.random() > 0.2, // 80% verified
      helpful: Math.floor(Math.random() * 10),
      createdAt: new Date(booking.date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within a week after event
    });
  }
  
  // Create Review model
  const ReviewSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
  }, { timestamps: true });
  
  const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
  await Review.insertMany(reviews);
  console.log(`✅ Created ${reviews.length} reviews`);
}

async function seedData() {
  try {
    await connectDB();
    
    // Load models
    await loadModels();
    
    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Post.deleteMany({});
    await mongoose.models.Booking?.deleteMany({});
    await mongoose.models.Review?.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Seed new data
    await seedUsers();
    await seedVendors();
    await seedVenues();
    await seedPosts();
    await seedBookings();
    await seedReviews();
    
    console.log('🎉 Seed data created successfully!');
    console.log('📊 Summary:');
    console.log('   - 3 Admins');
    console.log('   - 47 Users');
    console.log('   - 50 Vendors');
    console.log('   - 50 Venues');
    console.log('   - 35 Posts');
    console.log('   - 30 Bookings');
    console.log('   - 15 Reviews');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedData();
