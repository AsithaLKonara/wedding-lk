const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Import all models
const User = require('../lib/models/user');
const Vendor = require('../lib/models/vendor');
const Venue = require('../lib/models/venue');
const Booking = require('../lib/models/booking');
const Review = require('../lib/models/review');
const Favorite = require('../lib/models/favorite');
const Referral = require('../lib/models/referral');
const GuestList = require('../lib/models/guestList');
const Notification = require('../lib/models/notification');
const Dispute = require('../lib/models/dispute');
const EscrowPayment = require('../lib/models/escrowPayment');
const VendorSubscription = require('../lib/models/vendorSubscription');
const Analytics = require('../lib/models/analytics');

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
    availability: {
      monday: { start: '09:00', end: '18:00', available: true },
      tuesday: { start: '09:00', end: '18:00', available: true },
      wednesday: { start: '09:00', end: '18:00', available: true },
      thursday: { start: '09:00', end: '18:00', available: true },
      friday: { start: '09:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '20:00', available: true },
      sunday: { start: '10:00', end: '20:00', available: true }
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
    availability: {
      monday: { start: '09:00', end: '23:00', available: true },
      tuesday: { start: '09:00', end: '23:00', available: true },
      wednesday: { start: '09:00', end: '23:00', available: true },
      thursday: { start: '09:00', end: '23:00', available: true },
      friday: { start: '09:00', end: '23:00', available: true },
      saturday: { start: '09:00', end: '23:00', available: true },
      sunday: { start: '09:00', end: '23:00', available: true }
    },
    rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 80 }),
    isVerified: faker.datatype.boolean({ probability: 0.7 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    isFeatured: faker.datatype.boolean({ probability: 0.3 }),
    createdAt: faker.date.past({ years: 4 }),
    updatedAt: faker.date.recent({ days: 7 })
  };
}

function generateBooking(userId, vendorId, venueId) {
  const eventDate = faker.date.future({ years: 1 });
  const serviceType = faker.helpers.arrayElement([
    'Wedding Photography', 'Wedding Catering', 'Wedding Decorations',
    'Wedding Music', 'Wedding Transportation', 'Makeup Services',
    'Bridal Wear', 'Groom Wear', 'Wedding Cake', 'Flower Arrangements'
  ]);
  
  return {
    userId,
    vendorId,
    venueId,
    serviceType,
    bookingDate: eventDate,
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
    timeline: {
      consultation: faker.date.past({ days: 30 }),
      planning: faker.date.future({ days: 30 }),
      rehearsal: faker.date.future({ days: 1 }),
      event: eventDate,
      followUp: faker.date.future({ days: 7 })
    },
    payment: {
      method: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'cash', 'cheque']),
      status: faker.helpers.arrayElement(['pending', 'partial', 'completed', 'refunded']),
      amountPaid: faker.number.int({ min: 0, max: 200000 }),
      dueDate: faker.date.future({ days: 30 })
    },
    createdAt: faker.date.past({ days: 60 }),
    updatedAt: faker.date.recent({ days: 7 })
  };
}

