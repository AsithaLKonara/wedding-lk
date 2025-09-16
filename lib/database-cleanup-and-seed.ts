import { connectDB } from './db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  User, Vendor, Venue, Booking, Payment, Review, Service, 
  Message, Notification, Task, Client, Conversation, 
  VendorProfile, WeddingPlannerProfile, Document, Post, 
  BoostPackage, Favorite, Availability, Quotation, 
  QuotationRequest, Invoice, Story, Reel, Verification, 
  ServicePackage, Subscription, SubscriptionPlan, Moderation, 
  Commission, EnhancedPost, Group, EnhancedBooking, 
  DynamicPricing, VendorPackage, Comment, 
  MetaAdsCampaign, MetaAdsAdSet, MetaAdsCreative, MetaAdsAccount, 
  Testimonial 
} from './models';

// Database cleanup function
export async function clearAllCollections() {
  try {
    await connectDB();
    
    console.log('🧹 Starting database cleanup...');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Clear all collections
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`✅ Cleared collection: ${collection.name}`);
    }
    
    console.log('🎉 Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}

// Comprehensive seed data creation
export async function createComprehensiveSeedData() {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive seed data creation...');

    // Create users with different roles
    const users = await createUsers();
    const vendors = await createVendors();
    const planners = await createWeddingPlanners();
    const admins = await createAdmins();
    
    // Create related data for each user type
    await createRelatedData(users, vendors, planners, admins);
    
    console.log('🎉 Comprehensive seed data creation completed!');
  } catch (error) {
    console.error('❌ Seed data creation failed:', error);
    throw error;
  }
}

