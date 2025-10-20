#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001'

const comprehensiveData = {
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
    },
    {
      name: "Beach Paradise Package",
      description: "Romantic beach wedding package with ocean views and tropical vibes.",
      price: 400000,
      features: {
        "Beach Venue": true,
        "Professional Photography": true,
        "Seafood Catering": true,
        "Live Band": true,
        "Tropical Decoration": true,
        "Wedding Coordinator": true,
        "Transportation": true,
        "Beachfront Suite": true,
        "Video Coverage": true,
        "Bridal Makeup": true,
        "Groom Attire": true,
        "Wedding Cake": true
      },
      category: "Premium",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
      ],
      rating: 4.8,
      isActive: true
    },
    {
      name: "Garden Romance Package",
      description: "Charming garden wedding package with natural beauty and intimate atmosphere.",
      price: 200000,
      features: {
        "Garden Venue": true,
        "Basic Photography": true,
        "Garden Catering": true,
        "Acoustic Music": true,
        "Floral Decoration": true,
        "Wedding Coordinator": false,
        "Transportation": false,
        "Garden Suite": false,
        "Video Coverage": false,
        "Bridal Makeup": false,
        "Groom Attire": false,
        "Wedding Cake": true
      },
      category: "Basic",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop"
      ],
      rating: 4.4,
      isActive: true
    },
    {
      name: "Mountain Escape Package",
      description: "Breathtaking mountain wedding package with panoramic views and fresh air.",
      price: 450000,
      features: {
        "Mountain Venue": true,
        "Professional Photography": true,
        "Mountain Catering": true,
        "Live Band": true,
        "Natural Decoration": true,
        "Wedding Coordinator": true,
        "Transportation": true,
        "Mountain Lodge": true,
        "Video Coverage": true,
        "Bridal Makeup": true,
        "Groom Attire": true,
        "Wedding Cake": true
      },
      category: "Premium",
      images: [
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e8b0?w=800&h=600&fit=crop"
      ],
      rating: 4.7,
      isActive: true
    },
    {
      name: "Historic Elegance Package",
      description: "Unique historic venue package with cultural significance and timeless charm.",
      price: 300000,
      features: {
        "Historic Venue": true,
        "Professional Photography": true,
        "Traditional Catering": true,
        "Classical Music": true,
        "Cultural Decoration": true,
        "Wedding Coordinator": true,
        "Transportation": false,
        "Historic Suite": false,
        "Video Coverage": true,
        "Bridal Makeup": true,
        "Groom Attire": false,
        "Wedding Cake": true
      },
      category: "Standard",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop"
      ],
      rating: 4.5,
      isActive: true
    },
    {
      name: "Luxury Destination Package",
      description: "Ultimate destination wedding package with all-inclusive luxury amenities.",
      price: 750000,
      features: {
        "Luxury Resort": true,
        "Premium Photography": true,
        "Gourmet Catering": true,
        "International Band": true,
        "Luxury Decoration": true,
        "Personal Coordinator": true,
        "Luxury Transportation": true,
        "Presidential Suite": true,
        "Cinematic Video": true,
        "Professional Makeup": true,
        "Designer Attire": true,
        "Custom Wedding Cake": true
      },
      category: "Premium",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ],
      rating: 4.9,
      isActive: true
    }
  ]
}

async function seedPackages() {
  console.log('🌱 Starting comprehensive package seeding...')
  
  for (const packageData of comprehensiveData.packages) {
    try {
      const response = await fetch(`${BASE_URL}/api/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Created package: ${packageData.name}`)
      } else {
        console.error(`❌ Failed to create package: ${packageData.name}`)
        console.error(`   Status: ${response.status}`)
        const error = await response.text()
        console.error(`   Error: ${error}`)
      }
    } catch (error) {
      console.error(`❌ Error creating package ${packageData.name}:`, error.message)
    }
  }
  
  console.log('🎉 Package seeding completed!')
}

// Run the seeding
seedPackages()
