import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models (using compiled JS files)
import { User } from '../lib/models/user.js';
import { Venue } from '../lib/models/venue.js';
import { Vendor } from '../lib/models/vendor.js';
import { Booking } from '../lib/models/booking.js';
import { Review } from '../lib/models/review.js';
import { Service } from '../lib/models/service.js';
import { Task } from '../lib/models/task.js';
import { Client } from '../lib/models/client.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$hashedpassword123', // In real app, this would be properly hashed
    role: 'couple',
    userType: 'couple',
    phone: '+1234567890',
    isEmailVerified: true,
    profilePicture: 'https://via.placeholder.com/150',
    preferences: {
      budget: 50000,
      guestCount: 150,
      weddingDate: new Date('2024-12-15'),
      location: 'New York'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$hashedpassword456',
    role: 'vendor',
    userType: 'vendor',
    phone: '+1234567891',
    isEmailVerified: true,
    profilePicture: 'https://via.placeholder.com/150',
    businessName: 'Elegant Events',
    businessType: 'Event Planner'
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: '$2a$10$hashedpassword789',
    role: 'admin',
    userType: 'admin',
    phone: '+1234567892',
    isEmailVerified: true,
    profilePicture: 'https://via.placeholder.com/150'
  }
];

const sampleVenues = [
  {
    name: 'Grand Plaza Hotel',
    description: 'Luxurious hotel with stunning ballroom and garden views',
    owner: null, // Will be set after user creation
    location: {
      address: '123 Main Street, New York, NY 10001',
      city: 'New York',
      province: 'NY',
      zipCode: '10001'
    },
    capacity: {
      min: 50,
      max: 200
    },
    pricing: {
      basePrice: 150,
      currency: 'USD'
    },
    amenities: ['Parking', 'Catering', 'DJ', 'Photography'],
    images: [
      'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Grand+Plaza+Hotel+1',
      'https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Grand+Plaza+Hotel+2'
    ],
    contactInfo: {
      phone: '+1234567890',
      email: 'info@grandplaza.com',
      website: 'https://grandplaza.com'
    },
    availability: [
      {
        date: new Date('2024-12-15'),
        isAvailable: true,
        price: 150
      }
    ],
    rating: 4.5,
    reviewCount: 25
  },
  {
    name: 'Garden Villa Estate',
    description: 'Beautiful outdoor venue with gardens and lake views',
    owner: null, // Will be set after user creation
    location: {
      address: '456 Garden Lane, Los Angeles, CA 90210',
      city: 'Los Angeles',
      province: 'CA',
      zipCode: '90210'
    },
    capacity: {
      min: 30,
      max: 150
    },
    pricing: {
      basePrice: 120,
      currency: 'USD'
    },
    amenities: ['Outdoor Ceremony', 'Garden', 'Lake View', 'Catering'],
    images: [
      'https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Garden+Villa+1',
      'https://via.placeholder.com/800x600/96CEB4/FFFFFF?text=Garden+Villa+2'
    ],
    contactInfo: {
      phone: '+1234567891',
      email: 'info@gardenvilla.com',
      website: 'https://gardenvilla.com'
    },
    availability: [
      {
        date: new Date('2024-12-20'),
        isAvailable: true,
        price: 120
      }
    ],
    rating: 4.8,
    reviewCount: 18
  }
];

const sampleVendors = [
  {
    name: 'Elegant Events',
    businessType: 'Event Planner',
    description: 'Full-service wedding planning and coordination',
    address: '789 Business Ave, New York, NY 10002',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    services: ['Wedding Planning', 'Coordination', 'Design'],
    contactInfo: {
      phone: '+1234567892',
      email: 'info@elegantevents.com',
      website: 'https://elegantevents.com'
    },
    portfolio: [
      'https://via.placeholder.com/800x600/FFEAA7/000000?text=Event+1',
      'https://via.placeholder.com/800x600/DDA0DD/000000?text=Event+2'
    ],
    rating: 4.7,
    reviewCount: 32,
    pricing: {
      startingPrice: 5000,
      currency: 'USD'
    }
  },
  {
    name: 'Perfect Pictures Photography',
    businessType: 'Photographer',
    description: 'Professional wedding photography and videography',
    address: '321 Camera Street, Los Angeles, CA 90211',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90211',
    services: ['Photography', 'Videography', 'Photo Editing'],
    contactInfo: {
      phone: '+1234567893',
      email: 'info@perfectpictures.com',
      website: 'https://perfectpictures.com'
    },
    portfolio: [
      'https://via.placeholder.com/800x600/FFB6C1/000000?text=Photo+1',
      'https://via.placeholder.com/800x600/87CEEB/000000?text=Photo+2'
    ],
    rating: 4.9,
    reviewCount: 45,
    pricing: {
      startingPrice: 3000,
      currency: 'USD'
    }
  }
];

const sampleServices = [
  {
    name: 'Wedding Planning',
    description: 'Complete wedding planning and coordination services',
    category: 'Planning',
    price: 5000,
    duration: '6-12 months',
    vendorId: null, // Will be set after vendor creation
    isActive: true
  },
  {
    name: 'Photography Package',
    description: 'Full day wedding photography with editing',
    category: 'Photography',
    price: 3000,
    duration: '8 hours',
    vendorId: null,
    isActive: true
  },
  {
    name: 'Catering Service',
    description: 'Full catering service for wedding reception',
    category: 'Catering',
    price: 75,
    duration: 'Per person',
    vendorId: null,
    isActive: true
  }
];