// Create 5 regular users (couples)
async function createUsers() {
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const userData = [
    {
      email: 'john.doe@email.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+94 77 123 4567',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo',
          zipCode: '00300'
        },
        preferences: {
          weddingStyle: 'traditional',
          budget: 2000000,
          guestCount: 150,
          preferredVenue: 'outdoor'
        }
      }
    },
    {
      email: 'jane.smith@email.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'user',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+94 77 234 5678',
        dateOfBirth: new Date('1992-08-22'),
        gender: 'female',
        location: {
          country: 'Sri Lanka',
          state: 'Central Province',
          city: 'Kandy',
          zipCode: '20000'
        },
        preferences: {
          weddingStyle: 'modern',
          budget: 1500000,
          guestCount: 100,
          preferredVenue: 'indoor'
        }
      }
    },
    {
      email: 'mike.wilson@email.com',
      password: hashedPassword,
      name: 'Mike Wilson',
      role: 'user',
      profile: {
        firstName: 'Mike',
        lastName: 'Wilson',
        phone: '+94 77 345 6789',
        dateOfBirth: new Date('1988-12-10'),
        gender: 'male',
        location: {
          country: 'Sri Lanka',
          state: 'Southern Province',
          city: 'Galle',
          zipCode: '80000'
        },
        preferences: {
          weddingStyle: 'beach',
          budget: 3000000,
          guestCount: 200,
          preferredVenue: 'beach'
        }
      }
    },
    {
      email: 'sarah.brown@email.com',
      password: hashedPassword,
      name: 'Sarah Brown',
      role: 'user',
      profile: {
        firstName: 'Sarah',
        lastName: 'Brown',
        phone: '+94 77 456 7890',
        dateOfBirth: new Date('1991-03-18'),
        gender: 'female',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Negombo',
          zipCode: '11500'
        },
        preferences: {
          weddingStyle: 'rustic',
          budget: 1800000,
          guestCount: 120,
          preferredVenue: 'garden'
        }
      }
    },
    {
      email: 'david.jones@email.com',
      password: hashedPassword,
      name: 'David Jones',
      role: 'user',
      profile: {
        firstName: 'David',
        lastName: 'Jones',
        phone: '+94 77 567 8901',
        dateOfBirth: new Date('1989-07-25'),
        gender: 'male',
        location: {
          country: 'Sri Lanka',
          state: 'North Central Province',
          city: 'Anuradhapura',
          zipCode: '50000'
        },
        preferences: {
          weddingStyle: 'cultural',
          budget: 1200000,
          guestCount: 80,
          preferredVenue: 'temple'
        }
      }
    }
  ];

  for (const userDataItem of userData) {
    const user = new User(userDataItem);
    await user.save();
    users.push(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  return users;
}

// Create 5 vendors
async function createVendors() {
  const vendors = [];
  const hashedPassword = await bcrypt.hash('vendor123', 12);
  
  const vendorData = [
    {
      email: 'elegant.events@vendor.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'vendor',
      businessName: 'Elegant Events by Sarah',
      phone: '+94 77 111 2222',
      category: 'decorator',
      description: 'Professional wedding planner with 10+ years of experience creating magical moments.',
      location: {
        address: '123 Galle Road, Colombo 03',
        city: 'Colombo',
        province: 'Western Province',
        serviceAreas: ['Colombo', 'Negombo', 'Kalutara']
      },
      contact: {
        phone: '+94 77 111 2222',
        email: 'elegant.events@vendor.com',
        website: 'https://elegantevents.com'
      },
      services: [
        {
          name: 'Full Wedding Planning',
          description: 'Complete wedding planning service',
          price: 150000,
          duration: '6 months'
        },
        {
          name: 'Day-of Coordination',
          description: 'Wedding day coordination',
          price: 75000,
          duration: '1 day'
        }
      ],
      pricing: {
        startingPrice: 150000,
        currency: 'LKR'
      },
      rating: {
        average: 4.8,
        count: 127
      },
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      email: 'royal.photography@vendor.com',
      password: hashedPassword,
      name: 'Michael Chen',
      role: 'vendor',
      businessName: 'Royal Photography Studio',
      phone: '+94 77 222 3333',
      category: 'photographer',
      description: 'Award-winning wedding photographer specializing in candid moments and artistic compositions.',
      location: {
        address: '456 Temple Road, Kandy',
        city: 'Kandy',
        province: 'Central Province',
        serviceAreas: ['Kandy', 'Matale', 'Nuwara Eliya']
      },
      contact: {
        phone: '+94 77 222 3333',
        email: 'royal.photography@vendor.com',
        website: 'https://royalphotography.com'
      },
      services: [
        {
          name: 'Wedding Photography',
          description: 'Full day wedding photography',
          price: 80000,
          duration: '8 hours'
        },
        {
          name: 'Pre-wedding Shoots',
          description: 'Engagement photo session',
          price: 25000,
          duration: '2 hours'
        }
      ],
      pricing: {
        startingPrice: 80000,
        currency: 'LKR'
      },
      rating: {
        average: 4.9,
        count: 89
      },
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      email: 'garden.catering@vendor.com',
      password: hashedPassword,
      name: 'Priya Fernando',
      role: 'vendor',
      businessName: 'Garden Fresh Catering',
      phone: '+94 77 333 4444',
      category: 'Catering',
      description: 'Premium catering service specializing in traditional Sri Lankan cuisine with modern twists.',
      location: {
        city: 'Galle',
        province: 'Southern Province',
        address: '789 Beach Road, Galle',
        coordinates: [80.2177, 6.0329]
      },
      services: ['Wedding Catering', 'Buffet Service', 'Custom Menus'],
      pricing: {
        startingPrice: 120000,
        currency: 'LKR'
      },
      rating: {
        average: 4.7,
        count: 156
      },
      isVerified: true,
      isActive: true,
      featured: false
    },
    {
      email: 'bloom.florist@vendor.com',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      role: 'vendor',
      businessName: 'Bloom & Blossom Florist',
      phone: '+94 77 444 5555',
      category: 'Floral Design',
      description: 'Creative floral designer creating stunning arrangements for your special day.',
      location: {
        city: 'Negombo',
        province: 'Western Province',
        address: '321 Airport Road, Negombo',
        coordinates: [79.8350, 7.2086]
      },
      services: ['Wedding Bouquets', 'Centerpieces', 'Venue Decoration'],
      pricing: {
        startingPrice: 60000,
        currency: 'LKR'
      },
      rating: {
        average: 4.6,
        count: 73
      },
      isVerified: true,
      isActive: true,
      featured: false
    },
    {
      email: 'melody.music@vendor.com',
      password: hashedPassword,
      name: 'Samantha Perera',
      role: 'vendor',
      businessName: 'Melody Music Ensemble',
      phone: '+94 77 555 6666',
      category: 'Music & Entertainment',
      description: 'Professional musicians providing live music for weddings and special events.',
      location: {
        city: 'Anuradhapura',
        province: 'North Central Province',
        address: '654 Ancient City Road, Anuradhapura',
        coordinates: [80.4139, 8.3114]
      },
      services: ['Live Music', 'DJ Services', 'Sound System'],
      pricing: {
        startingPrice: 100000,
        currency: 'LKR'
      },
      rating: {
        average: 4.5,
        count: 94
      },
      isVerified: true,
      isActive: true,
      featured: false
    }
  ];

  for (const vendorDataItem of vendorData) {
    const vendor = new Vendor(vendorDataItem);
    await vendor.save();
    vendors.push(vendor);
    console.log(`✅ Created vendor: ${vendor.businessName}`);
  }

  return vendors;
}

// Create 5 wedding planners
async function createWeddingPlanners() {
  const planners = [];
  const hashedPassword = await bcrypt.hash('planner123', 12);
  
  const plannerData = [
    {
      email: 'dream.weddings@planner.com',
      password: hashedPassword,
      name: 'Emma Thompson',
      role: 'wedding_planner',
      businessName: 'Dream Weddings by Emma',
      phone: '+94 77 666 7777',
      category: 'Wedding Planning',
      description: 'Full-service wedding planner creating unforgettable experiences for couples.',
      location: {
        city: 'Colombo',
        province: 'Western Province',
        address: '987 Independence Avenue, Colombo 07',
        coordinates: [79.8612, 6.9271]
      },
      experience: '8 years',
      specialties: ['Luxury Weddings', 'Destination Weddings', 'Cultural Ceremonies'],
      rating: {
        average: 4.9,
        count: 45
      },
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      email: 'perfect.day@planner.com',
      password: hashedPassword,
      name: 'James Rodriguez',
      role: 'wedding_planner',
      businessName: 'Perfect Day Events',
      phone: '+94 77 777 8888',
      category: 'Event Planning',
      description: 'Detail-oriented wedding planner ensuring every moment is perfect.',
      location: {
        city: 'Kandy',
        province: 'Central Province',
        address: '555 Peradeniya Road, Kandy',
        coordinates: [80.6337, 7.2906]
      },
      experience: '6 years',
      specialties: ['Intimate Weddings', 'Garden Weddings', 'Traditional Ceremonies'],
      rating: {
        average: 4.8,
        count: 38
      },
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      email: 'bliss.events@planner.com',
      password: hashedPassword,
      name: 'Lisa Anderson',
      role: 'wedding_planner',
      businessName: 'Bliss Events & Planning',
      phone: '+94 77 888 9999',
      category: 'Wedding Planning',
      description: 'Creative wedding planner specializing in unique and personalized celebrations.',
      location: {
        city: 'Galle',
        province: 'Southern Province',
        address: '777 Fort Road, Galle',
        coordinates: [80.2177, 6.0329]
      },
      experience: '5 years',
      specialties: ['Beach Weddings', 'Rustic Weddings', 'Modern Ceremonies'],
      rating: {
        average: 4.7,
        count: 52
      },
      isVerified: true,
      isActive: true,
      featured: false
    },
    {
      email: 'elegance.planning@planner.com',
      password: hashedPassword,
      name: 'Robert Silva',
      role: 'wedding_planner',
      businessName: 'Elegance Planning Studio',
      phone: '+94 77 999 0000',
      category: 'Event Planning',
      description: 'Professional wedding planner with expertise in luxury and high-end celebrations.',
      location: {
        city: 'Negombo',
        province: 'Western Province',
        address: '888 Beach Road, Negombo',
        coordinates: [79.8350, 7.2086]
      },
      experience: '10 years',
      specialties: ['Luxury Weddings', 'Corporate Events', 'International Weddings'],
      rating: {
        average: 4.9,
        count: 67
      },
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      email: 'harmony.events@planner.com',
      password: hashedPassword,
      name: 'Maria Garcia',
      role: 'wedding_planner',
      businessName: 'Harmony Events & Design',
      phone: '+94 77 000 1111',
      category: 'Wedding Planning',
      description: 'Passionate wedding planner creating harmonious and beautiful celebrations.',
      location: {
        city: 'Anuradhapura',
        province: 'North Central Province',
        address: '999 Sacred City Road, Anuradhapura',
        coordinates: [80.4139, 8.3114]
      },
      experience: '7 years',
      specialties: ['Cultural Weddings', 'Religious Ceremonies', 'Family Traditions'],
      rating: {
        average: 4.6,
        count: 41
      },
      isVerified: true,
      isActive: true,
      featured: false
    }
  ];

  for (const plannerDataItem of plannerData) {
    const planner = new User(plannerDataItem);
    await planner.save();
    planners.push(planner);
    console.log(`✅ Created wedding planner: ${planner.businessName}`);
  }

  return planners;
}

// Create 5 admins
async function createAdmins() {
  const admins = [];
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminData = [
    {
      email: 'admin@weddinglk.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+94 77 000 0000',
        permissions: ['all'],
        department: 'IT'
      }
    },
    {
      email: 'support@weddinglk.com',
      password: hashedPassword,
      name: 'Support Admin',
      role: 'admin',
      profile: {
        firstName: 'Support',
        lastName: 'Admin',
        phone: '+94 77 000 0001',
        permissions: ['support', 'moderation'],
        department: 'Customer Support'
      }
    },
    {
      email: 'moderator@weddinglk.com',
      password: hashedPassword,
      name: 'Content Moderator',
      role: 'admin',
      profile: {
        firstName: 'Content',
        lastName: 'Moderator',
        phone: '+94 77 000 0002',
        permissions: ['moderation', 'content'],
        department: 'Content Management'
      }
    },
    {
      email: 'finance@weddinglk.com',
      password: hashedPassword,
      name: 'Finance Admin',
      role: 'admin',
      profile: {
        firstName: 'Finance',
        lastName: 'Admin',
        phone: '+94 77 000 0003',
        permissions: ['finance', 'payments'],
        department: 'Finance'
      }
    },
    {
      email: 'analytics@weddinglk.com',
      password: hashedPassword,
      name: 'Analytics Admin',
      role: 'admin',
      profile: {
        firstName: 'Analytics',
        lastName: 'Admin',
        phone: '+94 77 000 0004',
        permissions: ['analytics', 'reports'],
        department: 'Analytics'
      }
    }
  ];

  for (const adminDataItem of adminData) {
    const admin = new User(adminDataItem);
    await admin.save();
    admins.push(admin);
    console.log(`✅ Created admin: ${admin.name}`);
  }

  return admins;
}

