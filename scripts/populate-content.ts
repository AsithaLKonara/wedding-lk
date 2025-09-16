import { connectDB } from '../lib/mongodb'
import { Vendor, Venue, ServicePackage, User } from '../lib/models'

// Sample vendor data
const sampleVendors = [
  {
    businessName: 'Elegant Photography Studio',
    businessType: 'Photography',
    description: 'Professional wedding photography with over 10 years of experience. Specializing in candid moments and artistic compositions.',
    services: ['Wedding Photography', 'Engagement Photography', 'Pre-wedding Photography', 'Photo Editing'],
    location: 'Colombo',
    contactPhone: '+94 77 123 4567',
    contactEmail: 'info@elegantphotography.com',
    website: 'https://elegantphotography.com',
    experience: '10 years',
    portfolio: [
      '/images/portfolio/photography-1.jpg',
      '/images/portfolio/photography-2.jpg',
      '/images/portfolio/photography-3.jpg'
    ],
    pricing: { minPrice: 80000, maxPrice: 200000, currency: 'LKR' },
    availability: { weekdays: true, weekends: true, holidays: true },
    rating: 4.8,
    reviewCount: 45
  },
  {
    businessName: 'Royal Catering Services',
    businessType: 'Catering',
    description: 'Premium catering services with authentic Sri Lankan cuisine and international dishes. Serving weddings across the island.',
    services: ['Wedding Catering', 'Buffet Service', 'Plated Service', 'Beverage Service'],
    location: 'Kandy',
    contactPhone: '+94 77 234 5678',
    contactEmail: 'orders@royalcatering.com',
    website: 'https://royalcatering.com',
    experience: '15 years',
    portfolio: [
      '/images/portfolio/catering-1.jpg',
      '/images/portfolio/catering-2.jpg',
      '/images/portfolio/catering-3.jpg'
    ],
    pricing: { minPrice: 120000, maxPrice: 500000, currency: 'LKR' },
    availability: { weekdays: true, weekends: true, holidays: true },
    rating: 4.9,
    reviewCount: 78
  },
  {
    businessName: 'Melody Music Band',
    businessType: 'Music & DJ',
    description: 'Live music band specializing in wedding entertainment. Traditional and modern music with professional sound equipment.',
    services: ['Live Music', 'DJ Service', 'Sound System', 'Lighting'],
    location: 'Galle',
    contactPhone: '+94 77 345 6789',
    contactEmail: 'bookings@melodymusic.com',
    website: 'https://melodymusic.com',
    experience: '8 years',
    portfolio: [
      '/images/portfolio/music-1.jpg',
      '/images/portfolio/music-2.jpg',
      '/images/portfolio/music-3.jpg'
    ],
    pricing: { minPrice: 60000, maxPrice: 150000, currency: 'LKR' },
    availability: { weekdays: true, weekends: true, holidays: false },
    rating: 4.7,
    reviewCount: 32
  },
  {
    businessName: 'Blossom Floral Design',
    businessType: 'Flowers',
    description: 'Artistic floral arrangements for weddings. Fresh flowers sourced locally with creative designs and professional setup.',
    services: ['Bridal Bouquet', 'Ceremony Decorations', 'Reception Centerpieces', 'Flower Arch'],
    location: 'Negombo',
    contactPhone: '+94 77 456 7890',
    contactEmail: 'orders@blossomfloral.com',
    website: 'https://blossomfloral.com',
    experience: '12 years',
    portfolio: [
      '/images/portfolio/flowers-1.jpg',
      '/images/portfolio/flowers-2.jpg',
      '/images/portfolio/flowers-3.jpg'
    ],
    pricing: { minPrice: 40000, maxPrice: 120000, currency: 'LKR' },
    availability: { weekdays: true, weekends: true, holidays: true },
    rating: 4.6,
    reviewCount: 28
  },
  {
    businessName: 'Dream Wedding Planners',
    businessType: 'Wedding Planning',
    description: 'Full-service wedding planning with attention to detail. From concept to execution, we make your dream wedding come true.',
    services: ['Full Planning', 'Day Coordination', 'Vendor Management', 'Timeline Planning'],
    location: 'Colombo',
    contactPhone: '+94 77 567 8901',
    contactEmail: 'info@dreamweddingplanners.com',
    website: 'https://dreamweddingplanners.com',
    experience: '6 years',
    portfolio: [
      '/images/portfolio/planning-1.jpg',
      '/images/portfolio/planning-2.jpg',
      '/images/portfolio/planning-3.jpg'
    ],
    pricing: { minPrice: 100000, maxPrice: 300000, currency: 'LKR' },
    availability: { weekdays: true, weekends: true, holidays: true },
    rating: 4.9,
    reviewCount: 52
  }
]

