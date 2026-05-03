import { connectDB } from './db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  User, Vendor, Venue, Booking, Review, Service, WeddingPlannerProfile, Subscription, Post, EnhancedPost, Group, Payment, Favorite
} from './models';

// Database cleanup function
export async function clearAllCollections() {
  try {
    await connectDB();
    console.log('🧹 Starting database cleanup...');
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
      console.log(`✅ Cleared collection: ${collection.name}`);
    }
    console.log('🎉 Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}

// Combined function for reset and seed
export async function resetAndSeedDatabase() {
  await clearAllCollections();
  await createComprehensiveSeedData();
}

// Comprehensive seed data creation
export async function createComprehensiveSeedData() {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive seed data creation...');

    // 1. Create Admins
    const admins = await createAdmins();
    
    // 2. Create Regular Users (Couples)
    const users = await createUsers();
    
    // 3. Create Vendors (Users + Profiles)
    const vendors = await createVendors(users);
    
    // 4. Create Wedding Planners (Users)
    const planners = await createWeddingPlanners();
    
    // 5. Create Venues (linked to Admins)
    const venues = await createVenues(admins);
    
    // 6. Create Services (linked to Vendors)
    const services = await createServices(vendors);
    
    // 7. Create Bookings (linked to Users, Vendors, Venues)
    await createBookings(users, vendors, venues);
    
    // 8. Create Subscriptions for Vendors and Planners
    await createSubscriptions(vendors, planners);
    
    // 9. Create Payments
    await createPayments(users, vendors, venues);
    
    // 10. Create Reviews
    await createReviews(users, vendors, venues);
    
    // 11. Create Favorites
    await createFavorites(users, vendors, venues);
    
    // 12. Create Social Content (Feed & Gallery)
    await createSocialContent(users, vendors, venues);
    
    console.log('🎉 Comprehensive seed data creation completed!');
  } catch (error) {
    console.error('❌ Seed data creation failed:', error);
    throw error;
  }
}

async function createAdmins() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const adminData = [
    {
      email: 'admin@weddinglk.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      location: { country: 'Sri Lanka', state: 'Western', city: 'Colombo' },
      preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo', notifications: { email: true, sms: true, push: true }, marketing: { email: false, sms: false, push: false } },
      isEmailVerified: true, status: 'active', isVerified: true, isActive: true
    },
    {
      email: 'maintainer@weddinglk.com',
      password: hashedPassword,
      name: 'Platform Maintainer',
      role: 'maintainer',
      location: { country: 'Sri Lanka', state: 'Western', city: 'Colombo' },
      preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo', notifications: { email: true, sms: true, push: true }, marketing: { email: false, sms: false, push: false } },
      isEmailVerified: true, status: 'active', isVerified: true, isActive: true
    }
  ];

  const admins = [];
  for (const data of adminData) {
    const admin = new User(data);
    await admin.save();
    admins.push(admin);
    console.log(`✅ Created admin: ${admin.email}`);
  }
  return admins;
}

async function createUsers() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const usersData = [
    {
      email: 'john.doe@email.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
      phone: '+94 77 123 4567',
      gender: 'male',
      location: { country: 'Sri Lanka', state: 'Western', city: 'Colombo', zipCode: '00300' },
      preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo', notifications: { email: true, sms: false, push: true }, marketing: { email: false, sms: false, push: false } },
      isEmailVerified: true, status: 'active', isVerified: true, isActive: true,
      weddingDetails: { weddingDate: new Date('2025-12-25'), guestCount: 200, budget: 2500000 }
    },
    {
      email: 'jane.smith@email.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'user',
      phone: '+94 77 234 5678',
      gender: 'female',
      location: { country: 'Sri Lanka', state: 'Central', city: 'Kandy', zipCode: '20000' },
      preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo', notifications: { email: true, sms: false, push: true }, marketing: { email: false, sms: false, push: false } },
      isEmailVerified: true, status: 'active', isVerified: true, isActive: true,
      weddingDetails: { weddingDate: new Date('2025-08-15'), guestCount: 150, budget: 1800000 }
    }
  ];

  const users = [];
  for (const data of usersData) {
    const user = new User(data);
    await user.save();
    users.push(user);
    console.log(`✅ Created user: ${user.email}`);
  }
  
  // Create some historical users for growth stats
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  for (let i = 1; i <= 5; i++) {
    const histUser = new User({
      ...usersData[0],
      email: `hist.user${i}@example.com`,
      createdAt: lastMonth
    });
    await histUser.save();
    users.push(histUser);
  }
  console.log('✅ Created 5 historical users for growth stats');
  
  return users;
}