// Create related data for all users
async function createRelatedData(users: any[], vendors: any[], planners: any[], admins: any[]) {
  console.log('🔗 Creating related data...');
  
  // Create venues
  await createVenues();
  
  // Create services
  await createServices(vendors);
  
  // Create bookings
  await createBookings(users, vendors);
  
  // Create reviews
  await createReviews(users, vendors);
  
  // Create posts and social content
  await createSocialContent(users, vendors, planners);
  
  // Create notifications
  await createNotifications(users, vendors, planners);
  
  // Create tasks
  await createTasks(users, planners);
  
  // Create subscriptions
  await createSubscriptions(vendors, planners);
  
  console.log('✅ Related data creation completed!');
}

// Create venues
async function createVenues() {
  const venues = [
    {
      name: 'Grand Ballroom Colombo',
      location: {
        city: 'Colombo',
        province: 'Western Province',
        address: '123 Galle Road, Colombo 03',
        coordinates: [79.8612, 6.9271]
      },
      capacity: 300,
      amenities: ['Air Conditioning', 'Parking', 'Catering Kitchen', 'Sound System'],
      pricing: {
        basePrice: 500000,
        currency: 'LKR'
      },
      isActive: true,
      featured: true
    },
    {
      name: 'Temple Gardens Kandy',
      location: {
        city: 'Kandy',
        province: 'Central Province',
        address: '456 Temple Road, Kandy',
        coordinates: [80.6337, 7.2906]
      },
      capacity: 200,
      amenities: ['Garden Setting', 'Parking', 'Restrooms', 'Lighting'],
      pricing: {
        basePrice: 350000,
        currency: 'LKR'
      },
      isActive: true,
      featured: true
    },
    {
      name: 'Beach Resort Galle',
      location: {
        city: 'Galle',
        province: 'Southern Province',
        address: '789 Beach Road, Galle',
        coordinates: [80.2177, 6.0329]
      },
      capacity: 150,
      amenities: ['Beach Access', 'Resort Facilities', 'Catering', 'Accommodation'],
      pricing: {
        basePrice: 400000,
        currency: 'LKR'
      },
      isActive: true,
      featured: false
    },
    {
      name: 'Garden Villa Negombo',
      location: {
        city: 'Negombo',
        province: 'Western Province',
        address: '321 Airport Road, Negombo',
        coordinates: [79.8350, 7.2086]
      },
      capacity: 100,
      amenities: ['Garden Setting', 'Villa Facilities', 'Parking', 'Catering'],
      pricing: {
        basePrice: 250000,
        currency: 'LKR'
      },
      isActive: true,
      featured: false
    },
    {
      name: 'Sacred Grounds Anuradhapura',
      location: {
        city: 'Anuradhapura',
        province: 'North Central Province',
        address: '654 Ancient City Road, Anuradhapura',
        coordinates: [80.4139, 8.3114]
      },
      capacity: 80,
      amenities: ['Sacred Setting', 'Parking', 'Basic Facilities', 'Cultural Significance'],
      pricing: {
        basePrice: 200000,
        currency: 'LKR'
      },
      isActive: true,
      featured: false
    }
  ];

  for (const venueData of venues) {
    const venue = new Venue(venueData);
    await venue.save();
    console.log(`✅ Created venue: ${venue.name}`);
  }
}

