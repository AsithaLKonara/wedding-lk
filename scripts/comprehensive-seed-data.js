const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(MONGODB_URI);

// Collections
let db;
let users, vendors, venues, bookings, payments, reviews, tasks, posts, conversations, notifications;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('weddinglk');
    
    // Get collections
    users = db.collection('users');
    vendors = db.collection('vendors');
    venues = db.collection('venues');
    bookings = db.collection('bookings');
    payments = db.collection('payments');
    reviews = db.collection('reviews');
    tasks = db.collection('tasks');
    posts = db.collection('posts');
    conversations = db.collection('conversations');
    notifications = db.collection('notifications');
    
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Generate users with different roles
async function seedUsers() {
  console.log('👥 Seeding users...');
  
  const userRoles = ['user', 'vendor', 'wedding_planner', 'admin'];
  const usersData = [];
  
  // Create admin user
  usersData.push({
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.8.8.8', // password123
    role: 'admin',
    isActive: true,
    isVerified: true,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date()
  });
  
  // Create test users
  for (let i = 0; i < 50; i++) {
    const role = userRoles[Math.floor(Math.random() * userRoles.length)];
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.8.8.8',
      role: role,
      isActive: true,
      isVerified: Math.random() > 0.2,
      status: 'active',
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      location: {
        city: faker.location.city(),
        province: faker.location.state(),
        address: faker.location.streetAddress()
      },
      preferences: {
        budget: faker.number.int({ min: 100000, max: 2000000 }),
        guestCount: faker.number.int({ min: 50, max: 500 }),
        style: faker.helpers.arrayElement(['Traditional', 'Modern', 'Rustic', 'Luxury', 'Minimalist'])
      },
      favorites: {
        venues: [],
        vendors: [],
        packages: []
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      lastActiveAt: faker.date.recent()
    });
  }
  
  await users.insertMany(usersData);
  console.log(`✅ Created ${usersData.length} users`);
  return usersData;
}

// Generate vendors
async function seedVendors(userIds) {
  console.log('🏢 Seeding vendors...');
  
  const categories = [
    'Photography', 'Videography', 'Catering', 'Music', 'Flowers', 
    'Decoration', 'Transportation', 'Makeup', 'Hair', 'DJ', 'Band'
  ];
  
  const vendorsData = [];
  const vendorUserIds = userIds.filter((_, index) => index % 4 === 1); // Every 4th user is a vendor
  
  for (let i = 0; i < vendorUserIds.length; i++) {
    const userId = vendorUserIds[i];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    vendorsData.push({
      userId: userId,
      businessName: faker.company.name(),
      category: category,
      description: faker.lorem.paragraph(),
      location: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        coordinates: {
          lat: parseFloat(faker.location.latitude()),
          lng: parseFloat(faker.location.longitude())
        }
      },
      contact: {
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url()
      },
      email: faker.internet.email(), // Add email field for vendor
      services: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 10000, max: 100000 })
      })),
      portfolio: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => 
        faker.image.url({ width: 400, height: 300 })
      ),
      pricing: {
        startingPrice: faker.number.int({ min: 50000, max: 500000 }),
        currency: 'LKR',
        packages: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.number.int({ min: 100000, max: 800000 }),
          includes: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => 
            faker.lorem.words(3)
          )
        }))
      },
      rating: {
        average: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })),
        count: faker.number.int({ min: 0, max: 50 })
      },
      experience: faker.number.int({ min: 1, max: 20 }),
      awards: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => 
        faker.lorem.words(2)
      ),
      availability: {
        isAvailable: faker.datatype.boolean(),
        nextAvailableDate: faker.date.future()
      },
      isActive: true,
      isVerified: Math.random() > 0.3,
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await vendors.insertMany(vendorsData);
  console.log(`✅ Created ${vendorsData.length} vendors`);
  return vendorsData;
}

