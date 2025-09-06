import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import { Booking } from "@/lib/models/booking"
import { Payment } from "@/lib/models"

// Mock data for seeding
const mockUsers = [
  {
    email: 'john.sarah@email.com',
    name: 'John & Sarah',
    phone: '+94 71 123 4567',
    role: 'user' as const,
    preferences: {
      weddingDate: new Date('2024-12-15'),
      budget: 500000,
      guestCount: 200,
      location: 'Colombo',
      style: 'modern'
    },
    isVerified: true,
    isActive: true
  },
  {
    email: 'mike.lisa@email.com',
    name: 'Mike & Lisa',
    phone: '+94 71 234 5678',
    role: 'user' as const,
    preferences: {
      weddingDate: new Date('2024-11-20'),
      budget: 350000,
      guestCount: 150,
      location: 'Kandy',
      style: 'traditional'
    },
    isVerified: true,
    isActive: true
  },
  {
    email: 'david.emma@email.com',
    name: 'David & Emma',
    phone: '+94 71 345 6789',
    role: 'user' as const,
    preferences: {
      weddingDate: new Date('2024-10-10'),
      budget: 750000,
      guestCount: 250,
      location: 'Galle',
      style: 'luxury'
    },
    isVerified: true,
    isActive: true
  },
  {
    email: 'photographer@perfectmoments.com',
    name: 'Perfect Moments Photography',
    phone: '+94 71 456 7890',
    role: 'vendor' as const,
    isVerified: true,
    isActive: true
  },
  {
    email: 'decorator@elegant.com',
    name: 'Elegant Decorators',
    phone: '+94 71 567 8901',
    role: 'vendor' as const,
    isVerified: true,
    isActive: true
  },
  {
    email: 'catering@sweetdreams.com',
    name: 'Sweet Dreams Catering',
    phone: '+94 71 678 9012',
    role: 'vendor' as const,
    isVerified: true,
    isActive: true
  }
]

const mockVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Luxurious wedding venue with stunning architecture and modern amenities',
    location: 'Colombo',
    address: '123 Main Street, Colombo 01',
    price: 50000,
    capacity: 300,
    rating: 4.8,
    images: [
      'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Grand+Ballroom+1',
      'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Grand+Ballroom+2',
      'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Grand+Ballroom+3'
    ],
    amenities: ['parking', 'catering', 'decoration', 'music', 'photography'],
    contact: {
      phone: '+94 11 234 5678',
      email: 'info@grandballroom.com',
      website: 'https://grandballroom.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-12-15'),
        new Date('2024-12-20'),
        new Date('2024-12-25')
      ]
    },
    isActive: true
  },
  {
    name: 'Garden Palace',
    description: 'Beautiful garden venue perfect for outdoor weddings with natural beauty',
    location: 'Kandy',
    address: '456 Garden Road, Kandy',
    price: 35000,
    capacity: 200,
    rating: 4.6,
    images: [
      'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Garden+Palace+1',
      'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Garden+Palace+2'
    ],
    amenities: ['garden', 'outdoor', 'photography', 'parking'],
    contact: {
      phone: '+94 81 345 6789',
      email: 'info@gardenpalace.com',
      website: 'https://gardenpalace.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-11-20'),
        new Date('2024-11-25'),
        new Date('2024-11-30')
      ]
    },
    isActive: true
  },
  {
    name: 'Ocean View Resort',
    description: 'Stunning beachfront venue with ocean views and luxury amenities',
    location: 'Galle',
    address: '789 Beach Road, Galle',
    price: 75000,
    capacity: 250,
    rating: 4.9,
    images: [
      'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Ocean+View+1',
      'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Ocean+View+2',
      'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Ocean+View+3'
    ],
    amenities: ['beach', 'ocean-view', 'luxury', 'catering', 'music'],
    contact: {
      phone: '+94 91 456 7890',
      email: 'info@oceanview.com',
      website: 'https://oceanview.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-10-10'),
        new Date('2024-10-15'),
        new Date('2024-10-20')
      ]
    },
    isActive: true
  }
]

const mockVendors = [
  {
    name: 'Perfect Moments Photography',
    category: 'Photography',
    description: 'Professional wedding photography services with creative and artistic approach',
    location: 'Colombo',
    price: 25000,
    rating: 4.9,
    images: [
      'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Photography+1',
      'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Photography+2'
    ],
    services: ['wedding', 'engagement', 'portrait', 'videography'],
    contact: {
      phone: '+94 71 456 7890',
      email: 'info@perfectmoments.com',
      website: 'https://perfectmoments.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-12-15'),
        new Date('2024-12-20'),
        new Date('2024-12-25')
      ]
    },
    isActive: true
  },
  {
    name: 'Elegant Decorators',
    category: 'Decoration',
    description: 'Beautiful wedding decorations and floral arrangements with attention to detail',
    location: 'Colombo',
    price: 15000,
    rating: 4.7,
    images: [
      'https://via.placeholder.com/800x600/96ceb4/ffffff?text=Decoration+1',
      'https://via.placeholder.com/800x600/96ceb4/ffffff?text=Decoration+2'
    ],
    services: ['floral', 'lighting', 'themes', 'backdrops'],
    contact: {
      phone: '+94 71 567 8901',
      email: 'info@elegantdecorators.com',
      website: 'https://elegantdecorators.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-12-15'),
        new Date('2024-12-20'),
        new Date('2024-12-25')
      ]
    },
    isActive: true
  },
  {
    name: 'Sweet Dreams Catering',
    category: 'Catering',
    description: 'Delicious wedding catering with multiple menu options and professional service',
    location: 'Kandy',
    price: 20000,
    rating: 4.8,
    images: [
      'https://via.placeholder.com/800x600/ffa726/ffffff?text=Catering+1',
      'https://via.placeholder.com/800x600/ffa726/ffffff?text=Catering+2'
    ],
    services: ['buffet', 'plated', 'desserts', 'beverages'],
    contact: {
      phone: '+94 71 678 9012',
      email: 'info@sweetdreams.com',
      website: 'https://sweetdreams.com'
    },
    availability: {
      isAvailable: true,
      availableDates: [
        new Date('2024-11-20'),
        new Date('2024-11-25'),
        new Date('2024-11-30')
      ]
    },
    isActive: true
  }
]

