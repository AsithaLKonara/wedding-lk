const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function createVenues() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get existing users to use as owners
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('No users found. Creating venues without owner references...');
    }

    const venues = [
      {
        name: "Grand Ballroom Colombo",
        description: "Elegant ballroom in the heart of Colombo with stunning city views and modern amenities. Perfect for grand wedding celebrations with space for up to 500 guests.",
        location: {
          address: "123 Independence Avenue, Colombo 07",
          city: "Colombo",
          province: "Western Province",
          coordinates: {
            lat: 6.9271,
            lng: 79.8612
          }
        },
        capacity: {
          min: 50,
          max: 500
        },
        pricing: {
          basePrice: 250000,
          currency: "LKR",
          pricePerGuest: 2500
        },
        amenities: ["Air Conditioning", "Parking", "Catering Kitchen", "Bridal Suite", "Sound System", "Lighting"],
        images: [
          "https://images.unsplash.com/photo-1519167758481-83f1426e4b3e?w=800",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
        ],
        availability: [
          { date: new Date('2024-12-25'), isAvailable: false },
          { date: new Date('2024-12-31'), isAvailable: false }
        ],
        rating: {
          average: 4.8,
          count: 25
        },
        reviews: [],
        owner: users.length > 0 ? users[0]._id : new mongoose.Types.ObjectId(),
        isActive: true,
        featured: true
      },
      {
        name: "Beachfront Paradise",
        description: "Stunning beachfront venue with panoramic ocean views. Perfect for romantic beach weddings with direct beach access and tropical ambiance.",
        location: {
          address: "456 Beach Road, Negombo",
          city: "Negombo",
          province: "Western Province",
          coordinates: {
            lat: 7.2086,
            lng: 79.8358
          }
        },
        capacity: {
          min: 30,
          max: 200
        },
        pricing: {
          basePrice: 180000,
          currency: "LKR",
          pricePerGuest: 2000
        },
        amenities: ["Beach Access", "Open Air", "Parking", "Restrooms", "Changing Rooms", "Sound System"],
        images: [
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800"
        ],
        availability: [],
        rating: {
          average: 4.6,
          count: 18
        },
        reviews: [],
        owner: users.length > 1 ? users[1]._id : new mongoose.Types.ObjectId(),
        isActive: true,
        featured: true
      },
      {
        name: "Garden Villa Estate",
        description: "Beautiful garden estate with lush tropical gardens and colonial architecture. Ideal for intimate garden weddings with natural beauty.",
        location: {
          address: "789 Plantation Road, Kandy",
          city: "Kandy",
          province: "Central Province",
          coordinates: {
            lat: 7.2906,
            lng: 80.6337
          }
        },
        capacity: {
          min: 20,
          max: 150
        },
        pricing: {
          basePrice: 120000,
          currency: "LKR",
          pricePerGuest: 1500
        },
        amenities: ["Garden Setting", "Parking", "Restrooms", "Changing Rooms", "Natural Lighting"],
        images: [
          "https://images.unsplash.com/photo-1519167758481-83f1426e4b3e?w=800",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
        ],
        availability: [],
        rating: {
          average: 4.4,
          count: 12
        },
        reviews: [],
        owner: users.length > 2 ? users[2]._id : new mongoose.Types.ObjectId(),
        isActive: true,
        featured: false
      },
      {
        name: "Mountain View Resort",
        description: "Scenic mountain resort with breathtaking hill country views. Perfect for destination weddings with cool climate and stunning landscapes.",
        location: {
          address: "321 Hill Station Road, Nuwara Eliya",
          city: "Nuwara Eliya",
          province: "Central Province",
          coordinates: {
            lat: 6.9497,
            lng: 80.7891
          }
        },
        capacity: {
          min: 25,
          max: 100
        },
        pricing: {
          basePrice: 150000,
          currency: "LKR",
          pricePerGuest: 3000
        },
        amenities: ["Mountain Views", "Accommodation", "Restaurant", "Parking", "Conference Room"],
        images: [
          "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
        ],
        availability: [],
        rating: {
          average: 4.7,
          count: 8
        },
        reviews: [],
        owner: users.length > 3 ? users[3]._id : new mongoose.Types.ObjectId(),
        isActive: true,
        featured: false
      },
      {
        name: "Historic Colonial Mansion",
        description: "Charming colonial mansion with vintage architecture and elegant interiors. Perfect for classic weddings with historical charm.",
        location: {
          address: "654 Heritage Street, Galle",
          city: "Galle",
          province: "Southern Province",
          coordinates: {
            lat: 6.0329,
            lng: 80.2169
          }
        },
        capacity: {
          min: 15,
          max: 80
        },
        pricing: {
          basePrice: 100000,
          currency: "LKR",
          pricePerGuest: 2000
        },
        amenities: ["Historic Setting", "Air Conditioning", "Parking", "Restrooms", "Antique Furniture"],
        images: [
          "https://images.unsplash.com/photo-1519167758481-83f1426e4b3e?w=800",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
        ],
        availability: [],
        rating: {
          average: 4.5,
          count: 15
        },
        reviews: [],
        owner: users.length > 4 ? users[4]._id : new mongoose.Types.ObjectId(),
        isActive: true,
        featured: false
      }
    ];

    // Create venues
    const Venue = mongoose.model('Venue', new mongoose.Schema({}, { strict: false }));
    
    for (const venueData of venues) {
      try {
        const venue = new Venue(venueData);
        await venue.save();
        console.log(`✅ Created venue: ${venueData.name}`);
      } catch (error) {
        console.error(`❌ Failed to create venue ${venueData.name}:`, error.message);
      }
    }

    console.log('🎉 Venue creation completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createVenues();
