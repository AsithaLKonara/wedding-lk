const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Import all models
const User = require('../lib/models/user');
const Vendor = require('../lib/models/vendor');
const Venue = require('../lib/models/venue');
const Booking = require('../lib/models/booking');
const Payment = require('../lib/models/Payment');
const Review = require('../lib/models/review');
const Task = require('../lib/models/task');
const Post = require('../lib/models/post');
const Message = require('../lib/models/message');
const Notification = require('../lib/models/notification');
const Conversation = require('../lib/models/conversation');
const Service = require('../lib/models/service');
const Document = require('../lib/models/document');
const VenueBoost = require('../lib/models/venueBoost');
const VendorProfile = require('../lib/models/vendorProfile');
const WeddingPlannerProfile = require('../lib/models/weddingPlannerProfile');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper functions
const generateLocation = () => ({
  country: 'Sri Lanka',
  state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province', 'Northern Province']),
  city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Anuradhapura']),
  address: faker.location.streetAddress(),
  zipCode: faker.location.zipCode()
});

const generateContact = () => ({
  phone: `+94${faker.string.numeric(9)}`,
  email: faker.internet.email(),
  website: faker.internet.url()
});

const generatePricing = () => ({
  startingPrice: faker.number.int({ min: 10000, max: 500000 }),
  currency: 'LKR',
  packages: [
    {
      name: 'Basic Package',
      price: faker.number.int({ min: 10000, max: 100000 }),
      features: ['Basic service', 'Standard support', '1 revision']
    },
    {
      name: 'Premium Package',
      price: faker.number.int({ min: 100000, max: 300000 }),
      features: ['Premium service', 'Priority support', '3 revisions', 'Extra features']
    },
    {
      name: 'Luxury Package',
      price: faker.number.int({ min: 300000, max: 500000 }),
      features: ['Luxury service', 'VIP support', 'Unlimited revisions', 'All features']
    }
  ]
});

// Seed Users
const seedUsers = async () => {
  console.log('👥 Seeding users...');
  
  const users = [];
  const roles = ['user', 'vendor', 'wedding_planner', 'admin'];
  
  // Create admin user
  const adminUser = new User({
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    phone: '+94771234567',
    location: generateLocation(),
    isVerified: true,
    isActive: true,
    preferences: {
      language: 'en',
      currency: 'LKR',
      timezone: 'Asia/Colombo',
      notifications: { email: true, sms: false, push: true },
      marketing: { email: false, sms: false, push: false }
    }
  });
  users.push(adminUser);

  // Create regular users
  for (let i = 0; i < 20; i++) {
    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      role: 'user',
      phone: `+94${faker.string.numeric(9)}`,
      location: generateLocation(),
      isVerified: faker.datatype.boolean(0.8),
      isActive: true,
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: faker.datatype.boolean(), sms: false, push: faker.datatype.boolean() }
      }
    });
    users.push(user);
  }

  // Create vendors
  for (let i = 0; i < 15; i++) {
    const vendor = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      role: 'vendor',
      phone: `+94${faker.string.numeric(9)}`,
      location: generateLocation(),
      isVerified: faker.datatype.boolean(0.9),
      isActive: true,
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: false, sms: false, push: false }
      }
    });
    users.push(vendor);
  }

  // Create wedding planners
  for (let i = 0; i < 5; i++) {
    const planner = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      role: 'wedding_planner',
      phone: `+94${faker.string.numeric(9)}`,
      location: generateLocation(),
      isVerified: true,
      isActive: true,
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: false, sms: false, push: false }
      }
    });
    users.push(planner);
  }

  await User.insertMany(users);
  console.log(`✅ Created ${users.length} users`);
  return users;
};

