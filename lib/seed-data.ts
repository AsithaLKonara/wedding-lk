import { connectDB } from './db';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';
import { Testimonial } from './models/testimonial';
import { Package } from './models/package';
import { User } from './models/user';
import bcrypt from 'bcryptjs';

export interface SeedData {
  vendors: any[];
  venues: any[];
  testimonials: any[];
  packages: any[];
  users: any[];
}

export const sampleVendors = [
  {
    businessName: "Elegant Events by Sarah",
    name: "Sarah Johnson",
    email: "sarah@elegantevents.com",
    password: "password123",
    phone: "+94 77 123 4567",
    category: "Event Planning",
    description: "Professional wedding planner with 10+ years of experience creating magical moments. Specializing in luxury weddings and intimate ceremonies.",
    location: {
      city: "Colombo",
      province: "Western Province",
      address: "123 Galle Road, Colombo 03"
    },
    services: ["Full Wedding Planning", "Day-of Coordination", "Venue Selection", "Vendor Management"],
    pricing: {
      startingPrice: 150000,
      currency: "LKR"
    },
    rating: {
      average: 4.8,
      count: 127
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  },
  {
    businessName: "Royal Photography Studio",
    name: "Michael Chen",
    email: "michael@royalphoto.com",
    password: "password123",
    phone: "+94 77 234 5678",
    category: "Photography",
    description: "Award-winning wedding photographer capturing love stories with artistic flair. Specializing in candid moments and cinematic wedding films.",
    location: {
      city: "Kandy",
      province: "Central Province",
      address: "456 Temple Street, Kandy"
    },
    services: ["Wedding Photography", "Pre-wedding Shoots", "Cinematic Films", "Photo Albums"],
    pricing: {
      startingPrice: 80000,
      currency: "LKR"
    },
    rating: {
      average: 4.9,
      count: 89
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  },
  {
    businessName: "Blissful Blooms",
    name: "Priya Fernando",
    email: "priya@blissfulblooms.com",
    password: "password123",
    phone: "+94 77 345 6789",
    category: "Floral Design",
    description: "Creative floral designer crafting stunning wedding arrangements with fresh, seasonal flowers. Creating romantic atmospheres through beautiful blooms.",
    location: {
      city: "Galle",
      province: "Southern Province",
      address: "789 Dutch Hospital, Galle Fort"
    },
    services: ["Bridal Bouquets", "Ceremony Arrangements", "Reception Centerpieces", "Flower Walls"],
    pricing: {
      startingPrice: 45000,
      currency: "LKR"
    },
    rating: {
      average: 4.7,
      count: 156
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  },
  {
    businessName: "Harmony Catering",
    name: "David Silva",
    email: "david@harmonycatering.com",
    password: "password123",
    phone: "+94 77 456 7890",
    category: "Catering",
    description: "Premium catering service offering exquisite cuisine for your special day. From traditional Sri Lankan dishes to international gourmet options.",
    location: {
      city: "Colombo",
      province: "Western Province",
      address: "321 Independence Avenue, Colombo 07"
    },
    services: ["Wedding Buffets", "Plated Dinners", "Cocktail Receptions", "Dessert Stations"],
    pricing: {
      startingPrice: 2500,
      currency: "LKR",
      perPerson: true
    },
    rating: {
      average: 4.6,
      count: 203
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  },
  {
    businessName: "Melody Music Band",
    name: "Rajesh Kumar",
    email: "rajesh@melodymusic.com",
    password: "password123",
    phone: "+94 77 567 8901",
    category: "Entertainment",
    description: "Professional wedding band specializing in live music performances. Creating the perfect soundtrack for your celebration with a mix of traditional and modern songs.",
    location: {
      city: "Negombo",
      province: "Western Province",
      address: "654 Beach Road, Negombo"
    },
    services: ["Live Band Performance", "DJ Services", "Sound System", "Lighting"],
    pricing: {
      startingPrice: 120000,
      currency: "LKR"
    },
    rating: {
      average: 4.5,
      count: 78
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  },
  {
    businessName: "Glamour Makeup Studio",
    name: "Nisha Patel",
    email: "nisha@glamourmakeup.com",
    password: "password123",
    phone: "+94 77 678 9012",
    category: "Beauty & Styling",
    description: "Professional makeup artist and hairstylist creating stunning bridal looks. Specializing in natural, elegant styles that enhance your natural beauty.",
    location: {
      city: "Colombo",
      province: "Western Province",
      address: "987 Horton Place, Colombo 07"
    },
    services: ["Bridal Makeup", "Hair Styling", "Bridal Party Styling", "Trial Sessions"],
    pricing: {
      startingPrice: 35000,
      currency: "LKR"
    },
    rating: {
      average: 4.8,
      count: 134
    },
    isVerified: true,
    isActive: true,
    featured: true,
    portfolio: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500"
    ]
  }
];

export const sampleVenues = [
  {
    name: "The Grand Ballroom",
    description: "Elegant ballroom venue in the heart of Colombo with stunning city views and modern amenities. Perfect for grand wedding celebrations.",
    location: {
      city: "Colombo",
      province: "Western Province",
      address: "123 Galle Road, Colombo 03"
    },
    capacity: {
      min: 50,
      max: 500
    },
    amenities: ["Air Conditioning", "Parking", "Catering Kitchen", "Sound System", "Lighting", "Bridal Suite"],
    pricing: {
      startingPrice: 200000,
      currency: "LKR"
    },
    rating: {
      average: 4.7,
      count: 89
    },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e0b3b?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
    ],
    contact: {
      phone: "+94 11 234 5678",
      email: "info@grandballroom.com"
    }
  },
  {
    name: "Temple Gardens Resort",
    description: "Luxurious beachfront resort offering breathtaking ocean views and tropical gardens. Ideal for destination weddings with accommodation for guests.",
    location: {
      city: "Bentota",
      province: "Southern Province",
      address: "456 Beach Road, Bentota"
    },
    capacity: {
      min: 30,
      max: 300
    },
    amenities: ["Beach Access", "Swimming Pool", "Spa", "Restaurant", "Accommodation", "Water Sports"],
    pricing: {
      startingPrice: 150000,
      currency: "LKR"
    },
    rating: {
      average: 4.8,
      count: 156
    },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
    ],
    contact: {
      phone: "+94 34 567 8901",
      email: "events@templegardens.com"
    }
  },
  {
    name: "Hill Country Manor",
    description: "Charming colonial-style manor nestled in the hills of Kandy with panoramic mountain views. Perfect for intimate and romantic wedding celebrations.",
    location: {
      city: "Kandy",
      province: "Central Province",
      address: "789 Hill Station Road, Kandy"
    },
    capacity: {
      min: 20,
      max: 150
    },
    amenities: ["Mountain Views", "Garden", "Fireplace", "Parking", "Catering", "Accommodation"],
    pricing: {
      startingPrice: 100000,
      currency: "LKR"
    },
    rating: {
      average: 4.6,
      count: 67
    },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e0b3b?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
    ],
    contact: {
      phone: "+94 81 234 5678",
      email: "info@hillcountrymanor.com"
    }
  }
];

export const sampleTestimonials = [
  {
    name: "Sarah & James",
    location: "Colombo",
    rating: 5,
    text: "WeddingLK made our dream wedding come true! The AI search helped us find the perfect vendors, and everything was coordinated beautifully. Our guests are still talking about how amazing everything was.",
    weddingDate: "2024-03-15",
    venue: "The Grand Ballroom",
    vendor: "Elegant Events by Sarah",
    isVerified: true,
    isActive: true,
    featured: true
  },
  {
    name: "Priya & Rajesh",
    location: "Kandy",
    rating: 5,
    text: "The platform is incredible! We found our photographer, florist, and caterer all in one place. The booking process was smooth, and the vendors exceeded our expectations. Highly recommended!",
    weddingDate: "2024-02-20",
    venue: "Hill Country Manor",
    vendor: "Royal Photography Studio",
    isVerified: true,
    isActive: true,
    featured: true
  },
  {
    name: "Emma & David",
    location: "Galle",
    rating: 5,
    text: "WeddingLK saved us so much time and stress! The AI recommendations were spot-on, and we found vendors that perfectly matched our style and budget. Our wedding was absolutely perfect.",
    weddingDate: "2024-01-10",
    venue: "Temple Gardens Resort",
    vendor: "Blissful Blooms",
    isVerified: true,
    isActive: true,
    featured: true
  },
  {
    name: "Anjali & Kumar",
    location: "Negombo",
    rating: 5,
    text: "The best wedding planning platform in Sri Lanka! The vendor profiles were detailed, the booking system was easy to use, and the customer support was excellent. Thank you WeddingLK!",
    weddingDate: "2023-12-05",
    venue: "The Grand Ballroom",
    vendor: "Harmony Catering",
    isVerified: true,
    isActive: true,
    featured: true
  },
  {
    name: "Lisa & Michael",
    location: "Colombo",
    rating: 5,
    text: "We were skeptical about planning our wedding online, but WeddingLK proved us wrong! The AI search found us vendors we never would have discovered otherwise. Our wedding was magical!",
    weddingDate: "2023-11-18",
    venue: "Temple Gardens Resort",
    vendor: "Melody Music Band",
    isVerified: true,
    isActive: true,
    featured: true
  },
  {
    name: "Nisha & Arjun",
    location: "Kandy",
    rating: 5,
    text: "From start to finish, WeddingLK made our wedding planning journey smooth and enjoyable. The vendor recommendations were perfect, and the platform is so user-friendly. Highly recommend!",
    weddingDate: "2023-10-22",
    venue: "Hill Country Manor",
    vendor: "Glamour Makeup Studio",
    isVerified: true,
    isActive: true,
    featured: true
  }
];

export const samplePackages = [
  {
    name: "Colombo Luxury Wedding Package",
    description: "Complete luxury wedding package for couples who want the best of Colombo's wedding scene. Includes premium venue, top vendors, and full coordination.",
    location: {
      city: "Colombo",
      province: "Western Province"
    },
    price: 2500000,
    currency: "LKR",
    guestCount: {
      min: 100,
      max: 300
    },
    includes: [
      "Premium venue booking",
      "Professional photographer",
      "Floral arrangements",
      "Catering for all guests",
      "Wedding planner",
      "Music and entertainment",
      "Makeup and styling",
      "Transportation"
    ],
    vendors: ["Elegant Events by Sarah", "Royal Photography Studio", "Blissful Blooms", "Harmony Catering"],
    venue: "The Grand Ballroom",
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e0b3b?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
    ]
  },
  {
    name: "Kandy Romantic Wedding Package",
    description: "Intimate and romantic wedding package in the beautiful hill country. Perfect for couples who want a serene and picturesque wedding celebration.",
    location: {
      city: "Kandy",
      province: "Central Province"
    },
    price: 1800000,
    currency: "LKR",
    guestCount: {
      min: 50,
      max: 150
    },
    includes: [
      "Hill country venue",
      "Professional photography",
      "Romantic floral design",
      "Traditional catering",
      "Wedding coordination",
      "Live music",
      "Bridal styling",
      "Guest accommodation"
    ],
    vendors: ["Hill Country Manor", "Royal Photography Studio", "Blissful Blooms", "Melody Music Band"],
    venue: "Hill Country Manor",
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e0b3b?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
    ]
  },
  {
    name: "Galle Beach Wedding Package",
    description: "Stunning beach wedding package with ocean views and tropical vibes. Ideal for couples who dream of a destination wedding by the sea.",
    location: {
      city: "Galle",
      province: "Southern Province"
    },
    price: 2200000,
    currency: "LKR",
    guestCount: {
      min: 75,
      max: 200
    },
    includes: [
      "Beachfront venue",
      "Professional photographer",
      "Tropical floral arrangements",
      "Seafood catering",
      "Wedding planning",
      "Beach entertainment",
      "Makeup and hair",
      "Resort accommodation"
    ],
    vendors: ["Temple Gardens Resort", "Royal Photography Studio", "Blissful Blooms", "Harmony Catering"],
    venue: "Temple Gardens Resort",
    isActive: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
    ]
  }
];

