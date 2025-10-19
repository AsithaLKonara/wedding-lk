/**
 * WeddingLK - Comprehensive Seed Data
 * 
 * This file contains realistic seed data for the WeddingLK platform
 * with proper relational structure and realistic content.
 * 
 * Usage: npm run seed
 */

export const seedData = {
  // Users (5 users with realistic profiles)
  users: [
    {
      id: "user_001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+94771234567",
      role: "bride",
      avatar: "/assets/avatars/bride_001.jpg",
      weddingDate: "2025-06-15",
      budget: 2500000,
      location: "Colombo",
      preferences: {
        venueType: ["hotel", "garden"],
        vendorCategories: ["photography", "catering", "decorations"],
        theme: "modern-elegant"
      },
      createdAt: new Date("2024-10-01"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "user_002", 
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+94782345678",
      role: "groom",
      avatar: "/assets/avatars/groom_001.jpg",
      weddingDate: "2025-08-22",
      budget: 1800000,
      location: "Kandy",
      preferences: {
        venueType: ["traditional", "outdoor"],
        vendorCategories: ["music", "flowers", "transportation"],
        theme: "traditional-luxury"
      },
      createdAt: new Date("2024-10-05"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "user_003",
      name: "Priya Fernando",
      email: "priya.fernando@email.com", 
      phone: "+94793456789",
      role: "bride",
      avatar: "/assets/avatars/bride_002.jpg",
      weddingDate: "2025-12-10",
      budget: 3200000,
      location: "Galle",
      preferences: {
        venueType: ["beach", "resort"],
        vendorCategories: ["photography", "videography", "catering"],
        theme: "beach-romantic"
      },
      createdAt: new Date("2024-10-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "user_004",
      name: "David Kumar",
      email: "david.kumar@email.com",
      phone: "+94784567890",
      role: "groom",
      avatar: "/assets/avatars/groom_002.jpg",
      weddingDate: "2025-04-18",
      budget: 1500000,
      location: "Bentota",
      preferences: {
        venueType: ["garden", "hotel"],
        vendorCategories: ["music", "decorations", "cake"],
        theme: "garden-rustic"
      },
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "user_005",
      name: "Lisa Perera",
      email: "lisa.perera@email.com",
      phone: "+94795678901",
      role: "bride",
      avatar: "/assets/avatars/bride_003.jpg",
      weddingDate: "2025-09-05",
      budget: 2800000,
      location: "Nuwara Eliya",
      preferences: {
        venueType: ["mountain", "traditional"],
        vendorCategories: ["photography", "flowers", "makeup"],
        theme: "mountain-elegant"
      },
      createdAt: new Date("2024-10-18"),
      updatedAt: new Date("2024-10-19")
    }
  ],

  // Venues (10 venues with comprehensive details)
  venues: [
    {
      id: "venue_001",
      name: "Grand Ballroom Hotel",
      location: "Colombo",
      address: "123 Galle Road, Colombo 03",
      capacity: 300,
      priceRange: [150000, 250000],
      rating: 4.8,
      reviewCount: 127,
      amenities: ["parking", "air-conditioning", "catering", "sound-system", "bridal-suite"],
      images: [
        "/assets/venues/grand_ballroom_01.jpg",
        "/assets/venues/grand_ballroom_02.jpg",
        "/assets/venues/grand_ballroom_03.jpg"
      ],
      featured: true,
      description: "Elegant ballroom with panoramic city views, perfect for grand celebrations.",
      contact: {
        phone: "+94771234567",
        email: "events@grandballroom.lk",
        website: "www.grandballroom.lk"
      },
      availability: ["2025-06-15", "2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_002",
      name: "Garden Paradise Resort",
      location: "Kandy",
      address: "45 Temple Road, Kandy",
      capacity: 250,
      priceRange: [120000, 200000],
      rating: 4.9,
      reviewCount: 89,
      amenities: ["garden", "parking", "catering", "decorations", "bridal-suite"],
      images: [
        "/assets/venues/garden_paradise_01.jpg",
        "/assets/venues/garden_paradise_02.jpg",
        "/assets/venues/garden_paradise_03.jpg"
      ],
      featured: false,
      description: "Beautiful garden setting with traditional architecture and modern amenities.",
      contact: {
        phone: "+94782345678",
        email: "weddings@gardenparadise.lk",
        website: "www.gardenparadise.lk"
      },
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_003",
      name: "Beachfront Villa",
      location: "Bentota",
      address: "Beach Road, Bentota",
      capacity: 200,
      priceRange: [100000, 180000],
      rating: 4.7,
      reviewCount: 156,
      amenities: ["beach-access", "parking", "air-conditioning", "photography"],
      images: [
        "/assets/venues/beachfront_villa_01.jpg",
        "/assets/venues/beachfront_villa_02.jpg",
        "/assets/venues/beachfront_villa_03.jpg"
      ],
      featured: true,
      description: "Stunning beachfront location with ocean views and tropical atmosphere.",
      contact: {
        phone: "+94793456789",
        email: "events@beachfrontvilla.lk",
        website: "www.beachfrontvilla.lk"
      },
      availability: ["2025-06-15", "2025-08-22"],
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_004",
      name: "Traditional Kandyan Hall",
      location: "Kandy",
      address: "78 Temple Street, Kandy",
      capacity: 180,
      priceRange: [80000, 150000],
      rating: 4.6,
      reviewCount: 73,
      amenities: ["traditional", "parking", "catering", "sound-system"],
      images: [
        "/assets/venues/kandyan_hall_01.jpg",
        "/assets/venues/kandyan_hall_02.jpg",
        "/assets/venues/kandyan_hall_03.jpg"
      ],
      featured: false,
      description: "Authentic Kandyan architecture with traditional decor and modern facilities.",
      contact: {
        phone: "+94784567890",
        email: "info@kandyanhall.lk",
        website: "www.kandyanhall.lk"
      },
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-04-05"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_005",
      name: "Mountain View Resort",
      location: "Nuwara Eliya",
      address: "12 Tea Garden Road, Nuwara Eliya",
      capacity: 120,
      priceRange: [90000, 160000],
      rating: 4.9,
      reviewCount: 94,
      amenities: ["mountain-view", "parking", "heating", "catering"],
      images: [
        "/assets/venues/mountain_view_01.jpg",
        "/assets/venues/mountain_view_02.jpg",
        "/assets/venues/mountain_view_03.jpg"
      ],
      featured: true,
      description: "Breathtaking mountain views with cozy atmosphere and luxury amenities.",
      contact: {
        phone: "+94795678901",
        email: "weddings@mountainview.lk",
        website: "www.mountainview.lk"
      },
      availability: ["2025-09-05"],
      createdAt: new Date("2024-05-12"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_006",
      name: "Luxury Beach Resort",
      location: "Galle",
      address: "Beach Road, Galle Fort",
      capacity: 400,
      priceRange: [200000, 350000],
      rating: 4.8,
      reviewCount: 203,
      amenities: ["beach-access", "spa", "catering", "photography", "transportation"],
      images: [
        "/assets/venues/luxury_beach_01.jpg",
        "/assets/venues/luxury_beach_02.jpg",
        "/assets/venues/luxury_beach_03.jpg"
      ],
      featured: true,
      description: "Premium beach resort with luxury amenities and stunning ocean views.",
      contact: {
        phone: "+94706789012",
        email: "events@luxurybeach.lk",
        website: "www.luxurybeach.lk"
      },
      availability: ["2025-06-15", "2025-12-10"],
      createdAt: new Date("2024-06-20"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_007",
      name: "Heritage Palace",
      location: "Colombo",
      address: "156 Independence Avenue, Colombo 07",
      capacity: 350,
      priceRange: [180000, 280000],
      rating: 4.7,
      reviewCount: 145,
      amenities: ["heritage", "parking", "catering", "sound-system", "bridal-suite"],
      images: [
        "/assets/venues/heritage_palace_01.jpg",
        "/assets/venues/heritage_palace_02.jpg",
        "/assets/venues/heritage_palace_03.jpg"
      ],
      featured: false,
      description: "Historic palace with colonial architecture and royal ambiance.",
      contact: {
        phone: "+94717890123",
        email: "weddings@heritagepalace.lk",
        website: "www.heritagepalace.lk"
      },
      availability: ["2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-07-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_008",
      name: "Riverside Garden",
      location: "Bentota",
      address: "Riverside Road, Bentota",
      capacity: 150,
      priceRange: [70000, 130000],
      rating: 4.5,
      reviewCount: 67,
      amenities: ["river-view", "garden", "parking", "catering"],
      images: [
        "/assets/venues/riverside_garden_01.jpg",
        "/assets/venues/riverside_garden_02.jpg",
        "/assets/venues/riverside_garden_03.jpg"
      ],
      featured: false,
      description: "Tranquil riverside setting with beautiful gardens and natural beauty.",
      contact: {
        phone: "+94728901234",
        email: "info@riversidegarden.lk",
        website: "www.riversidegarden.lk"
      },
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-08-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_009",
      name: "City Center Ballroom",
      location: "Colombo",
      address: "89 Main Street, Colombo 02",
      capacity: 280,
      priceRange: [140000, 220000],
      rating: 4.6,
      reviewCount: 112,
      amenities: ["city-center", "parking", "air-conditioning", "catering", "sound-system"],
      images: [
        "/assets/venues/city_center_01.jpg",
        "/assets/venues/city_center_02.jpg",
        "/assets/venues/city_center_03.jpg"
      ],
      featured: false,
      description: "Modern ballroom in the heart of Colombo with contemporary design.",
      contact: {
        phone: "+94739012345",
        email: "events@citycenter.lk",
        website: "www.citycenter.lk"
      },
      availability: ["2025-06-15", "2025-08-22"],
      createdAt: new Date("2024-09-05"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "venue_010",
      name: "Tea Estate Manor",
      location: "Nuwara Eliya",
      address: "Tea Estate Road, Nuwara Eliya",
      capacity: 100,
      priceRange: [60000, 120000],
      rating: 4.8,
      reviewCount: 89,
      amenities: ["tea-estate", "mountain-view", "parking", "catering"],
      images: [
        "/assets/venues/tea_estate_01.jpg",
        "/assets/venues/tea_estate_02.jpg",
        "/assets/venues/tea_estate_03.jpg"
      ],
      featured: false,
      description: "Charming tea estate manor with colonial charm and mountain views.",
      contact: {
        phone: "+94740123456",
        email: "weddings@teaestate.lk",
        website: "www.teaestate.lk"
      },
      availability: ["2025-09-05"],
      createdAt: new Date("2024-10-01"),
      updatedAt: new Date("2024-10-19")
    }
  ],

  // Vendors (10 vendors with comprehensive portfolios)
  vendors: [
    {
      id: "vendor_001",
      name: "Elegant Photography Studio",
      category: "photography",
      location: "Colombo",
      address: "123 Galle Road, Colombo 03",
      rating: 4.8,
      reviewCount: 127,
      priceRange: [50000, 150000],
      experience: "8+ years",
      portfolio: [
        "/assets/vendors/elegant_photo_01.jpg",
        "/assets/vendors/elegant_photo_02.jpg",
        "/assets/vendors/elegant_photo_03.jpg"
      ],
      featured: true,
      description: "Professional wedding photography with a modern artistic approach.",
      contact: {
        phone: "+94771234567",
        email: "info@elegantphoto.lk",
        website: "elegantphoto.lk"
      },
      services: ["Pre-wedding", "Ceremony", "Reception", "Photo Editing", "Albums"],
      specialties: ["candid", "portrait", "documentary"],
      availability: ["2025-06-15", "2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_002",
      name: "Blissful Blooms",
      category: "flowers",
      location: "Kandy",
      address: "45 Temple Road, Kandy",
      rating: 4.9,
      reviewCount: 89,
      priceRange: [30000, 100000],
      experience: "12+ years",
      portfolio: [
        "/assets/vendors/blissful_blooms_01.jpg",
        "/assets/vendors/blissful_blooms_02.jpg",
        "/assets/vendors/blissful_blooms_03.jpg"
      ],
      featured: false,
      description: "Beautiful floral arrangements with fresh, locally sourced flowers.",
      contact: {
        phone: "+94782345678",
        email: "info@blissfulblooms.lk",
        website: "blissfulblooms.lk"
      },
      services: ["Bridal Bouquets", "Centerpieces", "Ceremony Decor", "Reception Flowers", "Delivery"],
      specialties: ["traditional", "modern", "seasonal"],
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_003",
      name: "Royal Catering Services",
      category: "catering",
      location: "Colombo",
      address: "78 Main Street, Colombo 02",
      rating: 4.7,
      reviewCount: 156,
      priceRange: [40000, 120000],
      experience: "15+ years",
      portfolio: [
        "/assets/vendors/royal_catering_01.jpg",
        "/assets/vendors/royal_catering_02.jpg",
        "/assets/vendors/royal_catering_03.jpg"
      ],
      featured: true,
      description: "Premium catering services with authentic Sri Lankan and international cuisine.",
      contact: {
        phone: "+94793456789",
        email: "info@royalcatering.lk",
        website: "royalcatering.lk"
      },
      services: ["Buffet", "Plated Service", "Cocktail Reception", "Desserts", "Beverages"],
      specialties: ["sri-lankan", "international", "vegetarian"],
      availability: ["2025-06-15", "2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-03-20"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_004",
      name: "Melody Masters",
      category: "music",
      location: "Colombo",
      address: "56 Music Lane, Colombo 05",
      rating: 4.6,
      reviewCount: 73,
      priceRange: [25000, 80000],
      experience: "10+ years",
      portfolio: [
        "/assets/vendors/melody_masters_01.jpg",
        "/assets/vendors/melody_masters_02.jpg",
        "/assets/vendors/melody_masters_03.jpg"
      ],
      featured: false,
      description: "Professional DJ and live music services for all wedding celebrations.",
      contact: {
        phone: "+94784567890",
        email: "info@melodymasters.lk",
        website: "melodymasters.lk"
      },
      services: ["DJ Services", "Live Band", "Sound System", "Lighting", "MC Services"],
      specialties: ["bollywood", "western", "traditional"],
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-04-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_005",
      name: "Glamour Makeup Studio",
      category: "makeup",
      location: "Kandy",
      address: "34 Beauty Street, Kandy",
      rating: 4.8,
      reviewCount: 94,
      priceRange: [15000, 50000],
      experience: "6+ years",
      portfolio: [
        "/assets/vendors/glamour_makeup_01.jpg",
        "/assets/vendors/glamour_makeup_02.jpg",
        "/assets/vendors/glamour_makeup_03.jpg"
      ],
      featured: true,
      description: "Professional makeup and hair styling for brides and wedding parties.",
      contact: {
        phone: "+94795678901",
        email: "info@glamourmakeup.lk",
        website: "glamourmakeup.lk"
      },
      services: ["Bridal Makeup", "Hair Styling", "Bridal Party", "Trial Sessions", "Touch-ups"],
      specialties: ["natural", "glamorous", "traditional"],
      availability: ["2025-09-05"],
      createdAt: new Date("2024-05-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_006",
      name: "Dream Decorations",
      category: "decorations",
      location: "Colombo",
      address: "89 Decor Avenue, Colombo 04",
      rating: 4.7,
      reviewCount: 112,
      priceRange: [35000, 90000],
      experience: "9+ years",
      portfolio: [
        "/assets/vendors/dream_decorations_01.jpg",
        "/assets/vendors/dream_decorations_02.jpg",
        "/assets/vendors/dream_decorations_03.jpg"
      ],
      featured: false,
      description: "Creative wedding decorations and event styling services.",
      contact: {
        phone: "+94706789012",
        email: "info@dreamdecorations.lk",
        website: "dreamdecorations.lk"
      },
      services: ["Venue Decoration", "Stage Setup", "Lighting", "Props", "Setup & Cleanup"],
      specialties: ["modern", "traditional", "themed"],
      availability: ["2025-06-15", "2025-08-22"],
      createdAt: new Date("2024-06-25"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_007",
      name: "Luxury Transportation",
      category: "transportation",
      location: "Colombo",
      address: "12 Vehicle Road, Colombo 06",
      rating: 4.5,
      reviewCount: 67,
      priceRange: [20000, 60000],
      experience: "7+ years",
      portfolio: [
        "/assets/vendors/luxury_transport_01.jpg",
        "/assets/vendors/luxury_transport_02.jpg",
        "/assets/vendors/luxury_transport_03.jpg"
      ],
      featured: false,
      description: "Premium transportation services with luxury vehicles for special occasions.",
      contact: {
        phone: "+94717890123",
        email: "info@luxurytransport.lk",
        website: "luxurytransport.lk"
      },
      services: ["Bridal Car", "Family Cars", "Guest Transportation", "Airport Transfer", "Chauffeur Service"],
      specialties: ["luxury-cars", "vintage-cars", "limousines"],
      availability: ["2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-07-30"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_008",
      name: "Sweet Dreams Bakery",
      category: "cake",
      location: "Kandy",
      address: "67 Baker Street, Kandy",
      rating: 4.9,
      reviewCount: 145,
      priceRange: [25000, 75000],
      experience: "11+ years",
      portfolio: [
        "/assets/vendors/sweet_dreams_01.jpg",
        "/assets/vendors/sweet_dreams_02.jpg",
        "/assets/vendors/sweet_dreams_03.jpg"
      ],
      featured: true,
      description: "Artisan wedding cakes and desserts made with premium ingredients.",
      contact: {
        phone: "+94728901234",
        email: "info@sweetdreamsbakery.lk",
        website: "sweetdreamsbakery.lk"
      },
      services: ["Wedding Cakes", "Cupcakes", "Desserts", "Tasting Sessions", "Delivery"],
      specialties: ["custom-designs", "flavors", "allergies-friendly"],
      availability: ["2025-04-18", "2025-09-05"],
      createdAt: new Date("2024-08-20"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_009",
      name: "Cinematic Studios",
      category: "videography",
      location: "Colombo",
      address: "45 Film Street, Colombo 07",
      rating: 4.8,
      reviewCount: 98,
      priceRange: [60000, 180000],
      experience: "13+ years",
      portfolio: [
        "/assets/vendors/cinematic_studios_01.jpg",
        "/assets/vendors/cinematic_studios_02.jpg",
        "/assets/vendors/cinematic_studios_03.jpg"
      ],
      featured: false,
      description: "Professional wedding videography with cinematic storytelling approach.",
      contact: {
        phone: "+94739012345",
        email: "info@cinematicstudios.lk",
        website: "cinematicstudios.lk"
      },
      services: ["Wedding Film", "Highlight Reel", "Documentary Style", "Drone Footage", "Editing"],
      specialties: ["cinematic", "documentary", "drone"],
      availability: ["2025-06-15", "2025-12-10"],
      createdAt: new Date("2024-09-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "vendor_010",
      name: "Perfect Planning Co.",
      category: "planning",
      location: "Colombo",
      address: "23 Planner Lane, Colombo 08",
      rating: 4.9,
      reviewCount: 203,
      priceRange: [80000, 200000],
      experience: "16+ years",
      portfolio: [
        "/assets/vendors/perfect_planning_01.jpg",
        "/assets/vendors/perfect_planning_02.jpg",
        "/assets/vendors/perfect_planning_03.jpg"
      ],
      featured: true,
      description: "Full-service wedding planning and coordination for stress-free celebrations.",
      contact: {
        phone: "+94740123456",
        email: "info@perfectplanning.lk",
        website: "perfectplanning.lk"
      },
      services: ["Full Planning", "Partial Planning", "Day Coordination", "Vendor Management", "Timeline Creation"],
      specialties: ["destination-weddings", "cultural-weddings", "budget-planning"],
      availability: ["2025-06-15", "2025-08-22", "2025-12-10"],
      createdAt: new Date("2024-10-05"),
      updatedAt: new Date("2024-10-19")
    }
  ],

  // Bookings (5 realistic bookings)
  bookings: [
    {
      id: "booking_001",
      userId: "user_001",
      venueId: "venue_001",
      vendorIds: ["vendor_001", "vendor_003", "vendor_006"],
      date: "2025-06-15",
      time: "18:00",
      guestCount: 250,
      totalAmount: 450000,
      status: "confirmed",
      paymentStatus: "paid",
      specialRequests: "Vegetarian options for 20 guests",
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "booking_002",
      userId: "user_002",
      venueId: "venue_002",
      vendorIds: ["vendor_002", "vendor_004", "vendor_008"],
      date: "2025-08-22",
      time: "17:30",
      guestCount: 180,
      totalAmount: 320000,
      status: "confirmed",
      paymentStatus: "partial",
      specialRequests: "Traditional Kandyan dance performance",
      createdAt: new Date("2024-10-10"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "booking_003",
      userId: "user_003",
      venueId: "venue_006",
      vendorIds: ["vendor_001", "vendor_009", "vendor_010"],
      date: "2025-12-10",
      time: "19:00",
      guestCount: 300,
      totalAmount: 650000,
      status: "pending",
      paymentStatus: "pending",
      specialRequests: "Beach ceremony setup",
      createdAt: new Date("2024-10-18"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "booking_004",
      userId: "user_004",
      venueId: "venue_004",
      vendorIds: ["vendor_004", "vendor_006", "vendor_007"],
      date: "2025-04-18",
      time: "16:00",
      guestCount: 120,
      totalAmount: 180000,
      status: "confirmed",
      paymentStatus: "paid",
      specialRequests: "Traditional music throughout ceremony",
      createdAt: new Date("2024-10-12"),
      updatedAt: new Date("2024-10-19")
    },
    {
      id: "booking_005",
      userId: "user_005",
      venueId: "venue_005",
      vendorIds: ["vendor_002", "vendor_005", "vendor_008"],
      date: "2025-09-05",
      time: "17:00",
      guestCount: 80,
      totalAmount: 220000,
      status: "confirmed",
      paymentStatus: "paid",
      specialRequests: "Mountain-themed decorations",
      createdAt: new Date("2024-10-16"),
      updatedAt: new Date("2024-10-19")
    }
  ],

  // Payments (5 payments linked to bookings)
  payments: [
    {
      id: "payment_001",
      bookingId: "booking_001",
      userId: "user_001",
      amount: 450000,
      currency: "LKR",
      method: "credit_card",
      status: "completed",
      transactionId: "TXN_001_20241015",
      paidAt: new Date("2024-10-15T10:30:00Z"),
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date("2024-10-15")
    },
    {
      id: "payment_002",
      bookingId: "booking_002",
      userId: "user_002",
      amount: 160000,
      currency: "LKR",
      method: "bank_transfer",
      status: "completed",
      transactionId: "TXN_002_20241010",
      paidAt: new Date("2024-10-10T14:20:00Z"),
      createdAt: new Date("2024-10-10"),
      updatedAt: new Date("2024-10-10")
    },
    {
      id: "payment_003",
      bookingId: "booking_003",
      userId: "user_003",
      amount: 0,
      currency: "LKR",
      method: "pending",
      status: "pending",
      transactionId: null,
      paidAt: null,
      createdAt: new Date("2024-10-18"),
      updatedAt: new Date("2024-10-18")
    },
    {
      id: "payment_004",
      bookingId: "booking_004",
      userId: "user_004",
      amount: 180000,
      currency: "LKR",
      method: "credit_card",
      status: "completed",
      transactionId: "TXN_004_20241012",
      paidAt: new Date("2024-10-12T09:15:00Z"),
      createdAt: new Date("2024-10-12"),
      updatedAt: new Date("2024-10-12")
    },
    {
      id: "payment_005",
      bookingId: "booking_005",
      userId: "user_005",
      amount: 220000,
      currency: "LKR",
      method: "debit_card",
      status: "completed",
      transactionId: "TXN_005_20241016",
      paidAt: new Date("2024-10-16T16:45:00Z"),
      createdAt: new Date("2024-10-16"),
      updatedAt: new Date("2024-10-16")
    }
  ],

  // Feed Posts (10 social feed posts)
  feedPosts: [
    {
      id: "post_001",
      userId: "user_001",
      author: "Sarah Johnson",
      avatar: "/assets/avatars/bride_001.jpg",
      content: "Just booked our dream venue! Grand Ballroom Hotel is absolutely perfect for our June wedding. Can't wait to see it decorated! 💕",
      image: "/assets/feed/venue_booking_01.jpg",
      type: "venue",
      location: "Colombo",
      likes: 23,
      comments: 8,
      shares: 3,
      timestamp: new Date("2024-10-19T10:30:00Z"),
      createdAt: new Date("2024-10-19T10:30:00Z"),
      updatedAt: new Date("2024-10-19T10:30:00Z")
    },
    {
      id: "post_002",
      userId: "vendor_001",
      author: "Elegant Photography Studio",
      avatar: "/assets/vendors/elegant_photo_01.jpg",
      content: "Beautiful candid moments from last weekend's wedding at Garden Paradise Resort. Love capturing these precious memories! 📸",
      image: "/assets/feed/photography_01.jpg",
      type: "vendor",
      location: "Kandy",
      likes: 45,
      comments: 12,
      shares: 7,
      timestamp: new Date("2024-10-18T15:20:00Z"),
      createdAt: new Date("2024-10-18T15:20:00Z"),
      updatedAt: new Date("2024-10-18T15:20:00Z")
    },
    {
      id: "post_003",
      userId: "user_002",
      author: "Michael Chen",
      avatar: "/assets/avatars/groom_001.jpg",
      content: "Tried the cake samples from Sweet Dreams Bakery today. The chocolate raspberry is incredible! Highly recommend! 🍰",
      image: "/assets/feed/cake_tasting_01.jpg",
      type: "vendor",
      location: "Kandy",
      likes: 18,
      comments: 5,
      shares: 2,
      timestamp: new Date("2024-10-17T14:45:00Z"),
      createdAt: new Date("2024-10-17T14:45:00Z"),
      updatedAt: new Date("2024-10-17T14:45:00Z")
    },
    {
      id: "post_004",
      userId: "user_003",
      author: "Priya Fernando",
      avatar: "/assets/avatars/bride_002.jpg",
      content: "Beach wedding planning is so exciting! Found the perfect resort in Galle with stunning ocean views. December can't come soon enough! 🌊",
      image: "/assets/feed/beach_wedding_01.jpg",
      type: "venue",
      location: "Galle",
      likes: 31,
      comments: 9,
      shares: 4,
      timestamp: new Date("2024-10-16T11:15:00Z"),
      createdAt: new Date("2024-10-16T11:15:00Z"),
      updatedAt: new Date("2024-10-16T11:15:00Z")
    },
    {
      id: "post_005",
      userId: "vendor_003",
      author: "Royal Catering Services",
      avatar: "/assets/vendors/royal_catering_01.jpg",
      content: "Our signature Sri Lankan buffet was a hit at yesterday's wedding! Traditional flavors with modern presentation. Book us for your special day! 🍽️",
      image: "/assets/feed/catering_01.jpg",
      type: "vendor",
      location: "Colombo",
      likes: 52,
      comments: 15,
      shares: 8,
      timestamp: new Date("2024-10-15T13:30:00Z"),
      createdAt: new Date("2024-10-15T13:30:00Z"),
      updatedAt: new Date("2024-10-15T13:30:00Z")
    },
    {
      id: "post_006",
      userId: "user_004",
      author: "David Kumar",
      avatar: "/assets/avatars/groom_002.jpg",
      content: "Traditional Kandyan wedding planning is going smoothly. The hall we booked has such authentic architecture. Can't wait for April! 🏛️",
      image: "/assets/feed/traditional_wedding_01.jpg",
      type: "venue",
      location: "Kandy",
      likes: 27,
      comments: 6,
      shares: 3,
      timestamp: new Date("2024-10-14T16:20:00Z"),
      createdAt: new Date("2024-10-14T16:20:00Z"),
      updatedAt: new Date("2024-10-14T16:20:00Z")
    },
    {
      id: "post_007",
      userId: "vendor_005",
      author: "Glamour Makeup Studio",
      avatar: "/assets/vendors/glamour_makeup_01.jpg",
      content: "Bridal makeup trial session completed! Natural glam look with traditional touches. The bride looked absolutely stunning! ✨",
      image: "/assets/feed/makeup_trial_01.jpg",
      type: "vendor",
      location: "Kandy",
      likes: 38,
      comments: 11,
      shares: 5,
      timestamp: new Date("2024-10-13T12:00:00Z"),
      createdAt: new Date("2024-10-13T12:00:00Z"),
      updatedAt: new Date("2024-10-13T12:00:00Z")
    },
    {
      id: "post_008",
      userId: "user_005",
      author: "Lisa Perera",
      avatar: "/assets/avatars/bride_003.jpg",
      content: "Mountain wedding in Nuwara Eliya is going to be magical! The venue has breathtaking views and cozy atmosphere. September wedding dreams! 🏔️",
      image: "/assets/feed/mountain_wedding_01.jpg",
      type: "venue",
      location: "Nuwara Eliya",
      likes: 41,
      comments: 13,
      shares: 6,
      timestamp: new Date("2024-10-12T09:45:00Z"),
      createdAt: new Date("2024-10-12T09:45:00Z"),
      updatedAt: new Date("2024-10-12T09:45:00Z")
    },
    {
      id: "post_009",
      userId: "vendor_008",
      author: "Sweet Dreams Bakery",
      avatar: "/assets/vendors/sweet_dreams_01.jpg",
      content: "Custom wedding cake design completed! Three-tier chocolate cake with mountain-themed decorations. The couple loved it! 🎂",
      image: "/assets/feed/custom_cake_01.jpg",
      type: "vendor",
      location: "Kandy",
      likes: 29,
      comments: 7,
      shares: 4,
      timestamp: new Date("2024-10-11T14:15:00Z"),
      createdAt: new Date("2024-10-11T14:15:00Z"),
      updatedAt: new Date("2024-10-11T14:15:00Z")
    },
    {
      id: "post_010",
      userId: "vendor_010",
      author: "Perfect Planning Co.",
      avatar: "/assets/vendors/perfect_planning_01.jpg",
      content: "Full wedding planning service completed for a beautiful beach wedding! Everything went perfectly. Thank you for trusting us with your special day! 💒",
      image: "/assets/feed/planning_complete_01.jpg",
      type: "vendor",
      location: "Galle",
      likes: 67,
      comments: 18,
      shares: 9,
      timestamp: new Date("2024-10-10T17:30:00Z"),
      createdAt: new Date("2024-10-10T17:30:00Z"),
      updatedAt: new Date("2024-10-10T17:30:00Z")
    }
  ],

  // Reviews (10 reviews with realistic content)
  reviews: [
    {
      id: "review_001",
      userId: "user_001",
      venueId: "venue_001",
      vendorId: null,
      rating: 5,
      title: "Absolutely Perfect Venue!",
      content: "Grand Ballroom Hotel exceeded all our expectations. The staff was incredibly professional, the food was delicious, and the venue was beautifully decorated. Highly recommend for any wedding!",
      images: ["/assets/reviews/venue_001_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-19T10:30:00Z"),
      updatedAt: new Date("2024-10-19T10:30:00Z")
    },
    {
      id: "review_002",
      userId: "user_002",
      venueId: null,
      vendorId: "vendor_001",
      rating: 5,
      title: "Outstanding Photography!",
      content: "Elegant Photography Studio captured every precious moment of our wedding. The photos are absolutely stunning and we couldn't be happier with the results. Worth every penny!",
      images: ["/assets/reviews/vendor_001_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-18T15:20:00Z"),
      updatedAt: new Date("2024-10-18T15:20:00Z")
    },
    {
      id: "review_003",
      userId: "user_003",
      venueId: "venue_006",
      vendorId: null,
      rating: 4,
      title: "Beautiful Beach Resort",
      content: "Luxury Beach Resort provided a stunning backdrop for our beach wedding. The ocean views were breathtaking and the service was excellent. Only minor issue was the weather, but that's not their fault!",
      images: ["/assets/reviews/venue_006_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-17T14:45:00Z"),
      updatedAt: new Date("2024-10-17T14:45:00Z")
    },
    {
      id: "review_004",
      userId: "user_004",
      venueId: null,
      vendorId: "vendor_003",
      rating: 5,
      title: "Amazing Catering Service!",
      content: "Royal Catering Services provided an incredible feast for our wedding. The traditional Sri Lankan dishes were authentic and delicious. All our guests were impressed!",
      images: ["/assets/reviews/vendor_003_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-16T11:15:00Z"),
      updatedAt: new Date("2024-10-16T11:15:00Z")
    },
    {
      id: "review_005",
      userId: "user_005",
      venueId: "venue_005",
      vendorId: null,
      rating: 5,
      title: "Magical Mountain Venue!",
      content: "Mountain View Resort was the perfect choice for our mountain wedding. The views were absolutely spectacular and the atmosphere was cozy and romantic. Highly recommend!",
      images: ["/assets/reviews/venue_005_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-15T13:30:00Z"),
      updatedAt: new Date("2024-10-15T13:30:00Z")
    },
    {
      id: "review_006",
      userId: "user_001",
      venueId: null,
      vendorId: "vendor_002",
      rating: 4,
      title: "Beautiful Floral Arrangements",
      content: "Blissful Blooms created stunning floral arrangements for our wedding. The flowers were fresh and beautifully arranged. The only reason for 4 stars is the slightly higher price.",
      images: ["/assets/reviews/vendor_002_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-14T16:20:00Z"),
      updatedAt: new Date("2024-10-14T16:20:00Z")
    },
    {
      id: "review_007",
      userId: "user_002",
      venueId: null,
      vendorId: "vendor_004",
      rating: 4,
      title: "Great Music and DJ Service",
      content: "Melody Masters kept our wedding party going all night long! The music selection was perfect and the DJ was professional. The sound system was excellent quality.",
      images: ["/assets/reviews/vendor_004_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-13T12:00:00Z"),
      updatedAt: new Date("2024-10-13T12:00:00Z")
    },
    {
      id: "review_008",
      userId: "user_003",
      venueId: null,
      vendorId: "vendor_005",
      rating: 5,
      title: "Perfect Bridal Makeup!",
      content: "Glamour Makeup Studio made me look absolutely beautiful on my wedding day. The makeup was flawless and lasted all day. The trial session was very helpful too!",
      images: ["/assets/reviews/vendor_005_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-12T09:45:00Z"),
      updatedAt: new Date("2024-10-12T09:45:00Z")
    },
    {
      id: "review_009",
      userId: "user_004",
      venueId: null,
      vendorId: "vendor_008",
      rating: 5,
      title: "Delicious Wedding Cake!",
      content: "Sweet Dreams Bakery created the most beautiful and delicious wedding cake. The design was exactly what we wanted and the taste was incredible. Highly recommend!",
      images: ["/assets/reviews/vendor_008_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-11T14:15:00Z"),
      updatedAt: new Date("2024-10-11T14:15:00Z")
    },
    {
      id: "review_010",
      userId: "user_005",
      venueId: null,
      vendorId: "vendor_010",
      rating: 5,
      title: "Excellent Wedding Planning Service!",
      content: "Perfect Planning Co. made our wedding planning stress-free and enjoyable. They handled everything perfectly and our wedding day was flawless. Worth every penny!",
      images: ["/assets/reviews/vendor_010_review_01.jpg"],
      verified: true,
      createdAt: new Date("2024-10-10T17:30:00Z"),
      updatedAt: new Date("2024-10-10T17:30:00Z")
    }
  ],

  // Notifications (10 notifications for users)
  notifications: [
    {
      id: "notification_001",
      userId: "user_001",
      title: "Booking Confirmed!",
      message: "Your booking at Grand Ballroom Hotel for June 15, 2025 has been confirmed.",
      type: "booking",
      read: false,
      actionUrl: "/dashboard/bookings",
      actionText: "View Booking",
      createdAt: new Date("2024-10-19T10:30:00Z"),
      updatedAt: new Date("2024-10-19T10:30:00Z")
    },
    {
      id: "notification_002",
      userId: "user_002",
      title: "Payment Reminder",
      message: "Your remaining payment for your August 22, 2025 wedding is due in 30 days.",
      type: "payment",
      read: false,
      actionUrl: "/payment",
      actionText: "Pay Now",
      createdAt: new Date("2024-10-18T15:20:00Z"),
      updatedAt: new Date("2024-10-18T15:20:00Z")
    },
    {
      id: "notification_003",
      userId: "user_003",
      title: "New Vendor Quote",
      message: "Elegant Photography Studio has sent you a custom quote for your wedding.",
      type: "vendor",
      read: false,
      actionUrl: "/vendors/vendor_001",
      actionText: "View Quote",
      createdAt: new Date("2024-10-17T14:45:00Z"),
      updatedAt: new Date("2024-10-17T14:45:00Z")
    },
    {
      id: "notification_004",
      userId: "user_004",
      title: "Wedding Planning Reminder",
      message: "Don't forget to finalize your catering menu by next week.",
      type: "reminder",
      read: true,
      actionUrl: "/dashboard/planner",
      actionText: "View Planner",
      createdAt: new Date("2024-10-16T11:15:00Z"),
      updatedAt: new Date("2024-10-16T11:15:00Z")
    },
    {
      id: "notification_005",
      userId: "user_005",
      title: "Special Promotion Available",
      message: "Get 20% off on floral arrangements this month. Limited time offer!",
      type: "promotion",
      read: true,
      actionUrl: "/vendors?category=flowers",
      actionText: "View Offer",
      createdAt: new Date("2024-10-15T13:30:00Z"),
      updatedAt: new Date("2024-10-15T13:30:00Z")
    },
    {
      id: "notification_006",
      userId: "user_001",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM. Service may be temporarily unavailable.",
      type: "system",
      read: true,
      actionUrl: null,
      actionText: null,
      createdAt: new Date("2024-10-14T16:20:00Z"),
      updatedAt: new Date("2024-10-14T16:20:00Z")
    },
    {
      id: "notification_007",
      userId: "user_002",
      title: "New Message from Vendor",
      message: "Blissful Blooms has sent you a message regarding your flower arrangements.",
      type: "message",
      read: false,
      actionUrl: "/chat",
      actionText: "View Message",
      createdAt: new Date("2024-10-13T12:00:00Z"),
      updatedAt: new Date("2024-10-13T12:00:00Z")
    },
    {
      id: "notification_008",
      userId: "user_003",
      title: "Booking Reminder",
      message: "Reminder: Your booking at Luxury Beach Resort is tomorrow.",
      type: "reminder",
      read: false,
      actionUrl: "/dashboard/bookings",
      actionText: "View Booking",
      createdAt: new Date("2024-10-12T09:45:00Z"),
      updatedAt: new Date("2024-10-12T09:45:00Z")
    },
    {
      id: "notification_009",
      userId: "user_004",
      title: "Review Request",
      message: "How was your experience with Royal Catering Services? Please leave a review.",
      type: "review",
      read: true,
      actionUrl: "/reviews/write",
      actionText: "Write Review",
      createdAt: new Date("2024-10-11T14:15:00Z"),
      updatedAt: new Date("2024-10-11T14:15:00Z")
    },
    {
      id: "notification_010",
      userId: "user_005",
      title: "Wedding Countdown",
      message: "Only 30 days until your wedding! Make sure everything is ready.",
      type: "reminder",
      read: false,
      actionUrl: "/dashboard/planner",
      actionText: "View Checklist",
      createdAt: new Date("2024-10-10T17:30:00Z"),
      updatedAt: new Date("2024-10-10T17:30:00Z")
    }
  ]
};

// Export individual collections for easy access
export const { users, venues, vendors, bookings, payments, feedPosts, reviews, notifications } = seedData;

// Export metadata
export const seedMetadata = {
  totalRecords: {
    users: seedData.users.length,
    venues: seedData.venues.length,
    vendors: seedData.vendors.length,
    bookings: seedData.bookings.length,
    payments: seedData.payments.length,
    feedPosts: seedData.feedPosts.length,
    reviews: seedData.reviews.length,
    notifications: seedData.notifications.length
  },
  createdAt: new Date("2024-10-19T00:00:00Z"),
  version: "1.0.0",
  description: "Comprehensive seed data for WeddingLK platform with realistic relational structure"
};

export default seedData;