// Seed Vendors
const seedVendors = async (users) => {
  console.log('🏪 Seeding vendors...');
  
  const vendorUsers = users.filter(user => user.role === 'vendor');
  const vendors = [];
  
  const categories = ['photography', 'catering', 'music', 'decorator', 'makeup', 'jewelry', 'clothing', 'transport'];
  
  for (let i = 0; i < vendorUsers.length; i++) {
    const vendorUser = vendorUsers[i];
    const category = categories[i % categories.length];
    
    const vendor = new Vendor({
      name: vendorUser.name,
      businessName: faker.company.name(),
      category,
      description: faker.lorem.paragraph(),
      location: {
        address: vendorUser.location.address,
        city: vendorUser.location.city,
        province: vendorUser.location.state,
        serviceAreas: [vendorUser.location.city, faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle'])]
      },
      contact: {
        phone: vendorUser.phone,
        email: vendorUser.email,
        website: faker.internet.url(),
        socialMedia: {
          facebook: faker.internet.url(),
          instagram: faker.internet.url(),
          youtube: faker.internet.url()
        }
      },
      services: [
        {
          name: `${category} Service 1`,
          description: faker.lorem.sentence(),
          price: faker.number.int({ min: 10000, max: 100000 }),
          duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend'])
        },
        {
          name: `${category} Service 2`,
          description: faker.lorem.sentence(),
          price: faker.number.int({ min: 50000, max: 200000 }),
          duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend'])
        }
      ],
      portfolio: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
      pricing: generatePricing(),
      availability: Array.from({ length: 30 }, (_, index) => ({
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
        isAvailable: faker.datatype.boolean(0.7)
      })),
      rating: {
        average: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
        count: faker.number.int({ min: 5, max: 50 })
      },
      owner: vendorUser._id,
      isVerified: vendorUser.isVerified,
      isActive: true,
      featured: faker.datatype.boolean(0.3),
      onboardingComplete: true,
      subscription: {
        plan: faker.helpers.arrayElement(['basic', 'premium', 'pro']),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    
    vendors.push(vendor);
  }
  
  await Vendor.insertMany(vendors);
  console.log(`✅ Created ${vendors.length} vendors`);
  return vendors;
};

// Seed Venues
const seedVenues = async (users) => {
  console.log('🏛️ Seeding venues...');
  
  const venueUsers = users.filter(user => user.role === 'vendor').slice(0, 10);
  const venues = [];
  
  const venueTypes = ['Hotel', 'Garden', 'Beach', 'Historic', 'Modern', 'Traditional'];
  
  for (let i = 0; i < venueUsers.length; i++) {
    const venueUser = venueUsers[i];
    const venueType = venueTypes[i % venueTypes.length];
    
    const venue = new Venue({
      name: `${venueType} ${faker.company.name()}`,
      description: faker.lorem.paragraphs(2),
      location: {
        address: venueUser.location.address,
        city: venueUser.location.city,
        province: venueUser.location.state,
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        }
      },
      contact: {
        phone: venueUser.phone,
        email: venueUser.email,
        website: faker.internet.url()
      },
      capacity: {
        min: faker.number.int({ min: 50, max: 200 }),
        max: faker.number.int({ min: 200, max: 1000 })
      },
      amenities: faker.helpers.arrayElements([
        'Parking', 'Air Conditioning', 'Sound System', 'Lighting', 'Catering Kitchen',
        'Bridal Suite', 'Groom Room', 'Photography Spots', 'Garden', 'Pool'
      ], { min: 3, max: 8 }),
      pricing: {
        weekday: faker.number.int({ min: 50000, max: 200000 }),
        weekend: faker.number.int({ min: 100000, max: 400000 }),
        currency: 'LKR'
      },
      images: Array.from({ length: faker.number.int({ min: 5, max: 12 }) }, () => faker.image.url()),
      availability: Array.from({ length: 90 }, (_, index) => ({
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
        isAvailable: faker.datatype.boolean(0.6)
      })),
      rating: {
        average: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
        count: faker.number.int({ min: 3, max: 30 })
      },
      owner: venueUser._id,
      isVerified: faker.datatype.boolean(0.8),
      isActive: true,
      featured: faker.datatype.boolean(0.2)
    });
    
    venues.push(venue);
  }
  
  await Venue.insertMany(venues);
  console.log(`✅ Created ${venues.length} venues`);
  return venues;
};

// Seed Bookings
const seedBookings = async (users, vendors, venues) => {
  console.log('📅 Seeding bookings...');
  
  const regularUsers = users.filter(user => user.role === 'user');
  const bookings = [];
  
  for (let i = 0; i < 30; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const vendor = faker.helpers.arrayElement(vendors);
    const venue = faker.helpers.arrayElement(venues);
    
    const booking = new Booking({
      user: user._id,
      vendor: vendor._id,
      venue: venue._id,
      eventType: faker.helpers.arrayElement(['Wedding', 'Engagement', 'Anniversary', 'Birthday']),
      eventDate: faker.date.future(),
      guestCount: faker.number.int({ min: 50, max: 300 }),
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled', 'completed']),
      totalAmount: faker.number.int({ min: 100000, max: 2000000 }),
      currency: 'LKR',
      notes: faker.lorem.sentence(),
      services: vendor.services.slice(0, faker.number.int({ min: 1, max: 3 })).map(service => ({
        serviceId: service._id,
        name: service.name,
        price: service.price,
        quantity: faker.number.int({ min: 1, max: 3 })
      })),
      timeline: [
        {
          date: faker.date.past(),
          event: 'Booking Created',
          description: 'Initial booking request submitted'
        },
        {
          date: faker.date.recent(),
          event: 'Payment Processed',
          description: 'Deposit payment received'
        }
      ]
    });
    
    bookings.push(booking);
  }
  
  await Booking.insertMany(bookings);
  console.log(`✅ Created ${bookings.length} bookings`);
  return bookings;
};

// Seed Payments
const seedPayments = async (users, bookings) => {
  console.log('💳 Seeding payments...');
  
  const payments = [];
  
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const user = users.find(u => u._id.toString() === booking.user.toString());
    
    // Create multiple payments per booking
    const paymentCount = faker.number.int({ min: 1, max: 3 });
    
    for (let j = 0; j < paymentCount; j++) {
      const payment = new Payment({
        user: user._id,
        booking: booking._id,
        amount: faker.number.int({ min: 10000, max: booking.totalAmount / paymentCount }),
        currency: 'LKR',
        status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'refunded']),
        paymentMethod: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'mobile_payment', 'cash']),
        transactionId: faker.string.alphanumeric(20),
        paymentDate: faker.date.recent(),
        description: faker.helpers.arrayElement([
          'Deposit Payment',
          'Final Payment',
          'Additional Services',
          'Venue Booking Fee'
        ])
      });
      
      payments.push(payment);
    }
  }
  
  await Payment.insertMany(payments);
  console.log(`✅ Created ${payments.length} payments`);
  return payments;
};

