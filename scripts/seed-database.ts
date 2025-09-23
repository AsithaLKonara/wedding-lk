import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Import models
import { User } from '../lib/models/user';
import { Venue } from '../lib/models/venue';
import { Vendor } from '../lib/models/vendor';
import { Booking } from '../lib/models/booking';
import { Review } from '../lib/models/review';
import { Service } from '../lib/models/service';
import { Task } from '../lib/models/task';
import { Client } from '../lib/models/client';

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'couple',
    phone: '+94 71 123 4567',
    avatar: '/placeholder-user.jpg',
    verified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'couple',
    phone: '+94 71 123 4568',
    avatar: '/placeholder-user.jpg',
    verified: true,
  },
  {
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: 'admin123',
    role: 'admin',
    phone: '+94 71 123 4569',
    avatar: '/placeholder-user.jpg',
    verified: true,
  },
];

const sampleVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Luxurious hotel ballroom with stunning city views',
    location: 'Colombo',
    address: '123 Main Street, Colombo 01',
    capacity: 300,
    price: 150000,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    amenities: ['Parking', 'Catering', 'Audio/Visual', 'Garden'],
    contact: {
      phone: '+94 11 234 5678',
      email: 'info@grandballroom.com',
    },
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rating: 4.8,
    reviews: [],
    verified: true,
  },
  {
    name: 'Garden Paradise Resort',
    description: 'Beautiful garden setting with mountain views',
    location: 'Kandy',
    address: '456 Hill Road, Kandy',
    capacity: 200,
    price: 120000,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    amenities: ['Garden', 'Catering', 'Accommodation', 'Pool'],
    contact: {
      phone: '+94 81 234 5678',
      email: 'info@gardenparadise.com',
    },
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rating: 4.6,
    reviews: [],
    verified: true,
  },
  {
    name: 'Seaside Wedding Villa',
    description: 'Intimate beachfront venue for romantic weddings',
    location: 'Galle',
    address: '789 Beach Road, Galle',
    capacity: 150,
    price: 100000,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    amenities: ['Beach Access', 'Catering', 'Photography', 'Accommodation'],
    contact: {
      phone: '+94 91 234 5678',
      email: 'info@seasidevilla.com',
    },
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rating: 4.9,
    reviews: [],
    verified: true,
  },
];

const sampleVendors = [
  {
    name: 'Perfect Moments Photography',
    description: 'Professional wedding photography and videography services',
    category: 'photography',
    location: 'Colombo',
    address: '321 Camera Street, Colombo 03',
    contact: {
      phone: '+94 11 345 6789',
      email: 'info@perfectmoments.com',
    },
    services: ['Wedding Photography', 'Videography', 'Engagement Shoots'],
    pricing: {
      weddingPackage: 45000,
      engagementShoot: 15000,
      videography: 35000,
    },
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    rating: 4.9,
    reviews: [],
    verified: true,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    name: 'Elegant Catering Services',
    description: 'Delicious wedding catering with customizable menus',
    category: 'catering',
    location: 'Kandy',
    address: '654 Food Street, Kandy',
    contact: {
      phone: '+94 81 345 6789',
      email: 'info@elegantcatering.com',
    },
    services: ['Wedding Catering', 'Menu Planning', 'Setup & Cleanup'],
    pricing: {
      perPerson: 2500,
      setupFee: 10000,
      cleanupFee: 5000,
    },
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    rating: 4.7,
    reviews: [],
    verified: true,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    name: 'Harmony Live Band',
    description: 'Professional live music for your special day',
    category: 'entertainment',
    location: 'Galle',
    address: '987 Music Lane, Galle',
    contact: {
      phone: '+94 91 345 6789',
      email: 'info@harmonyband.com',
    },
    services: ['Live Music', 'DJ Services', 'Sound System'],
    pricing: {
      liveBand: 35000,
      djService: 25000,
      soundSystem: 15000,
    },
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    rating: 4.8,
    reviews: [],
    verified: true,
    availability: ['Friday', 'Saturday', 'Sunday'],
  },
];

const sampleServices = [
  {
    name: 'Wedding Photography Package',
    description: 'Complete wedding photography coverage',
    category: 'photography',
    price: 45000,
    duration: '8 hours',
    vendor: null, // Will be set after vendor creation
  },
  {
    name: 'Wedding Catering Package',
    description: 'Full catering service for 100 guests',
    category: 'catering',
    price: 250000,
    duration: '1 day',
    vendor: null, // Will be set after vendor creation
  },
  {
    name: 'Live Band Entertainment',
    description: 'Professional live band for wedding reception',
    category: 'entertainment',
    price: 35000,
    duration: '4 hours',
    vendor: null, // Will be set after vendor creation
  },
];