// Sample venue data
const sampleVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Luxurious hotel ballroom with elegant decor and professional service. Perfect for grand wedding celebrations.',
    location: 'Colombo',
    address: '123 Galle Road, Colombo 03',
    capacity: 300,
    amenities: ['Air Conditioning', 'Parking', 'Catering Kitchen', 'Sound System', 'Lighting'],
    pricing: { minPrice: 200000, maxPrice: 500000, currency: 'LKR' },
    images: [
      '/images/venues/ballroom-1.jpg',
      '/images/venues/ballroom-2.jpg',
      '/images/venues/ballroom-3.jpg'
    ],
    rating: 4.7,
    reviewCount: 34
  },
  {
    name: 'Garden Paradise Resort',
    description: 'Beautiful outdoor venue surrounded by lush gardens. Ideal for romantic garden weddings with natural beauty.',
    location: 'Kandy',
    address: '456 Peradeniya Road, Kandy',
    capacity: 200,
    amenities: ['Garden Setting', 'Parking', 'Restrooms', 'Changing Rooms', 'Photography Spots'],
    pricing: { minPrice: 150000, maxPrice: 350000, currency: 'LKR' },
    images: [
      '/images/venues/garden-1.jpg',
      '/images/venues/garden-2.jpg',
      '/images/venues/garden-3.jpg'
    ],
    rating: 4.8,
    reviewCount: 41
  },
  {
    name: 'Beachfront Villa',
    description: 'Stunning beachfront location with panoramic ocean views. Perfect for destination weddings by the sea.',
    location: 'Galle',
    address: '789 Beach Road, Galle',
    capacity: 150,
    amenities: ['Beach Access', 'Ocean View', 'Parking', 'Restrooms', 'Sound System'],
    pricing: { minPrice: 180000, maxPrice: 400000, currency: 'LKR' },
    images: [
      '/images/venues/beach-1.jpg',
      '/images/venues/beach-2.jpg',
      '/images/venues/beach-3.jpg'
    ],
    rating: 4.9,
    reviewCount: 29
  }
]

// Sample service packages
const samplePackages = [
  {
    name: 'Premium Wedding Photography Package',
    description: 'Complete wedding photography service with professional editing and online gallery.',
    vendorId: '', // Will be set after vendor creation
    price: 150000,
    duration: 8,
    includes: [
      'Full day coverage (8 hours)',
      '2 professional photographers',
      '500+ edited photos',
      'Online gallery',
      'USB drive with all photos',
      'Engagement session included'
    ],
    category: 'Photography',
    images: [
      '/images/packages/photography-package-1.jpg',
      '/images/packages/photography-package-2.jpg'
    ],
    rating: 4.8,
    reviewCount: 23
  },
  {
    name: 'Royal Wedding Catering Package',
    description: 'Premium catering service with authentic Sri Lankan cuisine and international dishes.',
    vendorId: '', // Will be set after vendor creation
    price: 250000,
    duration: 6,
    includes: [
      'Buffet service for 200 guests',
      'Traditional Sri Lankan dishes',
      'International cuisine options',
      'Beverage service',
      'Professional serving staff',
      'Cleanup service'
    ],
    category: 'Catering',
    images: [
      '/images/packages/catering-package-1.jpg',
      '/images/packages/catering-package-2.jpg'
    ],
    rating: 4.9,
    reviewCount: 45
  },
  {
    name: 'Complete Wedding Planning Service',
    description: 'Full-service wedding planning from concept to execution.',
    vendorId: '', // Will be set after vendor creation
    price: 200000,
    duration: 12,
    includes: [
      'Complete wedding planning',
      'Vendor coordination',
      'Timeline management',
      'Day-of coordination',
      'Setup and breakdown',
      'Emergency support'
    ],
    category: 'Wedding Planning',
    images: [
      '/images/packages/planning-package-1.jpg',
      '/images/packages/planning-package-2.jpg'
    ],
    rating: 4.9,
    reviewCount: 38
  }
]

async function populateContent() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Create sample users for vendors
    const vendorUsers = []
    for (let i = 0; i < sampleVendors.length; i++) {
      const vendorData = sampleVendors[i]
      const user = new User({
        name: vendorData.businessName,
        email: vendorData.contactEmail,
        role: 'vendor',
        image: `/images/vendors/vendor-${i + 1}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await user.save()
      vendorUsers.push(user)
      console.log(`Created vendor user: ${vendorData.businessName}`)
    }

    // Create sample vendors
    const vendors = []
    for (let i = 0; i < sampleVendors.length; i++) {
      const vendorData = sampleVendors[i]
      const vendor = new Vendor({
        userId: vendorUsers[i]._id,
        ...vendorData,
        status: 'approved',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await vendor.save()
      vendors.push(vendor)
      console.log(`Created vendor: ${vendorData.businessName}`)
    }

    // Create sample venues
    const venues = []
    for (const venueData of sampleVenues) {
      const venue = new Venue({
        name: venueData.name,
        description: venueData.description,
        location: venueData.location,
        address: venueData.address,
        capacity: venueData.capacity,
        amenities: venueData.amenities,
        pricing: venueData.pricing,
        images: venueData.images,
        rating: venueData.rating,
        reviewCount: venueData.reviewCount,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await venue.save()
      venues.push(venue)
      console.log(`Created venue: ${venueData.name}`)
    }

    // Create sample service packages
    const packages = []
    for (let i = 0; i < samplePackages.length; i++) {
      const packageData = samplePackages[i]
      const servicePackage = new ServicePackage({
        name: packageData.name,
        description: packageData.description,
        vendorId: vendors[i]._id,
        price: packageData.price,
        duration: packageData.duration,
        includes: packageData.includes,
        category: packageData.category,
        images: packageData.images,
        rating: packageData.rating,
        reviewCount: packageData.reviewCount,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await servicePackage.save()
      packages.push(servicePackage)
      console.log(`Created package: ${packageData.name}`)
    }

    console.log('\n=== Content Population Complete ===')
    console.log(`Created ${vendorUsers.length} vendor users`)
    console.log(`Created ${vendors.length} vendors`)
    console.log(`Created ${venues.length} venues`)
    console.log(`Created ${packages.length} service packages`)
    console.log('\nPlatform is now ready with sample content!')

  } catch (error) {
    console.error('Error populating content:', error)
  }
}

// Run the population script
if (require.main === module) {
  populateContent()
    .then(() => {
      console.log('Content population completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Content population failed:', error)
      process.exit(1)
    })
}

export { populateContent }
