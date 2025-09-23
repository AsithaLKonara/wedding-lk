import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models (using compiled JS files)
import { User } from '../lib/models/user.js';
import { Venue } from '../lib/models/venue.js';

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
    password: '$2a$10$hashedpassword123',
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
    username: 'admin',
    email: 'admin@weddinglk.com',
    password: '1234',
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
      Venue.deleteMany({})
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
    const venuesWithOwner = sampleVenues.map((venue, i) => ({
      ...venue,
      owner: users[0]._id // assign first user as owner
    }));
    const venues = await Venue.insertMany(venuesWithOwner);
    console.log(`✅ Created ${venues.length} venues`);
    return venues;
  } catch (error) {
    console.error('❌ Error seeding venues:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting users and venues seeding...');
    
    await connectToDatabase();
    await clearDatabase();
    
    const users = await seedUsers();
    const venues = await seedVenues(users);
    
    console.log('\n🎉 Users and venues seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏰 Venues: ${venues.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
main();