// Seed Reviews
const seedReviews = async (users, vendors, venues) => {
  console.log('⭐ Seeding reviews...');
  
  const regularUsers = users.filter(user => user.role === 'user');
  const reviews = [];
  
  // Vendor reviews
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const vendor = faker.helpers.arrayElement(vendors);
    
    const review = new Review({
      user: user._id,
      vendor: vendor._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.image.url()),
      isVerified: faker.datatype.boolean(0.7),
      helpful: faker.number.int({ min: 0, max: 10 })
    });
    
    reviews.push(review);
  }
  
  // Venue reviews
  for (let i = 0; i < 30; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const venue = faker.helpers.arrayElement(venues);
    
    const review = new Review({
      user: user._id,
      venue: venue._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.image.url()),
      isVerified: faker.datatype.boolean(0.7),
      helpful: faker.number.int({ min: 0, max: 10 })
    });
    
    reviews.push(review);
  }
  
  await Review.insertMany(reviews);
  console.log(`✅ Created ${reviews.length} reviews`);
  return reviews;
};

// Seed Tasks
const seedTasks = async (users) => {
  console.log('📋 Seeding tasks...');
  
  const planners = users.filter(user => user.role === 'wedding_planner');
  const regularUsers = users.filter(user => user.role === 'user');
  const tasks = [];
  
  for (let i = 0; i < 40; i++) {
    const planner = faker.helpers.arrayElement(planners);
    const user = faker.helpers.arrayElement(regularUsers);
    
    const task = new Task({
      title: faker.helpers.arrayElement([
        'Book photographer',
        'Choose wedding dress',
        'Plan ceremony music',
        'Arrange catering',
        'Book venue',
        'Send invitations',
        'Plan decorations',
        'Organize transportation'
      ]),
      description: faker.lorem.sentence(),
      assignedTo: user._id,
      assignedBy: planner._id,
      priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
      status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled']),
      dueDate: faker.date.future(),
      category: faker.helpers.arrayElement(['planning', 'vendor', 'logistics', 'decorations', 'catering']),
      tags: faker.helpers.arrayElements(['urgent', 'important', 'follow-up', 'review'], { min: 0, max: 3 })
    });
    
    tasks.push(task);
  }
  
  await Task.insertMany(tasks);
  console.log(`✅ Created ${tasks.length} tasks`);
  return tasks;
};

