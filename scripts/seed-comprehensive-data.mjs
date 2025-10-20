#!/usr/bin/env node

import mongoose from 'mongoose'
import { connectDB } from '../lib/db.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Import models
const { User } = await import('../lib/models/user.js')
const { Venue } = await import('../lib/models/venue.js')
const { Vendor } = await import('../lib/models/vendor.js')
const { Package } = await import('../lib/models/package.js')
const { Booking } = await import('../lib/models/booking.js')
const { Review } = await import('../lib/models/review.js')

const comprehensiveData = {
  users: [
    {
      firstName: "Asitha",
      lastName: "Konara",
      email: "asitha@weddinglk.com",
      phone: "+94771234567",
      password: "$2a$10$example", // This would be hashed in real implementation
      userType: "admin",
      isVerified: true,
      subscription: {
        plan: "pro",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    },
    {
      firstName: "Sarah",
      lastName: "Fernando",
      email: "sarah.fernando@email.com",
      phone: "+94771234568",
      password: "$2a$10$example",
      userType: "couple",
      weddingDate: new Date("2024-12-15"),
      isVerified: true,
      preferences: {
        budget: 500000,
        location: "Colombo",
        guestCount: 150,
        weddingStyle: "Traditional"
      }
    },
    {
      firstName: "Michael",
      lastName: "Perera",
      email: "michael.perera@email.com",
      phone: "+94771234569",
      password: "$2a$10$example",
      userType: "vendor",
      isVerified: true,
      subscription: {
        plan: "premium",
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months from now
      }
    }
  ],

  venues: [
    {
      name: "Grand Ballroom Hotel",
      description: "Luxurious 5-star hotel ballroom with crystal chandeliers and marble floors, perfect for grand weddings.",
      location: {
        address: "123 Galle Road, Colombo 03",
        city: "Colombo",
        province: "Western",
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      capacity: { min: 100, max: 500 },
      pricing: {
        basePrice: 450000,
        currency: "LKR",
        pricePerGuest: 5000
      },
      amenities: ["Air Conditioning", "Parking", "Catering", "Sound System", "Lighting", "Bridal Suite"],
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ],
      rating: { average: 4.8, count: 124 },
      owner: null, // Will be set after user creation
      isActive: true,
      featured: true
    },
    {
      name: "Beachfront Paradise Resort",
      description: "Stunning beachfront venue with ocean views and tropical gardens, perfect for romantic beach weddings.",
      location: {
        address: "456 Beach Road, Bentota",
        city: "Bentota",
        province: "Southern",
        coordinates: { lat: 6.4207, lng: 79.9955 }
      },
      capacity: { min: 50, max: 200 },
      pricing: {
        basePrice: 350000,
        currency: "LKR",
        pricePerGuest: 3000
      },
      amenities: ["Beach Access", "Garden", "Catering", "Photography Spots", "Bridal Suite", "Sound System"],
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
      ],
      rating: { average: 4.9, count: 89 },
      owner: null,
      isActive: true,
      featured: true
    },
    {
      name: "Garden Villa Estate",
      description: "Charming garden estate with lush greenery and traditional architecture, perfect for intimate ceremonies.",
      location: {
        address: "789 Hill Street, Kandy",
        city: "Kandy",
        province: "Central",
        coordinates: { lat: 7.2906, lng: 80.6337 }
      },
      capacity: { min: 75, max: 150 },
      pricing: {
        basePrice: 200000,
        currency: "LKR",
        pricePerGuest: 2500
      },
      amenities: ["Garden", "Parking", "Catering", "Traditional Architecture", "Photography Spots"],
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
      ],
      rating: { average: 4.6, count: 67 },
      owner: null,
      isActive: true,
      featured: false
    },
    {
      name: "Mountain View Resort",
      description: "Breathtaking mountain resort with panoramic views, perfect for destination weddings.",
      location: {
        address: "321 Tea Estate Road, Nuwara Eliya",
        city: "Nuwara Eliya",
        province: "Central",
        coordinates: { lat: 6.9497, lng: 80.7891 }
      },
      capacity: { min: 50, max: 100 },
      pricing: {
        basePrice: 300000,
        currency: "LKR",
        pricePerGuest: 4000
      },
      amenities: ["Mountain Views", "Tea Estate", "Catering", "Accommodation", "Photography Spots"],
      images: [
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e8b0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
      ],
      rating: { average: 4.7, count: 45 },
      owner: null,
      isActive: true,
      featured: false
    },
    {
      name: "Historic Fort Venue",
      description: "Unique historic fort venue with colonial architecture and cultural significance.",
      location: {
        address: "654 Fort Street, Galle",
        city: "Galle",
        province: "Southern",
        coordinates: { lat: 6.0535, lng: 80.2209 }
      },
      capacity: { min: 30, max: 80 },
      pricing: {
        basePrice: 150000,
        currency: "LKR",
        pricePerGuest: 2000
      },
      amenities: ["Historic Architecture", "Cultural Significance", "Catering", "Photography Spots"],
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ],
      rating: { average: 4.5, count: 23 },
      owner: null,
      isActive: true,
      featured: false
    }
  ],

  vendors: [
    {
      name: "Elite Photography Studio",
      businessName: "Elite Photography Studio",
      category: "photographer",
      description: "Award-winning wedding photographers specializing in candid and artistic shots with 10+ years of experience.",
      location: {
        address: "123 Camera Street, Colombo 07",
        city: "Colombo",
        province: "Western",
        serviceAreas: ["Colombo", "Gampaha", "Kalutara"]
      },
      contact: {
        phone: "+94771234570",
        email: "info@elitephotography.lk",
        website: "https://elitephotography.lk",
        socialMedia: {
          facebook: "https://facebook.com/elitephotography",
          instagram: "https://instagram.com/elitephotography"
        }
      },
      services: [
        { name: "Wedding Photography", description: "Full day wedding coverage", price: 75000, duration: "8 hours" },
        { name: "Engagement Shoots", description: "Pre-wedding photo session", price: 25000, duration: "2 hours" },
        { name: "Video Coverage", description: "Wedding video production", price: 100000, duration: "Full day" }
      ],
      portfolio: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop"
      ],
      pricing: {
        startingPrice: 50000,
        currency: "LKR",
        packages: [
          { name: "Basic Package", price: 50000, features: ["4 hours coverage", "100 edited photos"] },
          { name: "Premium Package", price: 75000, features: ["8 hours coverage", "300 edited photos", "Online gallery"] }
        ]
      },
      rating: { average: 4.9, count: 156 },
      owner: null,
      isVerified: true,
      isActive: true,
      featured: true,
      subscription: { plan: "premium", expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) }
    },
    {
      name: "Royal Catering Services",
      businessName: "Royal Catering Services",
      category: "catering",
      description: "Premium catering services specializing in Sri Lankan and international cuisine for weddings and special events.",
      location: {
        address: "456 Food Street, Colombo 05",
        city: "Colombo",
        province: "Western",
        serviceAreas: ["Colombo", "Gampaha", "Kalutara", "Kandy"]
      },
      contact: {
        phone: "+94771234571",
        email: "info@royalcatering.lk",
        website: "https://royalcatering.lk"
      },
      services: [
        { name: "Wedding Buffet", description: "Traditional Sri Lankan buffet", price: 2500, duration: "Per person" },
        { name: "Fine Dining", description: "Multi-course fine dining", price: 5000, duration: "Per person" },
        { name: "Cocktail Reception", description: "Cocktails and appetizers", price: 1500, duration: "Per person" }
      ],
      portfolio: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop"
      ],
      pricing: {
        startingPrice: 2000,
        currency: "LKR",
        packages: [
          { name: "Basic Menu", price: 2000, features: ["Rice & curry", "Dessert", "Tea/Coffee"] },
          { name: "Premium Menu", price: 3500, features: ["International cuisine", "Live cooking stations", "Premium desserts"] }
        ]
      },
      rating: { average: 4.7, count: 89 },
      owner: null,
      isVerified: true,
      isActive: true,
      featured: true,
      subscription: { plan: "basic", expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
    },
    {
      name: "Melody Makers Band",
      businessName: "Melody Makers Entertainment",
      category: "music",
      description: "Professional live music band specializing in traditional and contemporary music for weddings.",
      location: {
        address: "789 Music Lane, Kandy",
        city: "Kandy",
        province: "Central",
        serviceAreas: ["Kandy", "Colombo", "Galle", "Anuradhapura"]
      },
      contact: {
        phone: "+94771234572",
        email: "info@melodymakers.lk"
      },
      services: [
        { name: "Live Band Performance", description: "Traditional and modern music", price: 80000, duration: "4 hours" },
        { name: "DJ Services", description: "Professional DJ with sound system", price: 50000, duration: "6 hours" },
        { name: "MC Services", description: "Master of ceremonies", price: 30000, duration: "Full event" }
      ],
      portfolio: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop"
      ],
      pricing: {
        startingPrice: 40000,
        currency: "LKR",
        packages: [
          { name: "Basic Package", price: 40000, features: ["3-piece band", "2 hours performance"] },
          { name: "Premium Package", price: 80000, features: ["6-piece band", "4 hours performance", "Sound system"] }
        ]
      },
      rating: { average: 4.8, count: 67 },
      owner: null,
      isVerified: true,
      isActive: true,
      featured: false,
      subscription: { plan: "basic", expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
    }
  ],

  packages: [
    {
      name: "Royal Wedding Package",
      description: "Complete luxury wedding package with premium amenities and services for the most special day.",
      price: 500000,
      features: {
        "Luxury Venue": true,
        "Professional Photography": true,
        "Premium Catering": true,
        "Live Music Band": true,
        "Floral Decoration": true,
        "Wedding Coordinator": true,
        "Transportation": true,
        "Honeymoon Suite": true,
        "Video Coverage": true,
        "Bridal Makeup": true,
        "Groom Attire": true,
        "Wedding Cake": true
      },
      category: "Premium",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ],
      rating: 4.9,
      isActive: true
    },
    {
      name: "Elegant Wedding Package",
      description: "Sophisticated wedding package with elegant touches and professional services.",
      price: 350000,
      features: {
        "Elegant Venue": true,
        "Professional Photography": true,
        "Quality Catering": true,
        "DJ Music": true,
        "Basic Decoration": true,
        "Wedding Coordinator": true,
        "Transportation": false,
        "Honeymoon Suite": false,
        "Video Coverage": true,
        "Bridal Makeup": true,
        "Groom Attire": false,
        "Wedding Cake": true
      },
      category: "Standard",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
      ],
      rating: 4.6,
      isActive: true
    },
    {
      name: "Classic Wedding Package",
      description: "Traditional wedding package with essential services and timeless elegance.",
      price: 250000,
      features: {
        "Classic Venue": true,
        "Basic Photography": true,
        "Standard Catering": true,
        "DJ Music": false,
        "Basic Decoration": true,
        "Wedding Coordinator": false,
        "Transportation": false,
        "Honeymoon Suite": false,
        "Video Coverage": false,
        "Bridal Makeup": false,
        "Groom Attire": false,
        "Wedding Cake": true
      },
      category: "Basic",
      images: [
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e8b0?w=800&h=600&fit=crop"
      ],
      rating: 4.3,
      isActive: true
    }
  ]
}

