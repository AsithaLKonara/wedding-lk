// Test data seed script
import { connectDB } from '@/lib/db-optimized'
import { User } from '@/lib/models/user'
import { Venue } from '@/lib/models/venue'
import { Vendor } from '@/lib/models/vendor'
import { Package } from '@/lib/models/package'
import { Booking } from '@/lib/models/booking'
import { Payment } from '@/lib/models/payment'
import { Review } from '@/lib/models/review'

const testUsers = {
  "admin": {
    "name": "Test Admin",
    "email": "admin@weddinglk.com",
    "password": "Admin123!",
    "role": "admin",
    "phone": "+94771234567"
  },
  "vendor": {
    "name": "Test Vendor",
    "email": "vendor@weddinglk.com",
    "password": "Vendor123!",
    "role": "vendor",
    "phone": "+94771234568"
  },
  "client": {
    "name": "Test Client",
    "email": "client@weddinglk.com",
    "password": "Client123!",
    "role": "client",
    "phone": "+94771234569"
  }
}

const testVenues = [
  {
    name: 'Test Venue 1',
    location: 'Colombo',
    capacity: 200,
    price: 50000,
    amenities: ['Parking', 'AC', 'Sound System'],
    description: 'A beautiful test venue in Colombo',
    images: ['venue1.jpg', 'venue2.jpg'],
    rating: 4.5
  },
  {
    name: 'Test Venue 2',
    location: 'Kandy',
    capacity: 150,
    price: 40000,
    amenities: ['Parking', 'AC'],
    description: 'A scenic test venue in Kandy',
    images: ['venue3.jpg'],
    rating: 4.2
  }
]

const testVendors = [
  {
    name: 'Test Photographer',
    category: 'Photography',
    location: 'Colombo',
    price: 25000,
    services: ['Wedding Photography', 'Engagement Shoots'],
    description: 'Professional wedding photographer',
    images: ['photographer1.jpg'],
    rating: 4.8
  },
  {
    name: 'Test Caterer',
    category: 'Catering',
    location: 'Colombo',
    price: 15000,
    services: ['Wedding Catering', 'Buffet Service'],
    description: 'Delicious wedding catering service',
    images: ['caterer1.jpg'],
    rating: 4.6
  }
]

const testPackages = [
  {
    name: 'Test Premium Package',
    description: 'A comprehensive wedding package',
    price: 100000,
    features: {
      'Venue': true,
      'Photography': true,
      'Catering': true,
      'Music': true
    },
    category: 'Premium'
  },
  {
    name: 'Test Basic Package',
    description: 'A basic wedding package',
    price: 50000,
    features: {
      'Venue': true,
      'Photography': false,
      'Catering': true,
      'Music': false
    },
    category: 'Basic'
  }
]

export async function seedTestData() {
  try {
    await connectDB()
    
    // Create test users
    for (const userData of Object.values(testUsers)) {
      const existingUser = await User.findOne({ email: userData.email })
      if (!existingUser) {
        await User.create(userData)
        console.log(`Created user: ${userData.email}`)
      }
    }
    
    // Create test venues
    for (const venueData of testVenues) {
      const existingVenue = await Venue.findOne({ name: venueData.name })
      if (!existingVenue) {
        await Venue.create(venueData)
        console.log(`Created venue: ${venueData.name}`)
      }
    }
    
    // Create test vendors
    for (const vendorData of testVendors) {
      const existingVendor = await Vendor.findOne({ name: vendorData.name })
      if (!existingVendor) {
        await Vendor.create(vendorData)
        console.log(`Created vendor: ${vendorData.name}`)
      }
    }
    
    // Create test packages
    for (const packageData of testPackages) {
      const existingPackage = await Package.findOne({ name: packageData.name })
      if (!existingPackage) {
        await Package.create(packageData)
        console.log(`Created package: ${packageData.name}`)
      }
    }
    
    console.log('✅ Test data seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding test data:', error)
  }
}

export default seedTestData