// Seed Conversations and Messages
const seedConversations = async (users) => {
  console.log('💬 Seeding conversations and messages...');
  
  const conversations = [];
  const messages = [];
  
  // Create conversations between users and vendors
  const regularUsers = users.filter(user => user.role === 'user');
  const vendors = users.filter(user => user.role === 'vendor');
  
  for (let i = 0; i < 25; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const vendor = faker.helpers.arrayElement(vendors);
    
    const conversation = new Conversation({
      participants: [user._id, vendor._id],
      type: 'direct',
      lastMessage: faker.lorem.sentence(),
      lastMessageAt: faker.date.recent(),
      isActive: faker.datatype.boolean(0.8)
    });
    
    conversations.push(conversation);
    
    // Create messages for this conversation
    const messageCount = faker.number.int({ min: 3, max: 15 });
    for (let j = 0; j < messageCount; j++) {
      const sender = j % 2 === 0 ? user : vendor;
      
      const message = new Message({
        conversation: conversation._id,
        sender: sender._id,
        content: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(['text', 'image', 'file']),
        isRead: faker.datatype.boolean(0.7),
        attachments: faker.datatype.boolean() ? [faker.image.url()] : []
      });
      
      messages.push(message);
    }
  }
  
  await Conversation.insertMany(conversations);
  await Message.insertMany(messages);
  console.log(`✅ Created ${conversations.length} conversations and ${messages.length} messages`);
  return { conversations, messages };
};

// Seed Notifications
const seedNotifications = async (users) => {
  console.log('🔔 Seeding notifications...');
  
  const notifications = [];
  
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users);
    
    const notification = new Notification({
      user: user._id,
      title: faker.helpers.arrayElement([
        'New booking request',
        'Payment received',
        'Review submitted',
        'Task assigned',
        'Message received',
        'Booking confirmed',
        'Payment reminder'
      ]),
      message: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(['booking', 'payment', 'message', 'task', 'review', 'system']),
      isRead: faker.datatype.boolean(0.6),
      priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
      actionUrl: faker.internet.url()
    });
    
    notifications.push(notification);
  }
  
  await Notification.insertMany(notifications);
  console.log(`✅ Created ${notifications.length} notifications`);
  return notifications;
};

// Seed Posts
const seedPosts = async (users) => {
  console.log('📝 Seeding posts...');
  
  const posts = [];
  
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(users);
    
    const post = new Post({
      author: user._id,
      content: faker.lorem.paragraphs(2),
      images: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }, () => faker.image.url()),
      type: faker.helpers.arrayElement(['text', 'image', 'video', 'event']),
      visibility: faker.helpers.arrayElement(['public', 'followers', 'private']),
      likes: faker.number.int({ min: 0, max: 50 }),
      comments: faker.number.int({ min: 0, max: 20 }),
      shares: faker.number.int({ min: 0, max: 10 }),
      tags: faker.helpers.arrayElements(['wedding', 'photography', 'catering', 'venue', 'planning'], { min: 1, max: 3 })
    });
    
    posts.push(post);
  }
  
  await Post.insertMany(posts);
  console.log(`✅ Created ${posts.length} posts`);
  return posts;
};