// Create services for vendors
async function createServices(vendors: any[]) {
  for (const vendor of vendors) {
    const services = [
      {
        vendorId: vendor._id,
        name: `${vendor.category} Service`,
        description: `Professional ${vendor.category.toLowerCase()} service`,
        category: vendor.category,
        pricing: {
          basePrice: vendor.pricing.startingPrice,
          currency: 'LKR'
        },
        isActive: true
      }
    ];

    for (const serviceData of services) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`✅ Created service for vendor: ${vendor.businessName}`);
    }
  }
}

// Create bookings
async function createBookings(users: any[], vendors: any[]) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const vendor = vendors[i % vendors.length];
    
    const booking = new Booking({
      userId: user._id,
      vendorId: vendor._id,
      serviceId: null, // Will be linked to service
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      time: '18:00',
      duration: 8,
      guestCount: user.profile.preferences.guestCount,
      totalAmount: vendor.pricing.startingPrice,
      status: 'confirmed',
      notes: `Wedding booking for ${user.name}`
    });
    
    await booking.save();
    console.log(`✅ Created booking for user: ${user.name}`);
  }
}

// Create reviews
async function createReviews(users: any[], vendors: any[]) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const vendor = vendors[i % vendors.length];
    
    const review = new Review({
      userId: user._id,
      vendorId: vendor._id,
      rating: 4 + Math.random(), // Random rating between 4-5
      comment: `Excellent service from ${vendor.businessName}. Highly recommended!`,
      isVerified: true,
      createdAt: new Date()
    });
    
    await review.save();
    console.log(`✅ Created review from user: ${user.name}`);
  }
}

