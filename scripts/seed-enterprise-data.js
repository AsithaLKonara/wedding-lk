const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'vendor', 'wedding_planner'], 
    default: 'user' 
  },
  image: { type: String },
  phone: { type: String },
  address: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  preferences: {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    smsUpdates: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Vendor Schema
const VendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['venue', 'catering', 'photography', 'music', 'flowers', 'transportation', 'decorations', 'other'],
    required: true 
  },
  description: { type: String },
  location: {
    address: { type: String },
    city: { type: String },
    province: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  services: [{
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    isActive: { type: Boolean, default: true }
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  images: [{ type: String }],
  socialMedia: {
    website: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String }
  }
}, { timestamps: true });

// Venue Schema
const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String },
    city: { type: String },
    province: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
}, { timestamps: true });

// Booking Schema
const BookingSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  guestCount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'partial', 'completed'], 
    default: 'pending' 
  },
  specialRequirements: { type: String },
  notes: { type: String }
}, { timestamps: true });

// Task Schema (for planners)
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['venue', 'catering', 'photography', 'music', 'flowers', 'transportation', 'decorations', 'other'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'medium' 
  },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'overdue'], 
    default: 'pending' 
  },
  estimatedHours: { type: Number, default: 1 },
  actualHours: { type: Number },
  notes: { type: String }
}, { timestamps: true });

// Payment Schema
const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'digital_wallet'],
    required: true 
  },
  transactionId: { type: String },
  paymentDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