async function createVendors(users: any[]) {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const vendorProfiles = [
    {
      email: 'elegant.events@vendor.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      businessName: 'Elegant Events by Sarah',
      category: 'decorator',
      description: 'Award winning wedding decorators specializing in high-end floral arrangements and premium lighting. We bring elegance to your special day with curated designs.',
      pricing: { startingPrice: 150000 },
      location: { address: '123 Galle Rd', city: 'Colombo', province: 'Western' },
      contact: { phone: '+94 77 111 2222', email: 'sarah@elegant-events.lk' },
      featured: true
    },
    {
      email: 'royal.photography@vendor.com',
      password: hashedPassword,
      name: 'Michael Chen',
      businessName: 'Royal Photography',
      category: 'photographer',
      description: 'Capturing your best moments with state-of-the-art equipment and a cinematic eye. Our team ensures every smile and emotion is preserved forever.',
      pricing: { startingPrice: 85000 },
      location: { address: '456 Temple Rd', city: 'Kandy', province: 'Central' },
      contact: { phone: '+94 77 222 3333', email: 'info@royalphotography.lk' },
      featured: true
    },
    {
      email: 'vendor@example.com',
      password: hashedPassword,
      name: 'Demo Vendor',
      businessName: 'Wedding Wonders',
      category: 'photographer',
      description: 'Your dream wedding captured in high definition. We offer custom packages for intimate weddings and grand celebrations alike.',
      pricing: { startingPrice: 50000 },
      location: { address: '789 High St', city: 'Colombo', province: 'Western' },
      contact: { phone: '+94 77 333 4444', email: 'vendor@example.com' },
      featured: true
    }
  ];

  const vendors = [];
  for (const data of vendorProfiles) {
    const user = new User({
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'vendor',
      isEmailVerified: true,
      status: 'active'
    });
    await user.save();

    const vendor = new Vendor({
      ...data,
      owner: user._id,
      onboardingComplete: true,
      isActive: true,
      isVerified: true
    });
    await vendor.save();
    vendors.push(vendor);
    console.log(`✅ Created vendor profile: ${vendor.businessName}`);
  }

  // Create historical vendors
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  for (let i = 1; i <= 3; i++) {
    const histVendor = new Vendor({
      ...vendorProfiles[0],
      email: `hist.vendor${i}@example.com`,
      businessName: `Historical Shop ${i}`,
      owner: users[0]._id,
      createdAt: lastMonth
    });
    await histVendor.save();
    vendors.push(histVendor);
  }
  console.log('✅ Created 3 historical vendors for growth stats');

  return vendors;
}

async function createWeddingPlanners() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const plannerData = [
    {
      email: 'dream.weddings@planner.com',
      password: hashedPassword,
      name: 'Emma Thompson',
      role: 'wedding_planner',
      isEmailVerified: true,
      status: 'active'
    }
  ];

  const planners = [];
  for (const data of plannerData) {
    const user = new User(data);
    await user.save();
    
    // Create WeddingPlannerProfile
    const profile = new WeddingPlannerProfile({
      userId: user._id,
      professionalTitle: 'Lead Wedding Planner',
      yearsOfExperience: 5,
      specialization: ['Luxury Weddings', 'Destination Weddings'],
      languages: ['English', 'Sinhala'],
      verificationStatus: 'verified',
      rating: { average: 4.8, count: 12, breakdown: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 10 } },
      completedWeddings: 15,
      totalRevenue: 500000,
      emergencyContact: {
        name: 'John Doe Sr.',
        relationship: 'Father',
        phone: '+94 77 999 8888'
      },
      professionalLiability: {
        provider: 'Sri Lanka Insurance',
        policyNumber: 'PL-12345678',
        coverageAmount: 1000000,
        expiryDate: new Date('2026-12-31'),
        documentUrl: 'https://example.com/insurance.pdf',
        verified: true
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true }
      }
    });
    await profile.save();
    
    planners.push(user);
    console.log(`✅ Created wedding planner & profile: ${user.email}`);
  }
  return planners;
}