// Generate venues
async function seedVenues(userIds) {
  console.log('🏰 Seeding venues...');
  
  const venueTypes = ['Hotel', 'Garden', 'Beach', 'Historic', 'Modern', 'Rustic', 'Luxury'];
  const venuesData = [];
  const venueUserIds = userIds.filter((_, index) => index % 5 === 2); // Every 5th user owns a venue
  
  for (let i = 0; i < venueUserIds.length; i++) {
    const userId = venueUserIds[i];
    const venueType = venueTypes[Math.floor(Math.random() * venueTypes.length)];
    
    venuesData.push({
      userId: userId,
      name: `${faker.company.name()} ${venueType} Venue`,
      description: faker.lorem.paragraphs(2),
      email: faker.internet.email(), // Add email field for venue
      location: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        coordinates: {
          lat: parseFloat(faker.location.latitude()),
          lng: parseFloat(faker.location.longitude())
        }
      },
      capacity: {
        min: faker.number.int({ min: 50, max: 200 }),
        max: faker.number.int({ min: 200, max: 1000 })
      },
      pricing: {
        basePrice: faker.number.int({ min: 100000, max: 1000000 }),
        currency: 'LKR',
        packages: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.number.int({ min: 150000, max: 1200000 }),
          includes: Array.from({ length: faker.number.int({ min: 4, max: 10 }) }, () => 
            faker.lorem.words(3)
          )
        }))
      },
      amenities: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => 
        faker.lorem.words(2)
      ),
      images: Array.from({ length: faker.number.int({ min: 8, max: 20 }) }, () => 
        faker.image.url({ width: 800, height: 600 })
      ),
      rating: {
        average: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })),
        count: faker.number.int({ min: 0, max: 100 })
      },
      featured: Math.random() > 0.7,
      isActive: true,
      isVerified: Math.random() > 0.2,
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await venues.insertMany(venuesData);
  console.log(`✅ Created ${venuesData.length} venues`);
  return venuesData;
}