export const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    profile: {
      phone: "+94 77 123 4567",
      location: {
        city: "Colombo",
        province: "Western Province"
      }
    }
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    profile: {
      phone: "+94 77 234 5678",
      location: {
        city: "Kandy",
        province: "Central Province"
      }
    }
  },
  {
    name: "Admin User",
    email: "admin@weddinglk.com",
    password: "admin123",
    role: "admin",
    isActive: true,
    profile: {
      phone: "+94 11 123 4567",
      location: {
        city: "Colombo",
        province: "Western Province"
      }
    }
  }
];

export async function seedDatabase(): Promise<SeedData> {
  try {
    await connectDB();

    // Clear existing data
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Testimonial.deleteMany({});
    await Package.deleteMany({});
    await User.deleteMany({});

    // Hash passwords
    const hashedVendors = await Promise.all(
      sampleVendors.map(async (vendor) => ({
        ...vendor,
        password: await bcrypt.hash(vendor.password, 12)
      }))
    );

    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    // Insert seed data
    const vendors = await Vendor.insertMany(hashedVendors);
    const venues = await Venue.insertMany(sampleVenues);
    const testimonials = await Testimonial.insertMany(sampleTestimonials);
    const packages = await Package.insertMany(samplePackages);
    const users = await User.insertMany(hashedUsers);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created: ${vendors.length} vendors, ${venues.length} venues, ${testimonials.length} testimonials, ${packages.length} packages, ${users.length} users`);

    return {
      vendors,
      venues,
      testimonials,
      packages,
      users
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export async function clearDatabase(): Promise<void> {
  try {
    await connectDB();

    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Testimonial.deleteMany({});
    await Package.deleteMany({});
    await User.deleteMany({});

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}