// Create social content
async function createSocialContent(users: any[], vendors: any[], planners: any[]) {
  const allUsers = [...users, ...vendors, ...planners];
  
  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    
    // Create posts
    const post = new Post({
      authorId: user._id,
      content: `Excited to share our latest work! #wedding #${user.role}`,
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=500'],
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      createdAt: new Date()
    });
    
    await post.save();
    console.log(`✅ Created post for user: ${user.name}`);
  }
}

// Create notifications
async function createNotifications(users: any[], vendors: any[], planners: any[]) {
  const allUsers = [...users, ...vendors, ...planners];
  
  for (const user of allUsers) {
    const notification = new Notification({
      userId: user._id,
      type: 'welcome',
      title: 'Welcome to WeddingLK!',
      message: 'Thank you for joining our platform. Start exploring amazing wedding services!',
      isRead: false,
      priority: 'medium',
      createdAt: new Date()
    });
    
    await notification.save();
    console.log(`✅ Created notification for user: ${user.name}`);
  }
}

// Create tasks
async function createTasks(users: any[], planners: any[]) {
  for (const user of users) {
    const tasks = [
      {
        userId: user._id,
        title: 'Choose Wedding Venue',
        description: 'Research and select the perfect venue for your wedding',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'pending',
        priority: 'high',
        category: 'planning'
      },
      {
        userId: user._id,
        title: 'Book Photographer',
        description: 'Find and book a professional wedding photographer',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'pending',
        priority: 'medium',
        category: 'vendor'
      }
    ];

    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
      console.log(`✅ Created task for user: ${user.name}`);
    }
  }
}

// Create subscriptions
async function createSubscriptions(vendors: any[], planners: any[]) {
  const allVendors = [...vendors, ...planners];
  
  for (const vendor of allVendors) {
    const subscription = new Subscription({
      userId: vendor._id,
      planId: 'premium',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      autoRenew: true,
      features: ['unlimited_bookings', 'analytics', 'priority_support']
    });
    
    await subscription.save();
    console.log(`✅ Created subscription for vendor: ${vendor.name || vendor.businessName}`);
  }
}

// Main function to run cleanup and seeding
export async function resetAndSeedDatabase() {
  try {
    console.log('🚀 Starting database reset and seeding process...');
    
    // Step 1: Clear all collections
    await clearAllCollections();
    
    // Step 2: Create comprehensive seed data
    await createComprehensiveSeedData();
    
    console.log('🎉 Database reset and seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 5 Regular Users (couples)');
    console.log('   - 5 Vendors');
    console.log('   - 5 Wedding Planners');
    console.log('   - 5 Admins');
    console.log('   - Related data for all collections');
    
  } catch (error) {
    console.error('❌ Database reset and seeding failed:', error);
    throw error;
  }
}