async function createVenues(admins: any[]) {
  const venueData = [
    {
      name: 'Grand Ballroom Colombo',
      description: 'Premier ballroom in the heart of Colombo. Features a stunning crystal chandelier and a spacious dance floor for up to 500 guests.',
      location: { address: '123 Galle Rd', city: 'Colombo', province: 'Western' },
      capacity: { min: 100, max: 500 },
      pricing: { basePrice: 450000 },
      owner: admins[0]._id,
      isActive: true,
      featured: true
    },
    {
      name: 'Kingsbury Garden',
      description: 'Beautiful outdoor garden overlooking the Beira Lake. Perfect for intimate ceremonies and elegant evening receptions.',
      location: { address: '456 Lake Rd', city: 'Kandy', province: 'Central' },
      capacity: { min: 50, max: 200 },
      pricing: { basePrice: 250000 },
      owner: admins[0]._id,
      isActive: true,
      featured: true
    }
  ];

  const venues = [];
  for (const data of venueData) {
    const venue = new Venue(data);
    await venue.save();
    venues.push(venue);
    console.log(`✅ Created venue: ${venue.name}`);
  }
  return venues;
}

async function createServices(vendors: any[]) {
  const services = [];
  for (const vendor of vendors) {
    const service = new Service({
      vendor: vendor._id,
      name: 'Premium ' + vendor.category,
      description: 'Best in class ' + vendor.category + ' service.',
      category: vendor.category,
      price: vendor.pricing.startingPrice,
      priceType: 'fixed'
    });
    await service.save();
    services.push(service);
    console.log(`✅ Created service for: ${vendor.businessName}`);
  }
  return services;
}

async function createBookings(users: any[], vendors: any[], venues: any[]) {
  const booking = new Booking({
    user: users[0]._id,
    vendor: vendors[0]._id,
    venue: venues[0]._id,
    eventDate: new Date('2025-12-25'),
    eventTime: '18:00',
    guestCount: 200,
    status: 'confirmed',
    payment: { amount: 600000, status: 'completed', method: 'card' }
  });
  await booking.save();
  console.log('✅ Created sample booking');
}

async function createPayments(users: any[], vendors: any[], venues: any[]) {
  console.log('💰 Creating historical payments...');
  
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const paymentData = [
    // Current month payments
    {
      user: users[0]._id,
      vendor: vendors[0]._id,
      amount: 150000,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      createdAt: now
    },
    {
      user: users[1]._id,
      venue: venues[0]._id,
      amount: 450000,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      createdAt: now
    },
    // Last month payments
    {
      user: users[0]._id,
      vendor: vendors[1]._id,
      amount: 120000,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      createdAt: lastMonth
    },
    {
      user: users[1]._id,
      venue: venues[1]._id,
      amount: 300000,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      createdAt: lastMonth
    }
  ];

  for (const data of paymentData) {
    const payment = new Payment(data);
    await payment.save();
  }
  console.log('✅ Created 4 historical payments');
}

async function createReviews(users: any[], vendors: any[], venues: any[]) {
  const review = new Review({
    userId: users[0]._id,
    vendorId: vendors[0]._id,
    overallRating: 5,
    title: 'Amazing Experience!',
    comment: 'Excellent service from ' + vendors[0].businessName + '. Highly recommended!',
    isVerified: true,
    status: 'approved'
  });
  await review.save();
  console.log('✅ Created sample review');
}

async function createSubscriptions(vendors: any[], planners: any[]) {
  // Add subscriptions for vendors
  for (const vendor of vendors) {
    const sub = new Subscription({
      vendorId: vendor._id,
      planId: new mongoose.Types.ObjectId(), // Fake plan ID
      planName: 'Premium',
      planType: 'premium',
      status: 'active',
      price: 4999,
      billingCycle: 'monthly',
      startDate: new Date(),
      features: {
        maxListings: 10,
        maxImagesPerListing: 20,
        maxVideosPerListing: 5,
        analyticsAccess: true,
        boostCampaigns: true,
        prioritySupport: true,
        customDomain: false,
        apiAccess: false,
        whiteLabel: false,
        commissionRate: 10
      },
      payment: {
        method: 'stripe',
        paymentHistory: [{
          amount: 4999,
          currency: 'LKR',
          status: 'success',
          paidAt: new Date()
        }]
      }
    });
  }
  console.log('✅ Created sample subscriptions');
}