const sampleTasks = [
  {
    title: 'Book Venue',
    description: 'Research and book wedding venue',
    category: 'Venue',
    priority: 'High',
    dueDate: new Date('2024-06-15'),
    status: 'In Progress',
    userId: null, // Will be set after user creation
    isCompleted: false
  },
  {
    title: 'Hire Photographer',
    description: 'Interview and hire wedding photographer',
    category: 'Vendors',
    priority: 'High',
    dueDate: new Date('2024-07-01'),
    status: 'Pending',
    userId: null,
    isCompleted: false
  },
  {
    title: 'Send Save the Dates',
    description: 'Design and send save the date cards',
    category: 'Invitations',
    priority: 'Medium',
    dueDate: new Date('2024-08-01'),
    status: 'Not Started',
    userId: null,
    isCompleted: false
  }
];

const sampleClients = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567894',
    weddingDate: new Date('2024-12-15'),
    budget: 45000,
    guestCount: 120,
    status: 'Active',
    notes: 'Interested in outdoor ceremony'
  },
  {
    name: 'Mike and Lisa Chen',
    email: 'mike.lisa@example.com',
    phone: '+1234567895',
    weddingDate: new Date('2024-11-20'),
    budget: 35000,
    guestCount: 80,
    status: 'Active',
    notes: 'Prefer intimate ceremony'
  }
];

async function connectToDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
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
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedUsers() {
  try {
    console.log('👥 Seeding users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

async function seedVenues(users) {
  try {
    console.log('🏰 Seeding venues...');
    const venuesWithOwnerIds = sampleVenues.map((venue, index) => ({
      ...venue,
      owner: users[index % users.length]._id,
      location: {
        address: venue.address,
        city: venue.city,
        province: venue.state,
        zipCode: venue.zipCode
      },
      capacity: {
        min: Math.floor(venue.capacity * 0.3),
        max: venue.capacity
      },
      pricing: {
        basePrice: venue.pricePerPerson,
        currency: 'USD'
      }
    }));
    const venues = await Venue.insertMany(venuesWithOwnerIds);
    console.log(`✅ Created ${venues.length} venues`);
    return venues;
  } catch (error) {
    console.error('❌ Error seeding venues:', error);
    throw error;
  }
}

async function seedVendors() {
  try {
    console.log('🏢 Seeding vendors...');
    const vendors = await Vendor.insertMany(sampleVendors);
    console.log(`✅ Created ${vendors.length} vendors`);
    return vendors;
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    throw error;
  }
}

async function seedServices(vendors) {
  try {
    console.log('🛠️ Seeding services...');
    const servicesWithVendorIds = sampleServices.map((service, index) => ({
      ...service,
      vendorId: vendors[index % vendors.length]._id
    }));
    const services = await Service.insertMany(servicesWithVendorIds);
    console.log(`✅ Created ${services.length} services`);
    return services;
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
}

async function seedTasks(users) {
  try {
    console.log('📋 Seeding tasks...');
    const tasksWithUserIds = sampleTasks.map((task, index) => ({
      ...task,
      userId: users[index % users.length]._id
    }));
    const tasks = await Task.insertMany(tasksWithUserIds);
    console.log(`✅ Created ${tasks.length} tasks`);
    return tasks;
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    throw error;
  }
}

async function seedClients() {
  try {
    console.log('👥 Seeding clients...');
    const clients = await Client.insertMany(sampleClients);
    console.log(`✅ Created ${clients.length} clients`);
    return clients;
  } catch (error) {
    console.error('❌ Error seeding clients:', error);
    throw error;
  }
}

async function seedBookings(users, venues, vendors) {
  try {
    console.log('📅 Seeding bookings...');
    const sampleBookings = [
      {
        userId: users[0]._id,
        venueId: venues[0]._id,
        vendorId: vendors[0]._id,
        eventDate: new Date('2024-12-15'),
        guestCount: 150,
        totalAmount: 22500,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        specialRequests: 'Outdoor ceremony preferred'
      },
      {
        userId: users[1]._id,
        venueId: venues[1]._id,
        vendorId: vendors[1]._id,
        eventDate: new Date('2024-12-20'),
        guestCount: 120,
        totalAmount: 14400,
        status: 'Pending',
        paymentStatus: 'Partial',
        specialRequests: 'Vegetarian catering required'
      }
    ];
    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`✅ Created ${bookings.length} bookings`);
    return bookings;
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
    throw error;
  }
}

async function seedReviews(users, venues, vendors) {
  try {
    console.log('⭐ Seeding reviews...');
    const sampleReviews = [
      {
        userId: users[0]._id,
        venueId: venues[0]._id,
        rating: 5,
        comment: 'Amazing venue! The staff was incredibly helpful.',
        date: new Date('2024-01-15')
      },
      {
        userId: users[1]._id,
        vendorId: vendors[0]._id,
        rating: 4,
        comment: 'Great service, very professional team.',
        date: new Date('2024-01-20')
      }
    ];
    const reviews = await Review.insertMany(sampleReviews);
    console.log(`✅ Created ${reviews.length} reviews`);
    return reviews;
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');
    
    await connectToDatabase();
    await clearDatabase();
    
    const users = await seedUsers();
    const venues = await seedVenues(users);
    const vendors = await seedVendors();
    const services = await seedServices(vendors);
    const tasks = await seedTasks(users);
    const clients = await seedClients();
    const bookings = await seedBookings(users, venues, vendors);
    const reviews = await seedReviews(users, venues, vendors);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏰 Venues: ${venues.length}`);
    console.log(`   🏢 Vendors: ${vendors.length}`);
    console.log(`   🛠️ Services: ${services.length}`);
    console.log(`   📋 Tasks: ${tasks.length}`);
    console.log(`   👥 Clients: ${clients.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   ⭐ Reviews: ${reviews.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();