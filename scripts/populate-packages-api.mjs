#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001'

const samplePackages = [
  {
    name: 'Royal Wedding Package',
    description: 'Complete luxury wedding package with premium amenities and services',
    price: 500000,
    features: {
      'Luxury Venue': true,
      'Professional Photography': true,
      'Premium Catering': true,
      'Live Music Band': true,
      'Floral Decoration': true,
      'Wedding Coordinator': true,
      'Transportation': true,
      'Honeymoon Suite': true,
      'Video Coverage': true,
      'Bridal Makeup': true,
      'Groom Attire': true,
      'Wedding Cake': true
    },
    category: 'Premium',
    images: ['royal-wedding-1.jpg', 'royal-wedding-2.jpg'],
    rating: 4.9,
    isActive: true
  },
  {
    name: 'Elegant Wedding Package',
    description: 'Sophisticated wedding package with elegant touches and professional services',
    price: 350000,
    features: {
      'Elegant Venue': true,
      'Professional Photography': true,
      'Quality Catering': true,
      'DJ Music': true,
      'Basic Decoration': true,
      'Wedding Coordinator': true,
      'Transportation': false,
      'Honeymoon Suite': false,
      'Video Coverage': true,
      'Bridal Makeup': true,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Standard',
    images: ['elegant-wedding-1.jpg', 'elegant-wedding-2.jpg'],
    rating: 4.6,
    isActive: true
  },
  {
    name: 'Classic Wedding Package',
    description: 'Traditional wedding package with essential services and timeless elegance',
    price: 250000,
    features: {
      'Classic Venue': true,
      'Basic Photography': true,
      'Standard Catering': true,
      'DJ Music': false,
      'Basic Decoration': true,
      'Wedding Coordinator': false,
      'Transportation': false,
      'Honeymoon Suite': false,
      'Video Coverage': false,
      'Bridal Makeup': false,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Basic',
    images: ['classic-wedding-1.jpg'],
    rating: 4.3,
    isActive: true
  },
  {
    name: 'Beach Wedding Package',
    description: 'Romantic beach wedding package with ocean views and tropical vibes',
    price: 400000,
    features: {
      'Beachfront Venue': true,
      'Professional Photography': true,
      'Seafood Catering': true,
      'Acoustic Music': true,
      'Tropical Decoration': true,
      'Wedding Coordinator': true,
      'Transportation': true,
      'Beach Resort Suite': true,
      'Video Coverage': true,
      'Bridal Makeup': true,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Premium',
    images: ['beach-wedding-1.jpg', 'beach-wedding-2.jpg'],
    rating: 4.8,
    isActive: true
  },
  {
    name: 'Garden Wedding Package',
    description: 'Charming garden wedding package with natural beauty and outdoor elegance',
    price: 300000,
    features: {
      'Garden Venue': true,
      'Professional Photography': true,
      'Garden Catering': true,
      'String Quartet': true,
      'Floral Decoration': true,
      'Wedding Coordinator': true,
      'Transportation': false,
      'Garden Cottage': true,
      'Video Coverage': true,
      'Bridal Makeup': true,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Standard',
    images: ['garden-wedding-1.jpg'],
    rating: 4.5,
    isActive: true
  },
  {
    name: 'Intimate Wedding Package',
    description: 'Small and intimate wedding package for close family and friends',
    price: 150000,
    features: {
      'Intimate Venue': true,
      'Basic Photography': true,
      'Family Catering': true,
      'Background Music': false,
      'Simple Decoration': true,
      'Wedding Coordinator': false,
      'Transportation': false,
      'Guest House': false,
      'Video Coverage': false,
      'Bridal Makeup': false,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Basic',
    images: ['intimate-wedding-1.jpg'],
    rating: 4.2,
    isActive: true
  },
  {
    name: 'Destination Wedding Package',
    description: 'Exotic destination wedding package with unique experiences and memories',
    price: 600000,
    features: {
      'Exotic Venue': true,
      'Professional Photography': true,
      'Local Cuisine': true,
      'Cultural Music': true,
      'Traditional Decoration': true,
      'Wedding Coordinator': true,
      'Airport Transfer': true,
      'Luxury Resort': true,
      'Video Coverage': true,
      'Bridal Makeup': true,
      'Groom Attire': true,
      'Wedding Cake': true
    },
    category: 'Premium',
    images: ['destination-wedding-1.jpg', 'destination-wedding-2.jpg'],
    rating: 4.9,
    isActive: true
  },
  {
    name: 'Budget Wedding Package',
    description: 'Affordable wedding package with essential services for budget-conscious couples',
    price: 100000,
    features: {
      'Simple Venue': true,
      'Basic Photography': false,
      'Basic Catering': true,
      'Background Music': false,
      'Minimal Decoration': true,
      'Wedding Coordinator': false,
      'Transportation': false,
      'Basic Accommodation': false,
      'Video Coverage': false,
      'Bridal Makeup': false,
      'Groom Attire': false,
      'Wedding Cake': true
    },
    category: 'Basic',
    images: ['budget-wedding-1.jpg'],
    rating: 4.0,
    isActive: true
  }
]

async function populatePackages() {
  try {
    console.log('🔗 Testing API connection...')
    const testResponse = await fetch(`${BASE_URL}/api/packages`)
    if (!testResponse.ok) {
      throw new Error(`API not available: ${testResponse.status}`)
    }
    
    console.log('📦 Current packages:')
    const currentPackages = await testResponse.json()
    console.log(`Found ${currentPackages.length} existing packages`)
    
    console.log('➕ Adding new packages via API...')
    let successCount = 0
    
    for (const pkg of samplePackages) {
      try {
        const response = await fetch(`${BASE_URL}/api/packages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pkg)
        })
        
        if (response.ok) {
          console.log(`   ✅ Added: ${pkg.name}`)
          successCount++
        } else {
          console.log(`   ❌ Failed: ${pkg.name} - ${response.status}`)
        }
      } catch (error) {
        console.log(`   ❌ Error adding ${pkg.name}:`, error.message)
      }
    }
    
    console.log(`\n🎉 Successfully added ${successCount}/${samplePackages.length} packages!`)
    
    // Test the updated packages
    console.log('\n🔍 Testing updated packages...')
    const updatedResponse = await fetch(`${BASE_URL}/api/packages`)
    const updatedPackages = await updatedResponse.json()
    console.log(`Total packages now: ${updatedPackages.length}`)
    
  } catch (error) {
    console.error('❌ Error populating packages:', error.message)
  }
}

// Run the script
populatePackages()