// Database seeder function
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to database
    await connectDB()
    
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Venue.deleteMany({})
    await Vendor.deleteMany({})
    await Booking.deleteMany({})
    await Payment.deleteMany({})
    
    // Seed users
    console.log('👥 Seeding users...')
    const createdUsers = await User.insertMany(mockUsers)
    console.log(`✅ Created ${createdUsers.length} users`)
    
    // Get user IDs for reference
    const userMap = new Map()
    createdUsers.forEach(user => {
      userMap.set(user.email, user._id)
    })
    
    // Seed venues with owner references
    console.log('🏛️ Seeding venues...')
    const venuesWithOwners = mockVenues.map(venue => ({
      ...venue,
      owner: userMap.get('john.sarah@email.com') // Assign to first user
    }))
    const createdVenues = await Venue.insertMany(venuesWithOwners)
    console.log(`✅ Created ${createdVenues.length} venues`)
    
    // Seed vendors with owner references
    console.log('👨‍💼 Seeding vendors...')
    const vendorsWithOwners = mockVendors.map((vendor, index) => ({
      ...vendor,
      owner: userMap.get(mockUsers[index + 3].email) // Assign to vendor users
    }))
    const createdVendors = await Vendor.insertMany(vendorsWithOwners)
    console.log(`✅ Created ${createdVendors.length} vendors`)
    
    // Seed bookings
    console.log('📅 Seeding bookings...')
    const mockBookings = [
      {
        userId: userMap.get('john.sarah@email.com'),
        venueId: createdVenues[0]._id,
        date: new Date('2024-12-15'),
        guestCount: 150,
        totalAmount: 50000,
        services: ['catering', 'decoration'],
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const
      },
      {
        userId: userMap.get('mike.lisa@email.com'),
        venueId: createdVenues[1]._id,
        date: new Date('2024-11-20'),
        guestCount: 100,
        totalAmount: 35000,
        services: ['photography'],
        status: 'pending' as const,
        paymentStatus: 'pending' as const
      },
      {
        userId: userMap.get('david.emma@email.com'),
        venueId: createdVenues[2]._id,
        date: new Date('2024-10-10'),
        guestCount: 200,
        totalAmount: 75000,
        services: ['catering', 'decoration', 'photography'],
        status: 'cancelled' as const,
        paymentStatus: 'refunded' as const
      }
    ]
    const createdBookings = await Booking.insertMany(mockBookings)
    console.log(`✅ Created ${createdBookings.length} bookings`)
    
    // Seed payments
    console.log('💰 Seeding payments...')
    const mockPayments = [
      {
        userId: userMap.get('john.sarah@email.com'),
        bookingId: createdBookings[0]._id,
        type: 'booking' as const,
        amount: 50000,
        currency: 'LKR',
        method: 'card' as const,
        status: 'completed' as const,
        description: 'Venue booking payment',
        transactionId: 'txn_123456789'
      },
      {
        userId: userMap.get('mike.lisa@email.com'),
        bookingId: createdBookings[1]._id,
        type: 'booking' as const,
        amount: 35000,
        currency: 'LKR',
        method: 'payhere' as const,
        status: 'pending' as const,
        description: 'Venue booking payment'
      },
      {
        userId: userMap.get('john.sarah@email.com'),
        type: 'subscription' as const,
        amount: 5000,
        currency: 'LKR',
        method: 'card' as const,
        status: 'completed' as const,
        description: 'Premium subscription',
        transactionId: 'txn_987654321'
      }
    ]
    const createdPayments = await Payment.insertMany(mockPayments)
    console.log(`✅ Created ${createdPayments.length} payments`)
    
    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Users: ${createdUsers.length}`)
    console.log(`   - Venues: ${createdVenues.length}`)
    console.log(`   - Vendors: ${createdVendors.length}`)
    console.log(`   - Bookings: ${createdBookings.length}`)
    console.log(`   - Payments: ${createdPayments.length}`)
    
    return {
      users: createdUsers.length,
      venues: createdVenues.length,
      vendors: createdVendors.length,
      bookings: createdBookings.length,
      payments: createdPayments.length
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}

// Export seeder function
export default seedDatabase 