const sampleReviews = [
  {
    user: null, // Will be set after user creation
    venue: null, // Will be set after venue creation
    vendor: null, // Will be set after vendor creation
    rating: 5,
    title: 'Perfect venue for our dream wedding!',
    content: 'The Grand Ballroom exceeded all our expectations. The staff was incredibly helpful, the food was amazing, and the venue looked absolutely stunning.',
    images: ['/placeholder.jpg'],
    helpful: 12,
    verified: true,
  },
  {
    user: null, // Will be set after user creation
    venue: null, // Will be set after venue creation
    vendor: null, // Will be set after vendor creation
    rating: 4,
    title: 'Great venue with minor issues',
    content: 'Overall a wonderful experience. The venue is beautiful and the staff is helpful. Only minor issue was with the sound system during the ceremony.',
    images: [],
    helpful: 5,
    verified: true,
  },
];

const sampleTasks = [
  {
    title: 'Book wedding venue',
    description: 'Research and book the perfect wedding venue',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2024-08-15'),
    assignedTo: null, // Will be set after user creation
    category: 'venue',
  },
  {
    title: 'Hire photographer',
    description: 'Find and book a professional wedding photographer',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2024-09-01'),
    assignedTo: null, // Will be set after user creation
    category: 'photography',
  },
  {
    title: 'Choose wedding cake',
    description: 'Taste and select the perfect wedding cake',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-10-01'),
    assignedTo: null, // Will be set after user creation
    category: 'catering',
  },
];

const sampleClients = [
  {
    name: 'Sarah & Mike Johnson',
    email: 'sarah.mike@example.com',
    phone: '+94 71 987 6543',
    weddingDate: new Date('2024-12-15'),
    budget: 2000000,
    guestCount: 150,
    planner: null, // Will be set after user creation
    status: 'active',
  },
  {
    name: 'Priya & David Patel',
    email: 'priya.david@example.com',
    phone: '+94 71 987 6544',
    weddingDate: new Date('2024-11-20'),
    budget: 1500000,
    guestCount: 100,
    planner: null, // Will be set after user creation
    status: 'active',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Vendor.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Service.deleteMany({}),
      Task.deleteMany({}),
      Client.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create users
    const users: any[] = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Create venues
    const venues = await Venue.create(sampleVenues);
    console.log(`🏛️ Created ${venues.length} venues`);

    // Create vendors
    const vendors = await Vendor.create(sampleVendors);
    console.log(`👨‍💼 Created ${vendors.length} vendors`);

    // Update services with vendor references
    const updatedServices = sampleServices.map((service, index) => ({
      ...service,
      vendor: vendors[index % vendors.length]._id,
    }));
    const services = await Service.create(updatedServices);
    console.log(`🛠️ Created ${services.length} services`);

    // Create reviews
    const reviews: any[] = [];
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = {
        ...sampleReviews[i],
        user: users[i % users.length]._id,
        venue: venues[i % venues.length]._id,
        vendor: vendors[i % vendors.length]._id,
      };
      const review = await Review.create(reviewData);
      reviews.push(review);
    }
    console.log(`⭐ Created ${reviews.length} reviews`);

    // Create tasks
    const updatedTasks = sampleTasks.map((task, index) => ({
      ...task,
      assignedTo: users[index % users.length]._id,
    }));
    const tasks = await Task.create(updatedTasks);
    console.log(`📋 Created ${tasks.length} tasks`);

    // Create clients
    const updatedClients = sampleClients.map((client, index) => ({
      ...client,
      planner: users.find(u => u.role === 'admin')?._id || users[0]._id,
    }));
    const clients = await Client.create(updatedClients);
    console.log(`👫 Created ${clients.length} clients`);

    // Create sample bookings
    const bookings = await Booking.create([
      {
        user: users[0]._id,
        venue: venues[0]._id,
        vendor: vendors[0]._id,
        date: new Date('2024-12-15'),
        time: '18:00',
        guestCount: 150,
        totalAmount: 195000,
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      {
        user: users[1]._id,
        venue: venues[1]._id,
        vendor: vendors[1]._id,
        date: new Date('2024-11-20'),
        time: '19:00',
        guestCount: 100,
        totalAmount: 145000,
        status: 'pending',
        paymentStatus: 'pending',
      },
    ]);
    console.log(`📅 Created ${bookings.length} bookings`);

    // Update venue and vendor ratings
    for (const venue of venues) {
      const venueReviews = reviews.filter(r => r.venue?.toString() === venue._id.toString());
      if (venueReviews.length > 0) {
        const avgRating = venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length;
        await Venue.findByIdAndUpdate(venue._id, { rating: avgRating });
      }
    }

    for (const vendor of vendors) {
      const vendorReviews = reviews.filter(r => r.vendor?.toString() === vendor._id.toString());
      if (vendorReviews.length > 0) {
        const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
        await Vendor.findByIdAndUpdate(vendor._id, { rating: avgRating });
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Venues: ${venues.length}`);
    console.log(`- Vendors: ${vendors.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Clients: ${clients.length}`);
    console.log(`- Bookings: ${bookings.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 