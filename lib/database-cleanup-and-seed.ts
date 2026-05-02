import { connectDB } from './db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  User, Vendor, Venue, Booking, Review, Service
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
    const vendors = await createVendors();
    
    // 4. Create Wedding Planners (Users)
    const planners = await createWeddingPlanners();
    
    // 5. Create Venues (linked to Admins)
    const venues = await createVenues(admins);
    
    // 6. Create Services (linked to Vendors)
    const services = await createServices(vendors);
    
    // 7. Create Bookings (linked to Users, Vendors, Venues)
    await createBookings(users, vendors, venues);
    
    // 8. Create Reviews
    await createReviews(users, vendors, venues);
    
    console.log('🎉 Comprehensive seed data creation completed!');
  } catch (error) {
    console.error('❌ Seed data creation failed:', error);
    throw error;
  }
}

async function createAdmins() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
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
  return users;
}

async function createVendors() {
  const hashedPassword = await bcrypt.hash('vendor123', 12);
  const vendorProfiles = [
    {
      email: 'elegant.events@vendor.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      businessName: 'Elegant Events by Sarah',
      category: 'decorator',
      description: 'Award winning wedding decorators.',
      pricing: { startingPrice: 150000 },
      location: { address: '123 Galle Rd', city: 'Colombo', province: 'Western' },
      contact: { phone: '+94 77 111 2222', email: 'elegant.events@vendor.com' }
    },
    {
      email: 'royal.photography@vendor.com',
      password: hashedPassword,
      name: 'Michael Chen',
      businessName: 'Royal Photography',
      category: 'photographer',
      description: 'Capturing your best moments.',
      pricing: { startingPrice: 85000 },
      location: { address: '456 Temple Rd', city: 'Kandy', province: 'Central' },
      contact: { phone: '+94 77 222 3333', email: 'royal.photography@vendor.com' }
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
  return vendors;
}

async function createWeddingPlanners() {
  const hashedPassword = await bcrypt.hash('planner123', 12);
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
    planners.push(user);
    console.log(`✅ Created wedding planner: ${user.email}`);
  }
  return planners;
}

async function createVenues(admins: any[]) {
  const venueData = [
    {
      name: 'Grand Ballroom Colombo',
      description: 'Premier ballroom in Colombo.',
      location: { address: '123 Galle Rd', city: 'Colombo', province: 'Western' },
      capacity: { min: 100, max: 500 },
      pricing: { basePrice: 450000 },
      owner: admins[0]._id,
      isActive: true
    },
    {
      name: 'Kingsbury Garden',
      description: 'Beautiful outdoor garden.',
      location: { address: '456 Lake Rd', city: 'Kandy', province: 'Central' },
      capacity: { min: 50, max: 200 },
      pricing: { basePrice: 250000 },
      owner: admins[0]._id,
      isActive: true
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