// Seed Services
const seedServices = async (vendors) => {
  console.log('🛠️ Seeding services...');
  
  const services = [];
  
  for (let i = 0; i < 100; i++) {
    const vendor = faker.helpers.arrayElement(vendors);
    
    const service = new Service({
      name: faker.helpers.arrayElement([
        'Wedding Photography',
        'Catering Service',
        'Music Entertainment',
        'Floral Arrangements',
        'Makeup Artist',
        'Wedding Dress',
        'Transportation',
        'Venue Decoration'
      ]),
      description: faker.lorem.paragraph(),
      vendor: vendor._id,
      category: vendor.category,
      price: faker.number.int({ min: 10000, max: 500000 }),
      currency: 'LKR',
      duration: faker.helpers.arrayElement(['2 hours', '4 hours', 'Full day', 'Weekend']),
      isActive: faker.datatype.boolean(0.9),
      features: faker.helpers.arrayElements([
        'Professional service',
        'High quality materials',
        'Experienced team',
        'Customizable options',
        '24/7 support'
      ], { min: 2, max: 5 })
    });
    
    services.push(service);
  }
  
  await Service.insertMany(services);
  console.log(`✅ Created ${services.length} services`);
  return services;
};

// Seed Documents
const seedDocuments = async (users) => {
  console.log('📄 Seeding documents...');
  
  const documents = [];
  
  for (let i = 0; i < 30; i++) {
    const user = faker.helpers.arrayElement(users);
    
    const document = new Document({
      user: user._id,
      name: faker.helpers.arrayElement([
        'Wedding Contract',
        'Payment Receipt',
        'Vendor Agreement',
        'Venue Booking Form',
        'Insurance Document',
        'Marriage Certificate',
        'ID Copy',
        'Bank Statement'
      ]),
      type: faker.helpers.arrayElement(['contract', 'receipt', 'certificate', 'agreement', 'form']),
      url: faker.internet.url(),
      size: faker.number.int({ min: 1000, max: 10000000 }),
      mimeType: faker.helpers.arrayElement(['application/pdf', 'image/jpeg', 'image/png', 'application/msword']),
      isVerified: faker.datatype.boolean(0.7),
      uploadedAt: faker.date.recent()
    });
    
    documents.push(document);
  }
  
  await Document.insertMany(documents);
  console.log(`✅ Created ${documents.length} documents`);
  return documents;
};

// Seed Venue Boosts
const seedVenueBoosts = async (venues, users) => {
  console.log('🚀 Seeding venue boosts...');
  
  const boosts = [];
  
  for (let i = 0; i < 15; i++) {
    const venue = faker.helpers.arrayElement(venues);
    const user = faker.helpers.arrayElement(users);
    
    const boost = new VenueBoost({
      venue: venue._id,
      user: user._id,
      type: faker.helpers.arrayElement(['featured', 'sponsored', 'promoted']),
      duration: faker.number.int({ min: 7, max: 30 }),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      cost: faker.number.int({ min: 5000, max: 50000 }),
      currency: 'LKR',
      status: faker.helpers.arrayElement(['active', 'expired', 'pending']),
      impressions: faker.number.int({ min: 100, max: 10000 }),
      clicks: faker.number.int({ min: 10, max: 1000 })
    });
    
    boosts.push(boost);
  }
  
  await VenueBoost.insertMany(boosts);
  console.log(`✅ Created ${boosts.length} venue boosts`);
  return boosts;
};

// Seed Vendor Profiles
const seedVendorProfiles = async (users, vendors) => {
  console.log('👤 Seeding vendor profiles...');
  
  const vendorUsers = users.filter(user => user.role === 'vendor');
  const profiles = [];
  
  for (let i = 0; i < vendorUsers.length; i++) {
    const vendorUser = vendorUsers[i];
    const vendor = vendors[i];
    
    const profile = new VendorProfile({
      user: vendorUser._id,
      vendor: vendor._id,
      bio: faker.lorem.paragraphs(2),
      experience: faker.number.int({ min: 1, max: 20 }),
      specialties: faker.helpers.arrayElements([
        'Wedding Photography',
        'Event Planning',
        'Catering',
        'Music',
        'Decorations',
        'Makeup',
        'Transportation'
      ], { min: 2, max: 5 }),
      portfolio: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => faker.image.url()),
      certifications: faker.helpers.arrayElements([
        'Professional Photography Certificate',
        'Event Planning Certification',
        'Food Safety Certificate',
        'Business License'
      ], { min: 0, max: 3 }),
      languages: faker.helpers.arrayElements(['English', 'Sinhala', 'Tamil'], { min: 1, max: 3 }),
      availability: faker.helpers.arrayElement(['available', 'busy', 'unavailable']),
      responseTime: faker.helpers.arrayElement(['within 1 hour', 'within 24 hours', 'within 48 hours'])
    });
    
    profiles.push(profile);
  }
  
  await VendorProfile.insertMany(profiles);
  console.log(`✅ Created ${profiles.length} vendor profiles`);
  return profiles;
};

