const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Sri Lankan locations and data
const sriLankanDistricts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle'
];

const sriLankanProvinces = [
  'Western Province', 'Central Province', 'Southern Province',
  'Northern Province', 'Eastern Province', 'North Western Province',
  'North Central Province', 'Uva Province', 'Sabaragamuwa Province'
];

const weddingCategories = [
  'photography', 'videography', 'catering', 'decorations', 'music',
  'transportation', 'makeup', 'bridal_wear', 'groom_wear', 'flowers',
  'cake', 'invitations', 'lighting', 'sound', 'dance', 'traditional_music'
];

const venueTypes = [
  'hotel', 'garden', 'beach', 'mountain', 'traditional', 'luxury',
  'outdoor', 'indoor', 'resort', 'villa', 'church', 'temple', 'mosque'
];

// Define schemas directly
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin'], default: 'user' },
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
  profile: {
    bio: String,
    avatar: String,
    coverImage: String,
    dateOfBirth: Date,
    gender: String,
    occupation: String,
    interests: [String]
  },
  preferences: {
    language: String,
    currency: String,
    timezone: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const vendorSchema = new mongoose.Schema({
  businessName: String,
  email: { type: String, unique: true },
  phone: String,
  category: String,
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
  services: [String],
  pricing: {
    wedding: Number,
    engagement: Number,
    hourly: Number
  },
  portfolio: [{
    image: String,
    title: String,
    description: String,
    category: String,
    featured: Boolean
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    website: String,
    youtube: String
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const venueSchema = new mongoose.Schema({
  name: String,
  type: String,
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
  capacity: {
    min: Number,
    max: Number
  },
  pricing: {
    weekday: Number,
    weekend: Number,
    peak: Number
  },
  amenities: [String],
  images: [{
    url: String,
    alt: String,
    featured: Boolean
  }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  serviceType: String,
  bookingDate: Date,
  amount: Number,
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  details: {
    eventType: String,
    guestCount: Number,
    location: String,
    specialRequests: String,
    theme: String,
    colors: [String]
  },
  payment: {
    method: String,
    status: String,
    amountPaid: Number,
    dueDate: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  overallRating: { type: Number, min: 1, max: 5 },
  categoryRatings: {
    service: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 }
  },
  title: String,
  comment: String,
  pros: [String],
  cons: [String],
  images: [{
    url: String,
    alt: String
  }],
  isVerified: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'flagged'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);

// Generate realistic Sri Lankan data
function generateSriLankanUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const phone = `+94${faker.string.numeric(9)}`;
  const district = faker.helpers.arrayElement(sriLankanDistricts);
  const province = sriLankanProvinces[Math.floor(Math.random() * sriLankanProvinces.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    email,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.5.5.2', // 'password123'
    phone,
    role: faker.helpers.weightedArrayElement([
      { weight: 60, value: 'user' },
      { weight: 25, value: 'vendor' },
      { weight: 10, value: 'wedding_planner' },
      { weight: 5, value: 'admin' }
    ]),
    location: {
      country: 'Sri Lanka',
      state: province,
      city: district,
      address: faker.location.streetAddress(),
      coordinates: {
        lat: faker.location.latitude({ min: 5.9, max: 9.8 }),
        lng: faker.location.longitude({ min: 79.6, max: 81.9 })
      }
    },
    profile: {
      bio: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.url({ width: 1200, height: 400 }),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      gender: faker.helpers.arrayElement(['male', 'female', 'other']),
      occupation: faker.person.jobTitle(),
      interests: faker.helpers.arrayElements(['photography', 'music', 'travel', 'food', 'fashion'], { min: 1, max: 3 })
    },
    preferences: {
      language: faker.helpers.arrayElement(['en', 'si', 'ta']),
      currency: 'LKR',
      timezone: 'Asia/Colombo',
      notifications: {
        email: faker.datatype.boolean(),
        sms: faker.datatype.boolean(),
        push: faker.datatype.boolean()
      }
    },
    isVerified: faker.datatype.boolean({ probability: 0.7 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    lastLoginAt: faker.date.recent({ days: 30 }),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 7 })
  };
}

function generateVendor() {
  const businessName = faker.company.name();
  const category = faker.helpers.arrayElement(weddingCategories);
  const district = faker.helpers.arrayElement(sriLankanDistricts);
  const province = sriLankanProvinces[Math.floor(Math.random() * sriLankanProvinces.length)];
  
  return {
    businessName,
    email: faker.internet.email({ firstName: businessName.split(' ')[0] }),
    phone: `+94${faker.string.numeric(9)}`,
    category,
    description: faker.lorem.paragraphs(2),
    location: {
      country: 'Sri Lanka',
      state: province,
      city: district,
      address: faker.location.streetAddress(),
      coordinates: {
        lat: faker.location.latitude({ min: 5.9, max: 9.8 }),
        lng: faker.location.longitude({ min: 79.6, max: 81.9 })
      }
    },
    services: faker.helpers.arrayElements([
      'Wedding Photography', 'Engagement Shoots', 'Pre-wedding', 'Post-wedding',
      'Wedding Catering', 'Cocktail Reception', 'Dinner Service', 'Dessert Bar',
      'Wedding Decorations', 'Floral Arrangements', 'Lighting Setup', 'Stage Design',
      'Wedding Music', 'DJ Services', 'Live Band', 'Traditional Music',
      'Wedding Transportation', 'Bridal Car', 'Guest Transport', 'Airport Pickup'
    ], { min: 2, max: 6 }),
    pricing: {
      wedding: faker.number.int({ min: 25000, max: 200000 }),
      engagement: faker.number.int({ min: 10000, max: 50000 }),
      hourly: faker.number.int({ min: 5000, max: 15000 })
    },
    portfolio: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
      image: faker.image.url({ width: 800, height: 600 }),
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      category: category,
      featured: faker.datatype.boolean({ probability: 0.3 })
    })),
    socialMedia: {
      facebook: faker.internet.url(),
      instagram: faker.internet.url(),
      website: faker.internet.url(),
      youtube: faker.internet.url()
    },
    rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 100 }),
    isVerified: faker.datatype.boolean({ probability: 0.6 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    isFeatured: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: faker.date.past({ years: 3 }),
    updatedAt: faker.date.recent({ days: 7 })
  };
}

function generateVenue() {
  const name = faker.company.name() + ' ' + faker.helpers.arrayElement(['Hotel', 'Resort', 'Garden', 'Hall', 'Villa']);
  const type = faker.helpers.arrayElement(venueTypes);
  const district = faker.helpers.arrayElement(sriLankanDistricts);
  const province = sriLankanProvinces[Math.floor(Math.random() * sriLankanProvinces.length)];
  
  return {
    name,
    type,
    description: faker.lorem.paragraphs(3),
    location: {
      country: 'Sri Lanka',
      state: province,
      city: district,
      address: faker.location.streetAddress(),
      coordinates: {
        lat: faker.location.latitude({ min: 5.9, max: 9.8 }),
        lng: faker.location.longitude({ min: 79.6, max: 81.9 })
      }
    },
    capacity: {
      min: faker.number.int({ min: 50, max: 200 }),
      max: faker.number.int({ min: 200, max: 1000 })
    },
    pricing: {
      weekday: faker.number.int({ min: 50000, max: 300000 }),
      weekend: faker.number.int({ min: 75000, max: 400000 }),
      peak: faker.number.int({ min: 100000, max: 500000 })
    },
    amenities: faker.helpers.arrayElements([
      'Air Conditioning', 'Parking', 'Garden', 'Swimming Pool', 'Spa',
      'Restaurant', 'Bar', 'Dance Floor', 'Stage', 'Sound System',
      'Lighting', 'Bridal Suite', 'Groom Suite', 'Photography Spots',
      'Traditional Architecture', 'Modern Design', 'Beach Access', 'Mountain View'
    ], { min: 5, max: 12 }),
    images: Array.from({ length: faker.number.int({ min: 8, max: 20 }) }, () => ({
      url: faker.image.url({ width: 1200, height: 800 }),
      alt: faker.lorem.sentence(),
      featured: faker.datatype.boolean({ probability: 0.2 })
    })),
    rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 80 }),
    isVerified: faker.datatype.boolean({ probability: 0.7 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    isFeatured: faker.datatype.boolean({ probability: 0.3 }),
    createdAt: faker.date.past({ years: 4 }),
    updatedAt: faker.date.recent({ days: 7 })
  };
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({})
    ]);
    
    console.log('✅ Database cleared');
    
    // Generate users (500 users)
    console.log('👥 Creating 500 users...');
    const users = [];
    for (let i = 0; i < 500; i++) {
      users.push(generateSriLankanUser());
    }
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Generate vendors (100 vendors)
    console.log('🏢 Creating 100 vendors...');
    const vendors = [];
    for (let i = 0; i < 100; i++) {
      vendors.push(generateVendor());
    }
    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);
    
    // Generate venues (75 venues)
    console.log('🏛️ Creating 75 venues...');
    const venues = [];
    for (let i = 0; i < 75; i++) {
      venues.push(generateVenue());
    }
    const createdVenues = await Venue.insertMany(venues);
    console.log(`✅ Created ${createdVenues.length} venues`);
    
    // Generate bookings (400 bookings)
    console.log('📅 Creating 400 bookings...');
    const bookings = [];
    for (let i = 0; i < 400; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const vendorId = faker.helpers.arrayElement(createdVendors)._id;
      const venueId = faker.helpers.arrayElement(createdVenues)._id;
      
      bookings.push({
        userId,
        vendorId,
        venueId,
        serviceType: faker.helpers.arrayElement([
          'Wedding Photography', 'Wedding Catering', 'Wedding Decorations',
          'Wedding Music', 'Wedding Transportation', 'Makeup Services',
          'Bridal Wear', 'Groom Wear', 'Wedding Cake', 'Flower Arrangements'
        ]),
        bookingDate: faker.date.future({ years: 1 }),
        amount: faker.number.int({ min: 25000, max: 200000 }),
        currency: 'LKR',
        status: faker.helpers.weightedArrayElement([
          { weight: 40, value: 'confirmed' },
          { weight: 30, value: 'pending' },
          { weight: 20, value: 'completed' },
          { weight: 10, value: 'cancelled' }
        ]),
        details: {
          eventType: faker.helpers.arrayElement(['Wedding', 'Engagement', 'Reception', 'Anniversary']),
          guestCount: faker.number.int({ min: 50, max: 500 }),
          location: faker.location.city(),
          specialRequests: faker.lorem.sentence(),
          theme: faker.helpers.arrayElement(['Traditional', 'Modern', 'Rustic', 'Luxury', 'Beach', 'Garden']),
          colors: faker.helpers.arrayElements(['Gold', 'Silver', 'White', 'Pink', 'Blue', 'Purple'], { min: 1, max: 3 })
        },
        payment: {
          method: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'cash', 'cheque']),
          status: faker.helpers.arrayElement(['pending', 'partial', 'completed', 'refunded']),
          amountPaid: faker.number.int({ min: 0, max: 200000 }),
          dueDate: faker.date.future({ days: 30 })
        },
        createdAt: faker.date.past({ days: 60 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);
    
    // Generate reviews (300 reviews)
    console.log('⭐ Creating 300 reviews...');
    const reviews = [];
    for (let i = 0; i < 300; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const vendorId = faker.helpers.arrayElement(createdVendors)._id;
      const bookingId = faker.helpers.arrayElement(createdBookings)._id;
      const overallRating = faker.number.int({ min: 1, max: 5 });
      
      reviews.push({
        userId,
        vendorId,
        bookingId,
        overallRating,
        categoryRatings: {
          service: faker.number.int({ min: 1, max: 5 }),
          quality: faker.number.int({ min: 1, max: 5 }),
          value: faker.number.int({ min: 1, max: 5 }),
          communication: faker.number.int({ min: 1, max: 5 }),
          timeliness: faker.number.int({ min: 1, max: 5 })
        },
        title: faker.lorem.sentence(),
        comment: faker.lorem.paragraphs(2),
        pros: faker.helpers.arrayElements([
          'Professional service', 'Great communication', 'Excellent quality',
          'Good value for money', 'Punctual', 'Creative', 'Flexible',
          'Well organized', 'Friendly staff', 'Clean and tidy'
        ], { min: 1, max: 4 }),
        cons: faker.helpers.arrayElements([
          'Could be more punctual', 'Limited availability', 'Higher price',
          'Communication could be better', 'Limited options', 'Rigid policies'
        ], { min: 0, max: 2 }),
        images: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
          url: faker.image.url({ width: 800, height: 600 }),
          alt: faker.lorem.sentence()
        })),
        isVerified: faker.datatype.boolean({ probability: 0.8 }),
        isAnonymous: faker.datatype.boolean({ probability: 0.2 }),
        helpful: faker.number.int({ min: 0, max: 20 }),
        notHelpful: faker.number.int({ min: 0, max: 5 }),
        status: faker.helpers.weightedArrayElement([
          { weight: 80, value: 'approved' },
          { weight: 15, value: 'pending' },
          { weight: 5, value: 'flagged' }
        ]),
        createdAt: faker.date.past({ days: 90 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏢 Vendors: ${createdVendors.length}`);
    console.log(`   🏛️ Venues: ${createdVenues.length}`);
    console.log(`   📅 Bookings: ${createdBookings.length}`);
    console.log(`   ⭐ Reviews: ${createdReviews.length}`);
    console.log('\n🚀 Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

// Run the seeder
async function main() {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedDatabase, connectDB };