async function seedComprehensiveData() {
  try {
    console.log('🔗 Connecting to database...')
    await connectDB()
    
    console.log('🗑️ Clearing existing data...')
    await User.deleteMany({})
    await Venue.deleteMany({})
    await Vendor.deleteMany({})
    await Package.deleteMany({})
    await Booking.deleteMany({})
    await Review.deleteMany({})
    
    console.log('👥 Creating users...')
    const createdUsers = await User.insertMany(comprehensiveData.users)
    console.log(`✅ Created ${createdUsers.length} users`)
    
    // Set venue and vendor owners
    const adminUser = createdUsers.find(user => user.userType === 'admin')
    const vendorUser = createdUsers.find(user => user.userType === 'vendor')
    
    console.log('🏢 Creating venues...')
    const venuesWithOwners = comprehensiveData.venues.map(venue => ({
      ...venue,
      owner: adminUser._id
    }))
    const createdVenues = await Venue.insertMany(venuesWithOwners)
    console.log(`✅ Created ${createdVenues.length} venues`)
    
    console.log('🎭 Creating vendors...')
    const vendorsWithOwners = comprehensiveData.vendors.map(vendor => ({
      ...vendor,
      owner: vendorUser._id
    }))
    const createdVendors = await Vendor.insertMany(vendorsWithOwners)
    console.log(`✅ Created ${createdVendors.length} vendors`)
    
    console.log('📦 Creating packages...')
    const createdPackages = await Package.insertMany(comprehensiveData.packages)
    console.log(`✅ Created ${createdPackages.length} packages`)
    
    // Create sample bookings
    console.log('📅 Creating sample bookings...')
    const sampleBookings = [
      {
        user: createdUsers[1]._id, // Sarah Fernando
        venue: createdVenues[0]._id, // Grand Ballroom Hotel
        package: createdPackages[0]._id, // Royal Wedding Package
        eventDate: new Date("2024-12-15"),
        guestCount: 150,
        totalAmount: 500000,
        status: "confirmed",
        specialRequests: "Traditional Sri Lankan ceremony with modern touches"
      },
      {
        user: createdUsers[1]._id,
        venue: createdVenues[1]._id, // Beachfront Paradise Resort
        package: createdPackages[1]._id, // Elegant Wedding Package
        eventDate: new Date("2024-11-20"),
        guestCount: 100,
        totalAmount: 350000,
        status: "pending",
        specialRequests: "Beach ceremony with sunset timing"
      }
    ]
    const createdBookings = await Booking.insertMany(sampleBookings)
    console.log(`✅ Created ${createdBookings.length} bookings`)
    
    // Create sample reviews
    console.log('⭐ Creating sample reviews...')
    const sampleReviews = [
      {
        user: createdUsers[1]._id,
        venue: createdVenues[0]._id,
        rating: 5,
        comment: "Absolutely stunning venue! The staff was incredibly helpful and the food was delicious.",
        images: ["https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop"]
      },
      {
        user: createdUsers[1]._id,
        vendor: createdVendors[0]._id,
        rating: 5,
        comment: "Elite Photography captured our special day perfectly. Highly recommended!",
        images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"]
      }
    ]
    const createdReviews = await Review.insertMany(sampleReviews)
    console.log(`✅ Created ${createdReviews.length} reviews`)
    
    console.log('\n🎉 Comprehensive data seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Users: ${createdUsers.length}`)
    console.log(`   - Venues: ${createdVenues.length}`)
    console.log(`   - Vendors: ${createdVendors.length}`)
    console.log(`   - Packages: ${createdPackages.length}`)
    console.log(`   - Bookings: ${createdBookings.length}`)
    console.log(`   - Reviews: ${createdReviews.length}`)
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive data:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
  }
}

// Run the script
seedComprehensiveData()
