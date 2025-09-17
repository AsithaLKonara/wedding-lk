const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function createReviews() {
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

    // Create vendor reviews
    const vendorReviews = [
      {
        user: users[0]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[0]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Excellent service! The photographer captured every special moment beautifully. Highly recommended!",
        images: ["https://images.unsplash.com/photo-1519167758481-83f1426e4b3e?w=400"],
        createdAt: new Date('2024-01-15')
      },
      {
        user: users[1]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[0]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Great photographer with professional equipment. Very satisfied with the results.",
        images: [],
        createdAt: new Date('2024-02-10')
      },
      {
        user: users[2]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[1]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Amazing catering service! The food was delicious and presentation was perfect.",
        images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400"],
        createdAt: new Date('2024-01-20')
      },
      {
        user: users[3]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[1]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Good food quality and timely service. Would recommend for wedding catering.",
        images: [],
        createdAt: new Date('2024-02-05')
      },
      {
        user: users[4]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[2]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Fantastic music and entertainment! The band kept everyone dancing all night.",
        images: [],
        createdAt: new Date('2024-01-25')
      },
      {
        user: users[5]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[2]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Great musicians with excellent song selection. Made our wedding memorable.",
        images: [],
        createdAt: new Date('2024-02-15')
      },
      {
        user: users[6]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[3]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Professional transport service. Clean vehicles and punctual drivers.",
        images: [],
        createdAt: new Date('2024-01-30')
      },
      {
        user: users[7]?._id || new mongoose.Types.ObjectId(),
        vendor: vendors[4]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Beautiful decorations that transformed our venue. Creative and elegant designs.",
        images: ["https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400"],
        createdAt: new Date('2024-02-20')
      }
    ];

    // Create venue reviews
    const venueReviews = [
      {
        user: users[0]?._id || new mongoose.Types.ObjectId(),
        venue: venues[0]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Stunning ballroom with excellent facilities. Perfect for large weddings.",
        images: [],
        createdAt: new Date('2024-01-10')
      },
      {
        user: users[1]?._id || new mongoose.Types.ObjectId(),
        venue: venues[0]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Beautiful venue with great city views. Staff was very helpful.",
        images: [],
        createdAt: new Date('2024-02-08')
      },
      {
        user: users[2]?._id || new mongoose.Types.ObjectId(),
        venue: venues[1]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Magical beachfront setting! Perfect for romantic beach weddings.",
        images: ["https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400"],
        createdAt: new Date('2024-01-18')
      },
      {
        user: users[3]?._id || new mongoose.Types.ObjectId(),
        venue: venues[1]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Beautiful beach location with great amenities. Highly recommended.",
        images: [],
        createdAt: new Date('2024-02-12')
      },
      {
        user: users[4]?._id || new mongoose.Types.ObjectId(),
        venue: venues[2]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Charming garden estate with lush tropical gardens. Perfect for intimate weddings.",
        images: [],
        createdAt: new Date('2024-01-22')
      },
      {
        user: users[5]?._id || new mongoose.Types.ObjectId(),
        venue: venues[3]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Breathtaking mountain views and cool climate. Great for destination weddings.",
        images: [],
        createdAt: new Date('2024-02-18')
      },
      {
        user: users[6]?._id || new mongoose.Types.ObjectId(),
        venue: venues[4]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Historic colonial mansion with vintage charm. Perfect for classic weddings.",
        images: [],
        createdAt: new Date('2024-01-28')
      }
    ];

    // Create package reviews
    const packageReviews = [
      {
        user: users[0]?._id || new mongoose.Types.ObjectId(),
        package: packages[0]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Complete wedding package exceeded our expectations! Everything was perfect.",
        images: [],
        createdAt: new Date('2024-01-12')
      },
      {
        user: users[1]?._id || new mongoose.Types.ObjectId(),
        vendor: packages[0]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Great value for money. All-inclusive package made planning easy.",
        images: [],
        createdAt: new Date('2024-02-14')
      },
      {
        user: users[2]?._id || new mongoose.Types.ObjectId(),
        package: packages[1]?._id || new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Romantic beach wedding package was absolutely perfect! Dream come true.",
        images: ["https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400"],
        createdAt: new Date('2024-01-16')
      },
      {
        user: users[3]?._id || new mongoose.Types.ObjectId(),
        package: packages[1]?._id || new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Beautiful beach setting with tropical theme. Highly recommended package.",
        images: [],
        createdAt: new Date('2024-02-22')
      }
    ];

    // Create Review model
    const ReviewSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
      package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
      images: [{ type: String }],
      createdAt: { type: Date, default: Date.now }
    });

    const Review = mongoose.model('Review', ReviewSchema);

    // Save vendor reviews
    for (const reviewData of vendorReviews) {
      try {
        const review = new Review(reviewData);
        await review.save();
        console.log(`✅ Created vendor review: ${reviewData.comment.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Failed to create vendor review:`, error.message);
      }
    }

    // Save venue reviews
    for (const reviewData of venueReviews) {
      try {
        const review = new Review(reviewData);
        await review.save();
        console.log(`✅ Created venue review: ${reviewData.comment.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Failed to create venue review:`, error.message);
      }
    }

    // Save package reviews
    for (const reviewData of packageReviews) {
      try {
        const review = new Review(reviewData);
        await review.save();
        console.log(`✅ Created package review: ${reviewData.comment.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Failed to create package review:`, error.message);
      }
    }

    console.log('🎉 Review creation completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createReviews();