async function createFavorites(users: any[], vendors: any[], venues: any[]) {
  console.log('❤️ Creating user favorites...');
  
  const favoriteData = [
    {
      userId: users[0]._id,
      itemId: vendors[0]._id,
      type: 'vendor',
      notes: 'Loved their photography style!',
      priority: 'high'
    },
    {
      userId: users[0]._id,
      itemId: venues[0]._id,
      type: 'venue',
      notes: 'Beautiful ballroom.',
      priority: 'medium'
    },
    {
      userId: users[1]._id,
      itemId: vendors[1]._id,
      type: 'vendor',
      priority: 'medium'
    }
  ];

  for (const data of favoriteData) {
    const favorite = new Favorite(data);
    await favorite.save();
  }
  console.log('✅ Created 3 user favorites');
}

async function createSocialContent(users: any[], vendors: any[], venues: any[]) {
  console.log('📱 Creating social content (Feed & Gallery)...');

  // 1. Create Enhanced Posts (Feed)
  const enhancedPosts = [
    {
      content: "Just started planning our dream wedding! So excited to see all the beautiful venues in Colombo. 💍 #weddingplanning #srilanka",
      author: {
        type: 'user',
        id: users[0]._id,
        name: users[0].name,
        avatar: users[0].avatar,
        verified: false,
        role: 'user'
      },
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
      }],
      engagement: {
        reactions: { like: 12, love: 5, wow: 2, laugh: 0, angry: 0, sad: 0 },
        comments: 3,
        shares: 2,
        views: 150,
        bookmarks: 5
      },
      tags: ['weddingplanning', 'srilanka'],
      isActive: true
    },
    {
      content: "Another stunning setup at Grand Ballroom Colombo today! Loving the white and gold theme. ✨ #weddingdecor #luxurywedding",
      author: {
        type: 'vendor',
        id: vendors[0]._id,
        name: vendors[0].name,
        avatar: vendors[0].avatar,
        verified: true,
        role: 'vendor'
      },
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
      }],
      engagement: {
        reactions: { like: 45, love: 20, wow: 10, laugh: 0, angry: 0, sad: 0 },
        comments: 8,
        shares: 15,
        views: 1200,
        bookmarks: 25
      },
      boost: {
        isBoosted: true,
        boostType: 'featured'
      },
      tags: ['weddingdecor', 'luxurywedding', 'colombo'],
      isActive: true
    }
  ];

  await EnhancedPost.insertMany(enhancedPosts);
  console.log('✅ Created enhanced posts');

  // 2. Create Posts (Gallery)
  const galleryPosts = [
    {
      content: "Traditional Kandyan wedding ceremony. The beauty of Sri Lankan culture is unmatched. #traditionalwedding #kandyan #srilanka",
      author: {
        type: 'vendor',
        id: vendors[0]._id,
        name: 'Cultural Moments',
        avatar: 'https://i.pravatar.cc/150?u=cultural',
        verified: true
      },
      images: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&q=80'
      ],
      location: { name: 'Kandy' },
      tags: ['traditional', 'ceremony', 'srilanka'],
      engagement: { likes: 125, views: 2400 },
      status: 'active',
      isActive: true
    },
    {
      content: "Stunning outdoor reception by the beach. Perfect sunset vibes for a perfect couple. #beachwedding #reception #sunset",
      author: {
        type: 'vendor',
        id: vendors[1]._id,
        name: 'Beach Weddings SL',
        avatar: 'https://i.pravatar.cc/150?u=beach',
        verified: true
      },
      images: [
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80'
      ],
      location: { name: 'Bentota' },
      tags: ['reception', 'beach', 'sunset'],
      engagement: { likes: 89, views: 1800 },
      status: 'active',
      isActive: true
    },
    {
      content: "Elegant bridal portraits in the garden. Simplicity at its best. #bridal #portraits #garden",
      author: {
        type: 'vendor',
        id: vendors[0]._id,
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        verified: true
      },
      images: [
        'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80'
      ],
      location: { name: 'Colombo' },
      tags: ['couples', 'portrait', 'bridal'],
      engagement: { likes: 210, views: 3200 },
      status: 'active',
      isActive: true
    }
  ];

  await Post.insertMany(galleryPosts);
  console.log('✅ Created gallery posts');
}