function generateReview(userId, vendorId, bookingId) {
  const overallRating = faker.number.int({ min: 1, max: 5 });
  
  return {
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
      Review.deleteMany({}),
      Favorite.deleteMany({}),
      Referral.deleteMany({}),
      GuestList.deleteMany({}),
      Notification.deleteMany({}),
      Dispute.deleteMany({}),
      EscrowPayment.deleteMany({}),
      VendorSubscription.deleteMany({}),
      Analytics.deleteMany({})
    ]);
    
    console.log('✅ Database cleared');
    
    // Generate users (1000 users)
    console.log('👥 Creating 1000 users...');
    const users = [];
    for (let i = 0; i < 1000; i++) {
      users.push(generateSriLankanUser());
    }
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Generate vendors (200 vendors)
    console.log('🏢 Creating 200 vendors...');
    const vendors = [];
    for (let i = 0; i < 200; i++) {
      vendors.push(generateVendor());
    }
    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);
    
    // Generate venues (150 venues)
    console.log('🏛️ Creating 150 venues...');
    const venues = [];
    for (let i = 0; i < 150; i++) {
      venues.push(generateVenue());
    }
    const createdVenues = await Venue.insertMany(venues);
    console.log(`✅ Created ${createdVenues.length} venues`);
    
    // Generate bookings (800 bookings)
    console.log('📅 Creating 800 bookings...');
    const bookings = [];
    for (let i = 0; i < 800; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const vendorId = faker.helpers.arrayElement(createdVendors)._id;
      const venueId = faker.helpers.arrayElement(createdVenues)._id;
      bookings.push(generateBooking(userId, vendorId, venueId));
    }
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);
    
    // Generate reviews (600 reviews)
    console.log('⭐ Creating 600 reviews...');
    const reviews = [];
    for (let i = 0; i < 600; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const vendorId = faker.helpers.arrayElement(createdVendors)._id;
      const bookingId = faker.helpers.arrayElement(createdBookings)._id;
      reviews.push(generateReview(userId, vendorId, bookingId));
    }
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);
    
    // Generate favorites (500 favorites)
    console.log('❤️ Creating 500 favorites...');
    const favorites = [];
    for (let i = 0; i < 500; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const itemId = faker.helpers.arrayElement([...createdVendors, ...createdVenues])._id;
      const itemType = faker.helpers.arrayElement(['vendor', 'venue']);
      
      favorites.push({
        userId,
        itemId,
        itemType,
        category: faker.helpers.arrayElement(weddingCategories),
        notes: faker.lorem.sentence(),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        tags: faker.helpers.arrayElements(['favorite', 'considering', 'booked'], { min: 1, max: 2 }),
        isForComparison: faker.datatype.boolean({ probability: 0.3 }),
        comparisonGroup: faker.helpers.arrayElement(['photography', 'catering', 'venue', 'music']),
        createdAt: faker.date.past({ days: 60 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdFavorites = await Favorite.insertMany(favorites);
    console.log(`✅ Created ${createdFavorites.length} favorites`);
    
    // Generate referrals (200 referrals)
    console.log('🎁 Creating 200 referrals...');
    const referrals = [];
    for (let i = 0; i < 200; i++) {
      const referrerId = faker.helpers.arrayElement(createdUsers)._id;
      const referredId = faker.helpers.arrayElement(createdUsers)._id;
      
      referrals.push({
        referrerId,
        referredId,
        code: faker.string.alphanumeric(8).toUpperCase(),
        rewardType: faker.helpers.arrayElement(['discount', 'credit', 'cash']),
        rewardValue: faker.number.int({ min: 1000, max: 10000 }),
        status: faker.helpers.arrayElement(['pending', 'completed', 'expired']),
        expiresAt: faker.date.future({ days: 30 }),
        createdAt: faker.date.past({ days: 30 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdReferrals = await Referral.insertMany(referrals);
    console.log(`✅ Created ${createdReferrals.length} referrals`);
    
    // Generate guest lists (100 guest lists)
    console.log('👥 Creating 100 guest lists...');
    const guestLists = [];
    for (let i = 0; i < 100; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const eventId = faker.helpers.arrayElement(createdBookings)._id;
      
      guestLists.push({
        userId,
        eventId,
        eventName: faker.lorem.words(3),
        eventDate: faker.date.future({ years: 1 }),
        guests: Array.from({ length: faker.number.int({ min: 20, max: 200 }) }, () => ({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: `+94${faker.string.numeric(9)}`,
          relationship: faker.helpers.arrayElement(['family', 'friend', 'colleague', 'relative']),
          rsvp: faker.helpers.arrayElement(['pending', 'attending', 'not_attending']),
          dietaryNeeds: faker.helpers.arrayElement(['none', 'vegetarian', 'vegan', 'halal', 'gluten_free']),
          plusOne: faker.datatype.boolean({ probability: 0.3 }),
          tableNumber: faker.number.int({ min: 1, max: 20 }),
          giftReceived: faker.datatype.boolean({ probability: 0.4 }),
          notes: faker.lorem.sentence()
        })),
        totalGuests: faker.number.int({ min: 50, max: 300 }),
        confirmedGuests: faker.number.int({ min: 30, max: 250 }),
        createdAt: faker.date.past({ days: 90 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdGuestLists = await GuestList.insertMany(guestLists);
    console.log(`✅ Created ${createdGuestLists.length} guest lists`);
    
    // Generate notifications (1000 notifications)
    console.log('🔔 Creating 1000 notifications...');
    const notifications = [];
    for (let i = 0; i < 1000; i++) {
      const userId = faker.helpers.arrayElement(createdUsers)._id;
      const type = faker.helpers.arrayElement(['booking', 'payment', 'review', 'message', 'reminder', 'promotion']);
      
      notifications.push({
        userId,
        type,
        category: faker.helpers.arrayElement(['urgent', 'important', 'normal', 'low']),
        priority: faker.helpers.arrayElement(['high', 'medium', 'low']),
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        shortMessage: faker.lorem.sentence(),
        actionText: faker.helpers.arrayElement(['View', 'Book Now', 'Reply', 'Confirm', 'Cancel']),
        actionUrl: faker.internet.url(),
        data: {
          bookingId: faker.helpers.arrayElement(createdBookings)._id,
          vendorId: faker.helpers.arrayElement(createdVendors)._id,
          amount: faker.number.int({ min: 1000, max: 100000 })
        },
        channels: {
          inApp: faker.datatype.boolean({ probability: 0.9 }),
          email: faker.datatype.boolean({ probability: 0.7 }),
          sms: faker.datatype.boolean({ probability: 0.3 }),
          push: faker.datatype.boolean({ probability: 0.5 })
        },
        deliveryStatus: faker.helpers.arrayElement(['pending', 'sent', 'delivered', 'failed']),
        read: faker.datatype.boolean({ probability: 0.6 }),
        clicked: faker.datatype.boolean({ probability: 0.3 }),
        scheduledFor: faker.date.future({ days: 7 }),
        expiresAt: faker.date.future({ days: 30 }),
        createdAt: faker.date.past({ days: 30 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);
    
    // Generate disputes (50 disputes)
    console.log('⚖️ Creating 50 disputes...');
    const disputes = [];
    for (let i = 0; i < 50; i++) {
      const complainantId = faker.helpers.arrayElement(createdUsers)._id;
      const respondentId = faker.helpers.arrayElement(createdUsers)._id;
      const bookingId = faker.helpers.arrayElement(createdBookings)._id;
      
      disputes.push({
        disputeId: `DIS-${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}`,
        type: faker.helpers.arrayElement(['booking', 'payment', 'service', 'vendor', 'refund']),
        status: faker.helpers.arrayElement(['open', 'in_progress', 'resolved', 'closed']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
        complainantId,
        respondentId,
        bookingId,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        category: faker.helpers.arrayElement(['quality', 'delivery', 'communication', 'billing', 'cancellation']),
        requestedResolution: faker.helpers.arrayElement(['refund', 'partial_refund', 'reschedule', 'replacement', 'apology']),
        requestedAmount: faker.number.int({ min: 5000, max: 100000 }),
        currency: 'LKR',
        evidence: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
          type: faker.helpers.arrayElement(['image', 'document', 'video', 'receipt']),
          url: faker.image.url(),
          description: faker.lorem.sentence(),
          uploadedBy: complainantId,
          uploadedAt: faker.date.past({ days: 7 }),
          isVerified: faker.datatype.boolean({ probability: 0.3 })
        })),
        resolutionDeadline: faker.date.future({ days: 7 }),
        lastActivityAt: faker.date.recent({ days: 3 }),
        isOverdue: faker.datatype.boolean({ probability: 0.2 }),
        createdAt: faker.date.past({ days: 30 }),
        updatedAt: faker.date.recent({ days: 3 })
      });
    }
    const createdDisputes = await Dispute.insertMany(disputes);
    console.log(`✅ Created ${createdDisputes.length} disputes`);
    
    // Generate vendor subscriptions (150 subscriptions)
    console.log('💳 Creating 150 vendor subscriptions...');
    const subscriptions = [];
    for (let i = 0; i < 150; i++) {
      const vendorId = faker.helpers.arrayElement(createdVendors)._id;
      const planType = faker.helpers.arrayElement(['free', 'standard', 'premium', 'enterprise']);
      
      subscriptions.push({
        vendorId,
        planId: faker.database.mongodbObjectId(),
        subscriptionId: `sub_${Date.now()}_${faker.string.alphanumeric(6)}`,
        planName: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
        planType,
        status: faker.helpers.arrayElement(['active', 'inactive', 'cancelled', 'past_due']),
        billingCycle: faker.helpers.arrayElement(['monthly', 'yearly']),
        price: faker.number.int({ min: 0, max: 50000 }),
        currency: 'LKR',
        stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
        stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
        stripePriceId: `price_${faker.string.alphanumeric(14)}`,
        currentPeriodStart: faker.date.past({ days: 30 }),
        currentPeriodEnd: faker.date.future({ days: 30 }),
        features: {
          maxImages: faker.number.int({ min: 10, max: 100 }),
          maxVideos: faker.number.int({ min: 3, max: 20 }),
          maxListings: faker.number.int({ min: 5, max: 50 }),
          featuredListings: faker.number.int({ min: 0, max: 10 }),
          boostCredits: faker.number.int({ min: 0, max: 100 }),
          basicAnalytics: faker.datatype.boolean({ probability: 0.9 }),
          advancedAnalytics: faker.datatype.boolean({ probability: 0.5 }),
          prioritySupport: faker.datatype.boolean({ probability: 0.3 })
        },
        usage: {
          imagesUsed: faker.number.int({ min: 0, max: 50 }),
          videosUsed: faker.number.int({ min: 0, max: 10 }),
          listingsCreated: faker.number.int({ min: 0, max: 20 }),
          featuredListingsUsed: faker.number.int({ min: 0, max: 5 }),
          boostCreditsUsed: faker.number.int({ min: 0, max: 50 }),
          lastResetDate: faker.date.past({ days: 30 })
        },
        createdAt: faker.date.past({ days: 90 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdSubscriptions = await VendorSubscription.insertMany(subscriptions);
    console.log(`✅ Created ${createdSubscriptions.length} vendor subscriptions`);
    
    // Generate analytics data (500 analytics records)
    console.log('📊 Creating 500 analytics records...');
    const analytics = [];
    for (let i = 0; i < 500; i++) {
      const entityId = faker.helpers.arrayElement([...createdUsers, ...createdVendors])._id;
      const entityType = faker.helpers.arrayElement(['user', 'vendor', 'platform']);
      const period = faker.helpers.arrayElement(['daily', 'weekly', 'monthly']);
      
      analytics.push({
        entityId,
        entityType,
        date: faker.date.past({ days: 30 }),
        period,
        userMetrics: entityType === 'user' ? {
          profileViews: faker.number.int({ min: 0, max: 100 }),
          bookingsMade: faker.number.int({ min: 0, max: 10 }),
          reviewsWritten: faker.number.int({ min: 0, max: 20 }),
          favoritesAdded: faker.number.int({ min: 0, max: 50 }),
          messagesSent: faker.number.int({ min: 0, max: 100 }),
          timeSpent: faker.number.int({ min: 0, max: 300 }),
          pagesVisited: faker.number.int({ min: 0, max: 200 }),
          searchQueries: faker.number.int({ min: 0, max: 50 })
        } : undefined,
        vendorMetrics: entityType === 'vendor' ? {
          profileViews: faker.number.int({ min: 0, max: 500 }),
          listingViews: faker.number.int({ min: 0, max: 1000 }),
          contactClicks: faker.number.int({ min: 0, max: 100 }),
          bookingsReceived: faker.number.int({ min: 0, max: 50 }),
          revenue: faker.number.int({ min: 0, max: 1000000 }),
          averageRating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
          reviewCount: faker.number.int({ min: 0, max: 100 }),
          responseTime: faker.number.int({ min: 5, max: 120 }),
          conversionRate: faker.number.float({ min: 0, max: 100, fractionDigits: 1 })
        } : undefined,
        platformMetrics: entityType === 'platform' ? {
          totalUsers: faker.number.int({ min: 500, max: 2000 }),
          totalVendors: faker.number.int({ min: 100, max: 500 }),
          totalBookings: faker.number.int({ min: 200, max: 1000 }),
          totalRevenue: faker.number.int({ min: 1000000, max: 10000000 }),
          averageBookingValue: faker.number.int({ min: 50000, max: 200000 }),
          userGrowth: faker.number.float({ min: -10, max: 50, fractionDigits: 1 }),
          vendorGrowth: faker.number.float({ min: -5, max: 30, fractionDigits: 1 }),
          bookingGrowth: faker.number.float({ min: -20, max: 100, fractionDigits: 1 }),
          revenueGrowth: faker.number.float({ min: -15, max: 80, fractionDigits: 1 }),
          activeUsers: faker.number.int({ min: 100, max: 800 }),
          newRegistrations: faker.number.int({ min: 10, max: 100 }),
          platformCommission: faker.number.int({ min: 100000, max: 1000000 })
        } : undefined,
        createdAt: faker.date.past({ days: 30 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }
    const createdAnalytics = await Analytics.insertMany(analytics);
    console.log(`✅ Created ${createdAnalytics.length} analytics records`);
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏢 Vendors: ${createdVendors.length}`);
    console.log(`   🏛️ Venues: ${createdVenues.length}`);
    console.log(`   📅 Bookings: ${createdBookings.length}`);
    console.log(`   ⭐ Reviews: ${createdReviews.length}`);
    console.log(`   ❤️ Favorites: ${createdFavorites.length}`);
    console.log(`   🎁 Referrals: ${createdReferrals.length}`);
    console.log(`   👥 Guest Lists: ${createdGuestLists.length}`);
    console.log(`   🔔 Notifications: ${createdNotifications.length}`);
    console.log(`   ⚖️ Disputes: ${createdDisputes.length}`);
    console.log(`   💳 Subscriptions: ${createdSubscriptions.length}`);
    console.log(`   📊 Analytics: ${createdAnalytics.length}`);
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

