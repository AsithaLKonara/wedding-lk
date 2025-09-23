#!/usr/bin/env node

import { connectDB } from '../lib/db.js';
import { User } from '../lib/models/user.js';
import { Venue } from '../lib/models/venue.js';
import { Vendor } from '../lib/models/vendor.js';
import { Booking } from '../lib/models/booking.js';
import { Review } from '../lib/models/review.js';
import { Service } from '../lib/models/service.js';
import { Task } from '../lib/models/task.js';
import { Client } from '../lib/models/client.js';
import bcrypt from 'bcryptjs';

const seedData = {
  users: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+94771234567',
      password: 'password123',
      userType: 'couple',
      weddingDate: new Date('2024-12-25'),
      preferences: {
        budget: 500000,
        location: 'Colombo',
        guestCount: 150,
        weddingStyle: 'Traditional'
      }
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+94771234568',
      password: 'password123',
      userType: 'couple',
      weddingDate: new Date('2024-11-20'),
      preferences: {
        budget: 300000,
        location: 'Kandy',
        guestCount: 100,
        weddingStyle: 'Modern'
      }
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '+94771234569',
      password: 'password123',
      userType: 'planner',
      preferences: {
        budget: 0,
        location: 'Colombo',
        guestCount: 0,
        weddingStyle: 'Any'
      }
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@weddinglk.com',
      phone: '+94771234570',
      password: 'admin123',
      userType: 'admin',
      isVerified: true
    }
  ],
  venues: [
    {
      name: 'Grand Ballroom Hotel',
      description: 'A luxurious hotel with elegant ballroom facilities perfect for grand weddings',
      location: {
        address: '123 Galle Road, Colombo 03',
        city: 'Colombo',
        province: 'Western',
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      capacity: { min: 100, max: 500 },
      pricing: {
        basePrice: 250000,
        currency: 'LKR',
        pricePerGuest: 2500
      },
      amenities: ['Parking', 'Catering', 'Decoration', 'Sound System', 'Air Conditioning', 'Bridal Suite'],
      images: ['/placeholder.svg?height=300&width=400'],
      rating: { average: 4.8, count: 25 }
    },
    {
      name: 'Garden Paradise Resort',
      description: 'Beautiful outdoor venue with lush gardens and natural beauty',
      location: {
        address: '456 Kandy Road, Kandy',
        city: 'Kandy',
        province: 'Central',
        coordinates: { lat: 7.2906, lng: 80.6337 }
      },
      capacity: { min: 50, max: 300 },
      pricing: {
        basePrice: 180000,
        currency: 'LKR',
        pricePerGuest: 2000
      },
      amenities: ['Garden', 'Pool', 'Accommodation', 'Photography', 'Parking'],
      images: ['/placeholder.svg?height=300&width=400'],
      rating: { average: 4.6, count: 18 }
    },
    {
      name: 'Beachfront Villa',
      description: 'Stunning beachfront location with ocean views',
      location: {
        address: '789 Galle Road, Galle',
        city: 'Galle',
        province: 'Southern',
        coordinates: { lat: 6.0329, lng: 80.2170 }
      },
      capacity: { min: 30, max: 200 },
      pricing: {
        basePrice: 150000,
        currency: 'LKR',
        pricePerGuest: 1800
      },
      amenities: ['Beach Access', 'Pool', 'Restaurant', 'Parking', 'Sound System'],
      images: ['/placeholder.svg?height=300&width=400'],
      rating: { average: 4.9, count: 32 }
    }
  ],
  vendors: [
    {
      name: 'Perfect Moments Photography',
      businessName: 'Perfect Moments Photography Studio',
      category: 'photographer',
      description: 'Professional wedding photography with creative and artistic approach',
      location: {
        address: '123 Main Street, Colombo 07',
        city: 'Colombo',
        province: 'Western',
        serviceAreas: ['Colombo', 'Gampaha', 'Kalutara']
      },
      contact: {
        phone: '+94771234571',
        email: 'info@perfectmoments.lk',
        website: 'https://perfectmoments.lk',
        socialMedia: {
          facebook: 'https://facebook.com/perfectmoments',
          instagram: 'https://instagram.com/perfectmoments',
          youtube: 'https://youtube.com/perfectmoments'
        }
      },
      services: [
        { name: 'Full Day Photography', price: 75000, duration: '8 hours' },
        { name: 'Half Day Photography', price: 45000, duration: '4 hours' },
        { name: 'Engagement Shoot', price: 25000, duration: '2 hours' }
      ],
      portfolio: ['/placeholder.svg?height=300&width=400'],
      pricing: {
        startingPrice: 45000,
        currency: 'LKR',
        packages: [
          { name: 'Basic Package', price: 45000, features: ['4 hours coverage', '200 edited photos', 'Online gallery'] },
          { name: 'Premium Package', price: 75000, features: ['8 hours coverage', '500 edited photos', 'Online gallery', 'USB drive'] },
          { name: 'Luxury Package', price: 120000, features: ['12 hours coverage', '800 edited photos', 'Online gallery', 'USB drive', 'Photo book'] }
        ]
      },
      rating: { average: 4.9, count: 45 },
      isVerified: true,
      featured: true
    },
    {
      name: 'Delicious Catering Co.',
      businessName: 'Delicious Catering Company',
      category: 'catering',
      description: 'Premium catering services with authentic Sri Lankan and international cuisine',
      location: {
        address: '456 Food Street, Galle',
        city: 'Galle',
        province: 'Southern',
        serviceAreas: ['Galle', 'Matara', 'Hambantota', 'Colombo']
      },
      contact: {
        phone: '+94771234572',
        email: 'orders@deliciouscatering.lk',
        website: 'https://deliciouscatering.lk'
      },
      services: [
        { name: 'Buffet Service', price: 2500, duration: '4 hours' },
        { name: 'Plated Service', price: 3000, duration: '4 hours' },
        { name: 'Cocktail Reception', price: 2000, duration: '3 hours' }
      ],
      portfolio: ['/placeholder.svg?height=300&width=400'],
      pricing: {
        startingPrice: 2000,
        currency: 'LKR',
        packages: [
          { name: 'Basic Menu', price: 2000, features: ['Rice & Curry', 'Salad', 'Dessert', 'Tea/Coffee'] },
          { name: 'Premium Menu', price: 3000, features: ['Mixed Rice & Curry', 'Salad Bar', 'Dessert Station', 'Beverages'] },
          { name: 'Luxury Menu', price: 4500, features: ['International Cuisine', 'Live Cooking Station', 'Premium Desserts', 'Full Bar'] }
        ]
      },
      rating: { average: 4.7, count: 38 },
      isVerified: true,
      featured: true
    },
    {
      name: 'Elegant Decorations',
      businessName: 'Elegant Wedding Decorations',
      category: 'decorator',
      description: 'Creative and elegant wedding decorations to make your special day memorable',
      location: {
        address: '789 Decoration Lane, Kandy',
        city: 'Kandy',
        province: 'Central',
        serviceAreas: ['Kandy', 'Matale', 'Nuwara Eliya', 'Colombo']
      },
      contact: {
        phone: '+94771234573',
        email: 'info@elegantdecor.lk',
        website: 'https://elegantdecor.lk'
      },
      services: [
        { name: 'Stage Decoration', price: 50000, duration: '1 day' },
        { name: 'Table Settings', price: 15000, duration: '1 day' },
        { name: 'Flower Arrangements', price: 25000, duration: '1 day' }
      ],
      portfolio: ['/placeholder.svg?height=300&width=400'],
      pricing: {
        startingPrice: 30000,
        currency: 'LKR',
        packages: [
          { name: 'Basic Decoration', price: 30000, features: ['Stage backdrop', 'Basic flowers', 'Table centerpieces'] },
          { name: 'Premium Decoration', price: 60000, features: ['Elaborate stage', 'Premium flowers', 'Lighting effects'] },
          { name: 'Luxury Decoration', price: 100000, features: ['Custom design', 'Premium flowers', 'Professional lighting', 'Photo booth'] }
        ]
      },
      rating: { average: 4.8, count: 28 },
      isVerified: true,
      featured: false
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Vendor.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Service.deleteMany({}),
      Task.deleteMany({}),
      Client.deleteMany({})
    ]);

    // Hash passwords
    console.log('🔐 Hashing passwords...');
    for (const user of seedData.users) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(seedData.users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create venues (assign to first user as owner)
    console.log('🏢 Creating venues...');
    const venueData = seedData.venues.map(venue => ({
      ...venue,
      owner: createdUsers[0]._id
    }));
    const createdVenues = await Venue.insertMany(venueData);
    console.log(`✅ Created ${createdVenues.length} venues`);

    // Create vendors (assign to first user as owner)
    console.log('🏪 Creating vendors...');
    const vendorData = seedData.vendors.map(vendor => ({
      ...vendor,
      owner: createdUsers[0]._id
    }));
    const createdVendors = await Vendor.insertMany(vendorData);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // Create services for vendors
    console.log('🛠️ Creating services...');
    const services = [];
    for (const vendor of createdVendors) {
      for (const service of vendor.services) {
        services.push({
          vendorId: vendor._id,
          name: service.name,
          price: service.price,
          description: service.duration
        });
      }
    }
    await Service.insertMany(services);
    console.log(`✅ Created ${services.length} services`);

    // Create sample bookings
    console.log('📅 Creating bookings...');
    const bookings = [
      {
        venueId: createdVenues[0]._id,
        userId: createdUsers[1]._id,
        date: new Date('2024-12-25'),
        guests: 150,
        contactInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+94771234568'
        },
        message: 'Looking forward to our special day!',
        status: 'confirmed'
      },
      {
        venueId: createdVenues[1]._id,
        userId: createdUsers[1]._id,
        date: new Date('2024-11-20'),
        guests: 100,
        contactInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+94771234568'
        },
        message: 'Please confirm availability',
        status: 'pending'
      }
    ];
    await Booking.insertMany(bookings);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Create sample reviews
    console.log('⭐ Creating reviews...');
    const reviews = [
      {
        vendorId: createdVendors[0]._id,
        userId: createdUsers[1]._id,
        rating: 5,
        comment: 'Amazing photography! Highly recommended!'
      },
      {
        vendorId: createdVendors[1]._id,
        userId: createdUsers[1]._id,
        rating: 4,
        comment: 'Great food and service, very professional team.'
      }
    ];
    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Create sample tasks for planner
    console.log('📋 Creating tasks...');
    const tasks = [
      {
        plannerId: createdUsers[2]._id,
        clientId: createdUsers[1]._id,
        task: 'Book venue for wedding ceremony',
        date: new Date('2024-10-01'),
        status: 'done'
      },
      {
        plannerId: createdUsers[2]._id,
        clientId: createdUsers[1]._id,
        task: 'Arrange catering services',
        date: new Date('2024-10-15'),
        status: 'pending'
      },
      {
        plannerId: createdUsers[2]._id,
        clientId: createdUsers[1]._id,
        task: 'Book photographer',
        date: new Date('2024-11-01'),
        status: 'pending'
      }
    ];
    await Task.insertMany(tasks);
    console.log(`✅ Created ${tasks.length} tasks`);

    // Create sample clients for planner
    console.log('👤 Creating clients...');
    const clients = [
      {
        plannerId: createdUsers[2]._id,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94771234568',
        weddingDate: new Date('2024-12-25')
      },
      {
        plannerId: createdUsers[2]._id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94771234567',
        weddingDate: new Date('2024-11-20')
      }
    ];
    await Client.insertMany(clients);
    console.log(`✅ Created ${clients.length} clients`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🏢 Venues: ${createdVenues.length}`);
    console.log(`🏪 Vendors: ${createdVendors.length}`);
    console.log(`🛠️ Services: ${services.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log(`👤 Clients: ${clients.length}`);

    console.log('\n🔑 Test Accounts:');
    console.log('Couple: john@example.com / password123');
    console.log('Couple: jane@example.com / password123');
    console.log('Planner: sarah@example.com / password123');
    console.log('Admin: admin@weddinglk.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