// Generate bookings
async function seedBookings(userIds, vendorIds, venueIds) {
  console.log('📅 Seeding bookings...');
  
  const bookingsData = [];
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  
  for (let i = 0; i < 200; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    const venueId = venueIds[Math.floor(Math.random() * venueIds.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    bookingsData.push({
      userId: userId,
      vendorId: vendorId,
      venueId: venueId,
      eventDate: faker.date.future(),
      eventTime: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']),
      guestCount: faker.number.int({ min: 50, max: 500 }),
      totalAmount: faker.number.int({ min: 100000, max: 2000000 }),
      status: status,
      specialRequirements: faker.lorem.sentence(),
      contactPhone: faker.phone.number(),
      contactEmail: faker.internet.email(),
      paymentMethod: faker.helpers.arrayElement(['card', 'bank', 'cash']),
      notes: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await bookings.insertMany(bookingsData);
  console.log(`✅ Created ${bookingsData.length} bookings`);
  return bookingsData;
}

// Generate payments
async function seedPayments(userIds, bookingIds) {
  console.log('💳 Seeding payments...');
  
  const paymentsData = [];
  const statuses = ['pending', 'completed', 'failed', 'refunded'];
  
  for (let i = 0; i < 150; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const bookingId = bookingIds[Math.floor(Math.random() * bookingIds.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    paymentsData.push({
      userId: userId,
      bookingId: bookingId,
      amount: faker.number.int({ min: 50000, max: 1000000 }),
      currency: 'LKR',
      paymentMethod: faker.helpers.arrayElement(['card', 'bank', 'cash']),
      status: status,
      transactionId: `TXN${Date.now()}${i}`,
      paymentDate: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await payments.insertMany(paymentsData);
  console.log(`✅ Created ${paymentsData.length} payments`);
  return paymentsData;
}

// Generate reviews
async function seedReviews(userIds, vendorIds, venueIds) {
  console.log('⭐ Seeding reviews...');
  
  const reviewsData = [];
  
  // Reviews for vendors
  for (let i = 0; i < 100; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    
    reviewsData.push({
      userId: userId,
      vendorId: vendorId,
      itemType: 'vendor',
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
        faker.image.url({ width: 400, height: 300 })
      ),
      isVerified: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  // Reviews for venues
  for (let i = 0; i < 80; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const venueId = venueIds[Math.floor(Math.random() * venueIds.length)];
    
    reviewsData.push({
      userId: userId,
      venueId: venueId,
      itemType: 'venue',
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
        faker.image.url({ width: 400, height: 300 })
      ),
      isVerified: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await reviews.insertMany(reviewsData);
  console.log(`✅ Created ${reviewsData.length} reviews`);
  return reviewsData;
}

// Generate tasks
async function seedTasks(userIds) {
  console.log('📋 Seeding tasks...');
  
  const tasksData = [];
  const categories = ['Planning', 'Venue', 'Catering', 'Photography', 'Music', 'Decoration', 'Transportation'];
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  const priorities = ['low', 'medium', 'high'];
  
  for (let i = 0; i < 100; i++) {
    const assignedTo = userIds[Math.floor(Math.random() * userIds.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    tasksData.push({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      category: category,
      status: status,
      priority: priority,
      assignedTo: assignedTo,
      dueDate: faker.date.future(),
      completedAt: status === 'completed' ? faker.date.past() : null,
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await tasks.insertMany(tasksData);
  console.log(`✅ Created ${tasksData.length} tasks`);
  return tasksData;
}

// Generate posts
async function seedPosts(userIds) {
  console.log('📝 Seeding posts...');
  
  const postsData = [];
  const postTypes = ['venue_showcase', 'vendor_work', 'wedding_story', 'tip', 'announcement'];
  
  for (let i = 0; i < 50; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
    
    postsData.push({
      userId: userId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      type: postType,
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
        faker.image.url({ width: 800, height: 600 })
      ),
      likes: faker.number.int({ min: 0, max: 100 }),
      comments: faker.number.int({ min: 0, max: 20 }),
      shares: faker.number.int({ min: 0, max: 10 }),
      isActive: true,
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await posts.insertMany(postsData);
  console.log(`✅ Created ${postsData.length} posts`);
  return postsData;
}

// Generate conversations
async function seedConversations(userIds) {
  console.log('💬 Seeding conversations...');
  
  const conversationsData = [];
  
  for (let i = 0; i < 30; i++) {
    const participants = faker.helpers.arrayElements(userIds, 2);
    
    conversationsData.push({
      participants: participants,
      lastMessage: faker.lorem.sentence(),
      lastMessageAt: faker.date.past(),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await conversations.insertMany(conversationsData);
  console.log(`✅ Created ${conversationsData.length} conversations`);
  return conversationsData;
}

// Generate notifications
async function seedNotifications(userIds) {
  console.log('🔔 Seeding notifications...');
  
  const notificationsData = [];
  const types = ['booking', 'payment', 'review', 'message', 'system', 'promotion'];
  
  for (let i = 0; i < 200; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    notificationsData.push({
      userId: userId,
      type: type,
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      isRead: faker.datatype.boolean(),
      data: {
        action: faker.helpers.arrayElement(['view', 'book', 'contact', 'review']),
        itemId: faker.database.mongodbObjectId(),
        itemType: faker.helpers.arrayElement(['venue', 'vendor', 'booking', 'payment'])
      },
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }
  
  await notifications.insertMany(notificationsData);
  console.log(`✅ Created ${notificationsData.length} notifications`);
  return notificationsData;
}

// Update user favorites with actual IDs
async function updateUserFavorites(userIds, vendorIds, venueIds) {
  console.log('❤️ Updating user favorites...');
  
  for (const userId of userIds) {
    const favoriteVenues = faker.helpers.arrayElements(venueIds, faker.number.int({ min: 0, max: 5 }));
    const favoriteVendors = faker.helpers.arrayElements(vendorIds, faker.number.int({ min: 0, max: 5 }));
    
    await users.updateOne(
      { _id: userId },
      { 
        $set: { 
          'favorites.venues': favoriteVenues,
          'favorites.vendors': favoriteVendors
        }
      }
    );
  }
  
  console.log('✅ Updated user favorites');
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🚀 Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      users.deleteMany({}),
      vendors.deleteMany({}),
      venues.deleteMany({}),
      bookings.deleteMany({}),
      payments.deleteMany({}),
      reviews.deleteMany({}),
      tasks.deleteMany({}),
      posts.deleteMany({}),
      conversations.deleteMany({}),
      notifications.deleteMany({})
    ]);
    
    // Seed data in order
    const userIds = (await seedUsers()).map(user => user._id);
    const vendorIds = (await seedVendors(userIds)).map(vendor => vendor._id);
    const venueIds = (await seedVenues(userIds)).map(venue => venue._id);
    const bookingIds = (await seedBookings(userIds, vendorIds, venueIds)).map(booking => booking._id);
    const paymentIds = (await seedPayments(userIds, bookingIds)).map(payment => payment._id);
    const reviewIds = (await seedReviews(userIds, vendorIds, venueIds)).map(review => review._id);
    const taskIds = (await seedTasks(userIds)).map(task => task._id);
    const postIds = (await seedPosts(userIds)).map(post => post._id);
    const conversationIds = (await seedConversations(userIds)).map(conv => conv._id);
    const notificationIds = (await seedNotifications(userIds)).map(notif => notif._id);
    
    // Update relationships
    await updateUserFavorites(userIds, vendorIds, venueIds);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Users: ${userIds.length}`);
    console.log(`   Vendors: ${vendorIds.length}`);
    console.log(`   Venues: ${venueIds.length}`);
    console.log(`   Bookings: ${bookingIds.length}`);
    console.log(`   Payments: ${paymentIds.length}`);
    console.log(`   Reviews: ${reviewIds.length}`);
    console.log(`   Tasks: ${taskIds.length}`);
    console.log(`   Posts: ${postIds.length}`);
    console.log(`   Conversations: ${conversationIds.length}`);
    console.log(`   Notifications: ${notificationIds.length}`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