// Review Schema
const ReviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  images: [{ type: String }]
}, { timestamps: true });

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
const Venue = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Seed data
async function seedEnterpriseData() {
  try {
    await connectDB();
    
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Booking.deleteMany({});
    await Task.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    
    console.log('🌱 Seeding enterprise data...');
    
    // Create admin users
    const adminUsers = [];
    for (let i = 1; i <= 3; i++) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: `Admin ${i}`,
        email: `admin${i}@wedding.lk`,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        phone: `+94 77 ${String(i).padStart(3, '0')} ${String(i).padStart(4, '0')}`,
        address: `Admin Address ${i}, Colombo, Sri Lanka`
      });
      await admin.save();
      adminUsers.push(admin);
      console.log(`✅ Created admin user: admin${i}@wedding.lk`);
    }
    
    // Create regular users
    const regularUsers = [];
    for (let i = 1; i <= 20; i++) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      const user = new User({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        phone: `+94 77 ${String(i).padStart(3, '0')} ${String(i).padStart(4, '0')}`,
        address: `User Address ${i}, Colombo, Sri Lanka`
      });
      await user.save();
      regularUsers.push(user);
    }
    console.log(`✅ Created ${regularUsers.length} regular users`);
    
    // Create vendors
    const vendors = [];
    const categories = ['venue', 'catering', 'photography', 'music', 'flowers', 'transportation', 'decorations'];
    const businessNames = [
      'Royal Wedding Hall', 'Garden Paradise', 'Elegant Events', 'Dream Venues', 'Luxury Halls',
      'Spice Garden Catering', 'Royal Caterers', 'Taste of Paradise', 'Gourmet Delights', 'Feast Masters',
      'Golden Moments Photography', 'Wedding Lens', 'Memory Makers', 'Perfect Shots', 'Eternal Memories',
      'Melody Masters', 'Harmony Band', 'Rhythm & Blues', 'Sound Waves', 'Music Magic',
      'Floral Dreams', 'Bloom & Blossom', 'Garden Fresh', 'Petals & Posies', 'Flower Power',
      'Royal Rides', 'Luxury Transport', 'Wedding Wheels', 'Elegant Cars', 'Classic Rides',
      'Decor Dreams', 'Elegant Designs', 'Wedding Decor', 'Style & Grace', 'Perfect Touch'
    ];
    
    for (let i = 0; i < 35; i++) {
      const category = categories[i % categories.length];
      const hashedPassword = await bcrypt.hash('vendor123', 12);
      const vendor = new Vendor({
        businessName: businessNames[i] || `${category.charAt(0).toUpperCase() + category.slice(1)} ${i + 1}`,
        ownerName: `Vendor Owner ${i + 1}`,
        email: `vendor${i + 1}@example.com`,
        phone: `+94 77 ${String(i + 1).padStart(3, '0')} ${String(i + 1).padStart(4, '0')}`,
        category: category,
        description: `Professional ${category} services for your special day. We provide exceptional quality and attention to detail.`,
        location: {
          address: `Vendor Address ${i + 1}`,
          city: ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna'][i % 5],
          province: ['Western', 'Central', 'Southern', 'Northern', 'Eastern'][i % 5],
          coordinates: {
            lat: 6.9271 + (Math.random() - 0.5) * 0.1,
            lng: 79.8612 + (Math.random() - 0.5) * 0.1
          }
        },
        services: [
          {
            name: `Basic ${category} Package`,
            description: `Standard ${category} services`,
            price: Math.floor(Math.random() * 100000) + 50000,
            isActive: true
          },
          {
            name: `Premium ${category} Package`,
            description: `Premium ${category} services with extras`,
            price: Math.floor(Math.random() * 200000) + 150000,
            isActive: true
          }
        ],
        rating: {
          average: 4.0 + Math.random() * 1.0,
          count: Math.floor(Math.random() * 50) + 10
        },
        isVerified: true,
        isActive: true,
        images: [`/images/vendor-${i + 1}-1.jpg`, `/images/vendor-${i + 1}-2.jpg`],
        socialMedia: {
          website: `https://${businessNames[i].toLowerCase().replace(/\s+/g, '')}.lk`,
          facebook: `https://facebook.com/${businessNames[i].toLowerCase().replace(/\s+/g, '')}`,
          instagram: `https://instagram.com/${businessNames[i].toLowerCase().replace(/\s+/g, '')}`
        }
      });
      await vendor.save();
      vendors.push(vendor);
    }
    console.log(`✅ Created ${vendors.length} vendors`);
    
    // Create venues
    const venues = [];
    for (let i = 0; i < 25; i++) {
      const venue = new Venue({
        name: `Venue ${i + 1}`,
        description: `Beautiful venue perfect for weddings and special events. Features modern amenities and stunning views.`,
        capacity: Math.floor(Math.random() * 200) + 50,
        price: Math.floor(Math.random() * 300000) + 100000,
        location: {
          address: `Venue Address ${i + 1}`,
          city: ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna'][i % 5],
          province: ['Western', 'Central', 'Southern', 'Northern', 'Eastern'][i % 5],
          coordinates: {
            lat: 6.9271 + (Math.random() - 0.5) * 0.1,
            lng: 79.8612 + (Math.random() - 0.5) * 0.1
          }
        },
        amenities: ['Air Conditioning', 'Parking', 'Catering Kitchen', 'Sound System', 'Lighting', 'Restrooms'],
        images: [`/images/venue-${i + 1}-1.jpg`, `/images/venue-${i + 1}-2.jpg`],
        isAvailable: true,
        rating: {
          average: 4.0 + Math.random() * 1.0,
          count: Math.floor(Math.random() * 30) + 5
        },
        vendor: vendors[i % vendors.length]._id
      });
      await venue.save();
      venues.push(venue);
    }
    console.log(`✅ Created ${venues.length} venues`);
    
    // Create bookings
    const bookings = [];
    for (let i = 0; i < 50; i++) {
      const client = regularUsers[i % regularUsers.length];
      const vendor = vendors[i % vendors.length];
      const venue = venues[i % venues.length];
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 180) + 30);
      
      const booking = new Booking({
        client: client._id,
        vendor: vendor._id,
        venue: venue._id,
        service: vendor.services[0].name,
        date: eventDate,
        startTime: `${Math.floor(Math.random() * 8) + 10}:00`,
        endTime: `${Math.floor(Math.random() * 6) + 18}:00`,
        guestCount: Math.floor(Math.random() * 100) + 20,
        totalAmount: Math.floor(Math.random() * 200000) + 50000,
        status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        paymentStatus: ['pending', 'partial', 'completed'][Math.floor(Math.random() * 3)],
        specialRequirements: i % 3 === 0 ? `Special requirements for booking ${i + 1}` : undefined,
        notes: `Booking notes for ${client.name}`
      });
      await booking.save();
      bookings.push(booking);
    }
    console.log(`✅ Created ${bookings.length} bookings`);
    
    // Create tasks (for planners)
    const tasks = [];
    for (let i = 0; i < 30; i++) {
      const client = regularUsers[i % regularUsers.length];
      const task = new Task({
        title: `Task ${i + 1}`,
        description: `Wedding planning task for ${client.name}`,
        client: client._id,
        planner: adminUsers[0]._id, // Assign to first admin as planner
        category: categories[i % categories.length],
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: ['pending', 'in_progress', 'completed', 'overdue'][Math.floor(Math.random() * 4)],
        estimatedHours: Math.floor(Math.random() * 8) + 1,
        actualHours: Math.floor(Math.random() * 10) + 1,
        notes: `Task notes for ${client.name}`
      });
      await task.save();
      tasks.push(task);
    }
    console.log(`✅ Created ${tasks.length} tasks`);
    
    // Create payments
    const payments = [];
    for (let i = 0; i < 40; i++) {
      const booking = bookings[i % bookings.length];
      const payment = new Payment({
        booking: booking._id,
        client: booking.client,
        vendor: booking.vendor,
        amount: booking.totalAmount,
        currency: 'LKR',
        status: ['pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 4)],
        paymentMethod: ['credit_card', 'debit_card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 4)],
        transactionId: `TXN${String(i + 1).padStart(6, '0')}`,
        paymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        notes: `Payment for booking ${i + 1}`
      });
      await payment.save();
      payments.push(payment);
    }
    console.log(`✅ Created ${payments.length} payments`);
    
    // Create reviews
    const reviews = [];
    for (let i = 0; i < 25; i++) {
      const client = regularUsers[i % regularUsers.length];
      const vendor = vendors[i % vendors.length];
      const venue = venues[i % venues.length];
      const booking = bookings[i % bookings.length];
      
      const review = new Review({
        client: client._id,
        vendor: vendor._id,
        venue: venue._id,
        booking: booking._id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        review: `Excellent service! ${vendor.businessName} provided outstanding ${vendor.category} services for our wedding. Highly recommended!`,
        isVerified: Math.random() > 0.2, // 80% verified
        helpful: Math.floor(Math.random() * 10),
        images: [`/images/review-${i + 1}-1.jpg`]
      });
      await review.save();
      reviews.push(review);
    }
    console.log(`✅ Created ${reviews.length} reviews`);
    
    console.log('\n🎉 Enterprise data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${adminUsers.length} Admin users`);
    console.log(`   - ${regularUsers.length} Regular users`);
    console.log(`   - ${vendors.length} Vendors`);
    console.log(`   - ${venues.length} Venues`);
    console.log(`   - ${bookings.length} Bookings`);
    console.log(`   - ${tasks.length} Tasks`);
    console.log(`   - ${payments.length} Payments`);
    console.log(`   - ${reviews.length} Reviews`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin1@wedding.lk / admin123');
    console.log('   User: user1@example.com / user123');
    console.log('   Vendor: vendor1@example.com / vendor123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding
seedEnterpriseData();
