const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function createBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get existing data
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const Venue = mongoose.model('Venue', new mongoose.Schema({}, { strict: false }));
    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

    const users = await User.find().limit(10);
    const vendors = await Vendor.find().limit(5);
    const venues = await Venue.find().limit(5);
    const packages = await Package.find().limit(2);

    console.log(`Found ${users.length} users, ${vendors.length} vendors, ${venues.length} venues, ${packages.length} packages`);

    const bookings = [
      {
        user: users[0]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[0]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Wedding Photography Package",
          description: "Full day wedding photography with edited photos",
          price: 150000,
          duration: "8 hours"
        },
        eventDate: new Date('2024-06-15'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 150000,
        currency: "LKR",
        notes: "Outdoor ceremony and indoor reception",
        createdAt: new Date('2024-01-10')
      },
      {
        user: users[1]?._id || new mongoose.Types.ObjectId(),
        venue: venues[0]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Grand Ballroom Rental",
          description: "Full day venue rental with catering kitchen access",
          price: 250000,
          duration: "12 hours"
        },
        eventDate: new Date('2024-07-20'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 250000,
        currency: "LKR",
        notes: "Wedding ceremony and reception for 200 guests",
        createdAt: new Date('2024-01-15')
      },
      {
        user: users[2]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[1]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Wedding Catering Service",
          description: "Buffet dinner for 150 guests with dessert",
          price: 180000,
          duration: "4 hours"
        },
        eventDate: new Date('2024-08-10'),
        status: "pending",
        paymentStatus: "pending",
        totalAmount: 180000,
        currency: "LKR",
        notes: "Vegetarian and non-vegetarian options required",
        createdAt: new Date('2024-01-20')
      },
      {
        user: users[3]?._id || new mongoose.Types.ObjectId(),
        venue: venues[1]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Beachfront Wedding Venue",
          description: "Beachfront venue rental with changing rooms",
          price: 180000,
          duration: "8 hours"
        },
        eventDate: new Date('2024-09-05'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 180000,
        currency: "LKR",
        notes: "Sunset ceremony on the beach",
        createdAt: new Date('2024-01-25')
      },
      {
        user: users[4]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[2]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Live Music Performance",
          description: "4-piece band with sound system",
          price: 120000,
          duration: "6 hours"
        },
        eventDate: new Date('2024-10-12'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 120000,
        currency: "LKR",
        notes: "Mix of English and Sinhala songs",
        createdAt: new Date('2024-02-01')
      },
      {
        user: users[5]?._id || new mongoose.Types.ObjectId(),
        package: packages[0]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Complete Wedding Package",
          description: "All-inclusive wedding package with venue, catering, photography, and decoration",
          price: 1500000,
          duration: "Full day"
        },
        eventDate: new Date('2024-11-18'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 1500000,
        currency: "LKR",
        notes: "Complete wedding package for 100 guests",
        createdAt: new Date('2024-02-05')
      },
      {
        user: users[6]?._id || new mongoose.Types.ObjectId(),
        venue: venues[2]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Garden Villa Estate Rental",
          description: "Garden estate rental with natural setting",
          price: 120000,
          duration: "10 hours"
        },
        eventDate: new Date('2024-12-08'),
        status: "pending",
        paymentStatus: "pending",
        totalAmount: 120000,
        currency: "LKR",
        notes: "Intimate garden wedding for 50 guests",
        createdAt: new Date('2024-02-10')
      },
      {
        user: users[7]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[3]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Wedding Transport Service",
          description: "Bridal car and guest transport",
          price: 80000,
          duration: "6 hours"
        },
        eventDate: new Date('2024-12-25'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 80000,
        currency: "LKR",
        notes: "White luxury car for bride and groom",
        createdAt: new Date('2024-02-15')
      },
      {
        user: users[8]?._id || new mongoose.Types.ObjectId(),
        package: packages[1]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Beach Wedding Package",
          description: "Romantic beach wedding package with ocean views",
          price: 1200000,
          duration: "Full day"
        },
        eventDate: new Date('2025-01-14'),
        status: "confirmed",
        paymentStatus: "paid",
        totalAmount: 1200000,
        currency: "LKR",
        notes: "Beach wedding package for 80 guests",
        createdAt: new Date('2024-02-20')
      },
      {
        user: users[9]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[4]?._id || new mongoose.Types.ObjectId(),
        service: {
          name: "Wedding Decoration Service",
          description: "Complete venue decoration with flowers and lighting",
          price: 200000,
          duration: "8 hours"
        },
        eventDate: new Date('2025-02-14'),
        status: "pending",
        paymentStatus: "pending",
        totalAmount: 200000,
        currency: "LKR",
        notes: "Romantic theme with red and white flowers",
        createdAt: new Date('2024-02-25')
      }
    ];

    // Create Booking model
    const BookingSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
      package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
      service: {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        duration: { type: String }
      },
      eventDate: { type: Date, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
        default: 'pending' 
      },
      paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'refunded'], 
        default: 'pending' 
      },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'LKR' },
      notes: { type: String },
      createdAt: { type: Date, default: Date.now }
    });

    const Booking = mongoose.model('Booking', BookingSchema);

    // Save bookings
    for (const bookingData of bookings) {
      try {
        const booking = new Booking(bookingData);
        await booking.save();
        console.log(`✅ Created booking: ${bookingData.service.name} for ${bookingData.eventDate.toDateString()}`);
      } catch (error) {
        console.error(`❌ Failed to create booking:`, error.message);
      }
    }

    console.log('🎉 Booking creation completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createBookings();