// Seed Wedding Planner Profiles
const seedWeddingPlannerProfiles = async (users) => {
  console.log('💒 Seeding wedding planner profiles...');
  
  const planners = users.filter(user => user.role === 'wedding_planner');
  const profiles = [];
  
  for (let i = 0; i < planners.length; i++) {
    const planner = planners[i];
    
    const profile = new WeddingPlannerProfile({
      user: planner._id,
      bio: faker.lorem.paragraphs(3),
      experience: faker.number.int({ min: 2, max: 25 }),
      specialties: faker.helpers.arrayElements([
        'Traditional Weddings',
        'Modern Weddings',
        'Destination Weddings',
        'Small Intimate Weddings',
        'Large Scale Events',
        'Cultural Weddings'
      ], { min: 2, max: 4 }),
      portfolio: Array.from({ length: faker.number.int({ min: 8, max: 20 }) }, () => faker.image.url()),
      certifications: faker.helpers.arrayElements([
        'Certified Wedding Planner',
        'Event Management Certificate',
        'Business Management',
        'Customer Service Excellence'
      ], { min: 1, max: 4 }),
      languages: faker.helpers.arrayElements(['English', 'Sinhala', 'Tamil'], { min: 1, max: 3 }),
      serviceAreas: faker.helpers.arrayElements([
        'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Anuradhapura'
      ], { min: 2, max: 5 }),
      pricing: {
        consultation: faker.number.int({ min: 5000, max: 25000 }),
        fullPlanning: faker.number.int({ min: 50000, max: 200000 }),
        dayOfCoordination: faker.number.int({ min: 25000, max: 100000 }),
        currency: 'LKR'
      },
      availability: faker.helpers.arrayElement(['available', 'busy', 'unavailable']),
      responseTime: faker.helpers.arrayElement(['within 1 hour', 'within 24 hours', 'within 48 hours'])
    });
    
    profiles.push(profile);
  }
  
  await WeddingPlannerProfile.insertMany(profiles);
  console.log(`✅ Created ${profiles.length} wedding planner profiles`);
  return profiles;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      Task.deleteMany({}),
      Post.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Conversation.deleteMany({}),
      Service.deleteMany({}),
      Document.deleteMany({}),
      VenueBoost.deleteMany({}),
      VendorProfile.deleteMany({}),
      WeddingPlannerProfile.deleteMany({})
    ]);
    
    // Seed data in order
    const users = await seedUsers();
    const vendors = await seedVendors(users);
    const venues = await seedVenues(users);
    const bookings = await seedBookings(users, vendors, venues);
    const payments = await seedPayments(users, bookings);
    const reviews = await seedReviews(users, vendors, venues);
    const tasks = await seedTasks(users);
    const { conversations, messages } = await seedConversations(users);
    const notifications = await seedNotifications(users);
    const posts = await seedPosts(users);
    const services = await seedServices(vendors);
    const documents = await seedDocuments(users);
    const venueBoosts = await seedVenueBoosts(venues, users);
    const vendorProfiles = await seedVendorProfiles(users, vendors);
    const weddingPlannerProfiles = await seedWeddingPlannerProfiles(users);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏪 Vendors: ${vendors.length}`);
    console.log(`🏛️ Venues: ${venues.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log(`💬 Conversations: ${conversations.length}`);
    console.log(`📨 Messages: ${messages.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`📝 Posts: ${posts.length}`);
    console.log(`🛠️ Services: ${services.length}`);
    console.log(`📄 Documents: ${documents.length}`);
    console.log(`🚀 Venue Boosts: ${venueBoosts.length}`);
    console.log(`👤 Vendor Profiles: ${vendorProfiles.length}`);
    console.log(`💒 Wedding Planner Profiles: ${weddingPlannerProfiles.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase };
