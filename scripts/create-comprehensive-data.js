const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database directory
const DB_DIR = path.join(process.cwd(), 'database');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

async function createComprehensiveData() {
  try {
    console.log('🚀 Creating comprehensive sample data...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // 1. USERS DATA
    const users = [
      // Admins
      {
        id: 'admin-1',
        name: 'Admin 1',
        email: 'admin1@wedding.lk',
        password: hashedPassword,
        phone: '+94 77 123 4567',
        role: 'admin',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo',
          zipCode: '00100'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'admin-2',
        name: 'Admin 2',
        email: 'admin2@wedding.lk',
        password: hashedPassword,
        phone: '+94 77 123 4568',
        role: 'admin',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo',
          zipCode: '00100'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Regular Users
      {
        id: 'user-1',
        name: 'Sarah & John',
        email: 'user1@example.com',
        password: hashedPassword,
        phone: '+94 77 111 1111',
        role: 'user',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo',
          zipCode: '00300'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'user-2',
        name: 'Priya & Raj',
        email: 'user2@example.com',
        password: hashedPassword,
        phone: '+94 77 111 1112',
        role: 'user',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Central Province',
          city: 'Kandy',
          zipCode: '20000'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'user-3',
        name: 'Nisha & Kumar',
        email: 'user3@example.com',
        password: hashedPassword,
        phone: '+94 77 111 1113',
        role: 'user',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Southern Province',
          city: 'Galle',
          zipCode: '80000'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Wedding Planners
      {
        id: 'planner-1',
        name: 'Wedding Dreams Planner',
        email: 'planner1@example.com',
        password: hashedPassword,
        phone: '+94 77 333 3331',
        role: 'wedding_planner',
        isVerified: true,
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo',
          zipCode: '00100'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 2. VENDORS DATA
    const vendors = [
      {
        id: 'vendor-1',
        name: 'Royal Wedding Photography',
        businessName: 'Royal Wedding Photography',
        category: 'photographer',
        description: 'Professional wedding photography capturing your precious moments with artistic flair and attention to detail.',
        location: {
          address: '123 Photography Lane, Colombo 07',
          city: 'Colombo',
          province: 'Western Province',
          serviceAreas: ['Colombo', 'Kandy', 'Galle', 'Negombo']
        },
        contact: {
          phone: '+94 77 444 4441',
          email: 'royal@photography.lk',
          website: 'https://royalweddingphoto.lk'
        },
        services: [
          {
            name: 'Basic Photography Package',
            description: '6 hours coverage with 300 edited photos',
            price: 75000,
            duration: '6 hours'
          },
          {
            name: 'Premium Photography Package',
            description: 'Full day coverage with 500 edited photos and album',
            price: 125000,
            duration: 'Full day'
          },
          {
            name: 'Luxury Photography Package',
            description: 'Full day + pre-wedding shoot with 800 photos and premium album',
            price: 200000,
            duration: '2 days'
          }
        ],
        pricing: {
          startingPrice: 75000,
          currency: 'LKR'
        },
        rating: {
          average: 4.8,
          count: 45
        },
        owner: 'vendor-1',
        isVerified: true,
        isActive: true,
        images: ['/images/royal-photo-1.jpg', '/images/royal-photo-2.jpg'],
        socialMedia: {
          website: 'https://royalweddingphoto.lk',
          facebook: 'https://facebook.com/royalweddingphoto',
          instagram: 'https://instagram.com/royalweddingphoto'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vendor-2',
        name: 'Spice Garden Catering',
        businessName: 'Spice Garden Catering Services',
        category: 'catering',
        description: 'Authentic Sri Lankan cuisine with international options for your special day. Fresh ingredients and traditional recipes.',
        location: {
          address: '456 Spice Lane, Kandy',
          city: 'Kandy',
          province: 'Central Province',
          serviceAreas: ['Kandy', 'Colombo', 'Galle', 'Anuradhapura']
        },
        contact: {
          phone: '+94 77 444 4442',
          email: 'spice@catering.lk',
          website: 'https://spicegarden.lk'
        },
        services: [
          {
            name: 'Traditional Sri Lankan Buffet',
            description: 'Traditional Sri Lankan buffet for 100 guests',
            price: 85000,
            duration: 'Full day'
          },
          {
            name: 'Multi-Cuisine Buffet',
            description: 'Multi-cuisine buffet with live cooking stations',
            price: 120000,
            duration: 'Full day'
          },
          {
            name: 'Premium Fine Dining',
            description: 'Premium fine dining experience with 5-course meal',
            price: 180000,
            duration: 'Full day'
          }
        ],
        pricing: {
          startingPrice: 85000,
          currency: 'LKR'
        },
        rating: {
          average: 4.7,
          count: 38
        },
        owner: 'vendor-2',
        isVerified: true,
        isActive: true,
        images: ['/images/spice-garden-1.jpg', '/images/spice-garden-2.jpg'],
        socialMedia: {
          website: 'https://spicegarden.lk',
          facebook: 'https://facebook.com/spicegarden',
          instagram: 'https://instagram.com/spicegarden'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vendor-3',
        name: 'Harmony Music Band',
        businessName: 'Harmony Music Entertainment',
        category: 'music',
        description: 'Professional live music band specializing in wedding entertainment with traditional and modern music.',
        location: {
          address: '789 Music Street, Galle',
          city: 'Galle',
          province: 'Southern Province',
          serviceAreas: ['Galle', 'Colombo', 'Kandy', 'Matara']
        },
        contact: {
          phone: '+94 77 444 4443',
          email: 'harmony@music.lk',
          website: 'https://harmonymusic.lk'
        },
        services: [
          {
            name: 'Basic Music Package',
            description: '4-piece band with 4 hours performance',
            price: 60000,
            duration: '4 hours'
          },
          {
            name: 'Premium Music Package',
            description: '6-piece band with 6 hours performance and DJ',
            price: 95000,
            duration: '6 hours'
          },
          {
            name: 'Luxury Music Package',
            description: '8-piece band with full day performance, DJ and sound system',
            price: 150000,
            duration: 'Full day'
          }
        ],
        pricing: {
          startingPrice: 60000,
          currency: 'LKR'
        },
        rating: {
          average: 4.6,
          count: 32
        },
        owner: 'vendor-3',
        isVerified: true,
        isActive: true,
        images: ['/images/harmony-music-1.jpg', '/images/harmony-music-2.jpg'],
        socialMedia: {
          website: 'https://harmonymusic.lk',
          facebook: 'https://facebook.com/harmonymusic',
          instagram: 'https://instagram.com/harmonymusic'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vendor-4',
        name: 'Elegant Transport Services',
        businessName: 'Elegant Wedding Transport',
        category: 'transport',
        description: 'Luxury wedding transport services with premium vehicles and professional chauffeurs.',
        location: {
          address: '321 Transport Avenue, Colombo 05',
          city: 'Colombo',
          province: 'Western Province',
          serviceAreas: ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Kurunegala']
        },
        contact: {
          phone: '+94 77 444 4444',
          email: 'elegant@transport.lk',
          website: 'https://eleganttransport.lk'
        },
        services: [
          {
            name: 'Basic Transport Package',
            description: 'Bride and groom car with 2 additional cars',
            price: 45000,
            duration: 'Full day'
          },
          {
            name: 'Premium Transport Package',
            description: 'Luxury cars for bride, groom and family (5 cars)',
            price: 75000,
            duration: 'Full day'
          },
          {
            name: 'Luxury Transport Package',
            description: 'Premium luxury cars with professional chauffeurs (8 cars)',
            price: 120000,
            duration: 'Full day'
          }
        ],
        pricing: {
          startingPrice: 45000,
          currency: 'LKR'
        },
        rating: {
          average: 4.5,
          count: 28
        },
        owner: 'vendor-4',
        isVerified: true,
        isActive: true,
        images: ['/images/elegant-transport-1.jpg', '/images/elegant-transport-2.jpg'],
        socialMedia: {
          website: 'https://eleganttransport.lk',
          facebook: 'https://facebook.com/eleganttransport',
          instagram: 'https://instagram.com/eleganttransport'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vendor-5',
        name: 'Glamour Makeup Studio',
        businessName: 'Glamour Wedding Makeup',
        category: 'makeup',
        description: 'Professional wedding makeup and hair styling services for brides and wedding parties.',
        location: {
          address: '654 Beauty Lane, Kandy',
          city: 'Kandy',
          province: 'Central Province',
          serviceAreas: ['Kandy', 'Colombo', 'Galle', 'Anuradhapura']
        },
        contact: {
          phone: '+94 77 444 4445',
          email: 'glamour@makeup.lk',
          website: 'https://glamourmakeup.lk'
        },
        services: [
          {
            name: 'Bride Makeup Package',
            description: 'Bride makeup and hair styling',
            price: 25000,
            duration: '3 hours'
          },
          {
            name: 'Bridal Party Package',
            description: 'Bride + 4 bridesmaids makeup and hair',
            price: 75000,
            duration: '5 hours'
          },
          {
            name: 'Complete Wedding Package',
            description: 'Bride + bridal party + family makeup and hair',
            price: 120000,
            duration: 'Full day'
          }
        ],
        pricing: {
          startingPrice: 25000,
          currency: 'LKR'
        },
        rating: {
          average: 4.9,
          count: 52
        },
        owner: 'vendor-5',
        isVerified: true,
        isActive: true,
        images: ['/images/glamour-makeup-1.jpg', '/images/glamour-makeup-2.jpg'],
        socialMedia: {
          website: 'https://glamourmakeup.lk',
          facebook: 'https://facebook.com/glamourmakeup',
          instagram: 'https://instagram.com/glamourmakeup'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 3. VENUES DATA
    const venues = [
      {
        id: 'venue-1',
        name: 'Grand Ballroom Hotel',
        description: 'Elegant ballroom with crystal chandeliers, marble floors, and modern amenities. Perfect for grand weddings.',
        location: {
          address: '123 Grand Avenue, Colombo 07',
          city: 'Colombo',
          province: 'Western Province',
          coordinates: {
            latitude: 6.9271,
            longitude: 79.8612
          }
        },
        capacity: {
          min: 100,
          max: 300
        },
        amenities: ['Air Conditioning', 'Parking', 'Catering Kitchen', 'Sound System', 'Lighting', 'Restrooms', 'Bridal Suite', 'Garden'],
        pricing: {
          startingPrice: 250000,
          currency: 'LKR'
        },
        rating: {
          average: 4.7,
          count: 25
        },
        owner: 'venue-1',
        isVerified: true,
        isActive: true,
        images: ['/images/grand-ballroom-1.jpg', '/images/grand-ballroom-2.jpg'],
        packages: [
          {
            name: 'Basic Venue Package',
            description: 'Venue rental with basic amenities',
            price: 250000,
            includes: ['Venue rental', 'Basic sound system', 'Lighting', 'Parking']
          },
          {
            name: 'Premium Venue Package',
            description: 'Venue rental with premium amenities',
            price: 350000,
            includes: ['Venue rental', 'Premium sound system', 'Professional lighting', 'Parking', 'Bridal suite']
          },
          {
            name: 'Luxury Venue Package',
            description: 'Complete venue package with all amenities',
            price: 450000,
            includes: ['Venue rental', 'Premium sound system', 'Professional lighting', 'Parking', 'Bridal suite', 'Garden access', 'Catering kitchen']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'venue-2',
        name: 'Garden Paradise Resort',
        description: 'Beautiful outdoor venue surrounded by lush gardens and tropical plants. Perfect for nature lovers.',
        location: {
          address: '456 Garden Road, Kandy',
          city: 'Kandy',
          province: 'Central Province',
          coordinates: {
            latitude: 7.2906,
            longitude: 80.6337
          }
        },
        capacity: {
          min: 50,
          max: 200
        },
        amenities: ['Garden Setting', 'Parking', 'Catering Kitchen', 'Sound System', 'Lighting', 'Restrooms', 'Natural Scenery'],
        pricing: {
          startingPrice: 180000,
          currency: 'LKR'
        },
        rating: {
          average: 4.5,
          count: 18
        },
        owner: 'venue-2',
        isVerified: true,
        isActive: true,
        images: ['/images/garden-paradise-1.jpg', '/images/garden-paradise-2.jpg'],
        packages: [
          {
            name: 'Garden Basic Package',
            description: 'Garden venue with basic amenities',
            price: 180000,
            includes: ['Garden venue', 'Basic sound system', 'Lighting', 'Parking']
          },
          {
            name: 'Garden Premium Package',
            description: 'Garden venue with premium amenities',
            price: 250000,
            includes: ['Garden venue', 'Premium sound system', 'Professional lighting', 'Parking', 'Catering kitchen']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'venue-3',
        name: 'Seaside Wedding Villa',
        description: 'Stunning beachfront venue with ocean views and tropical ambiance. Perfect for destination weddings.',
        location: {
          address: '789 Beach Road, Galle',
          city: 'Galle',
          province: 'Southern Province',
          coordinates: {
            latitude: 6.0329,
            longitude: 80.2169
          }
        },
        capacity: {
          min: 30,
          max: 150
        },
        amenities: ['Beachfront', 'Parking', 'Catering Kitchen', 'Sound System', 'Lighting', 'Restrooms', 'Ocean View', 'Tropical Garden'],
        pricing: {
          startingPrice: 200000,
          currency: 'LKR'
        },
        rating: {
          average: 4.8,
          count: 22
        },
        owner: 'venue-3',
        isVerified: true,
        isActive: true,
        images: ['/images/seaside-villa-1.jpg', '/images/seaside-villa-2.jpg'],
        packages: [
          {
            name: 'Beach Basic Package',
            description: 'Beachfront venue with basic amenities',
            price: 200000,
            includes: ['Beachfront venue', 'Basic sound system', 'Lighting', 'Parking']
          },
          {
            name: 'Beach Premium Package',
            description: 'Beachfront venue with premium amenities',
            price: 300000,
            includes: ['Beachfront venue', 'Premium sound system', 'Professional lighting', 'Parking', 'Catering kitchen', 'Ocean view setup']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 4. BOOKINGS DATA
    const bookings = [
      {
        id: 'booking-1',
        client: 'user-1',
        vendor: 'vendor-1',
        venue: 'venue-1',
        service: 'Premium Photography Package',
        date: '2024-06-15T00:00:00.000Z',
        startTime: '10:00',
        endTime: '18:00',
        guestCount: 120,
        totalAmount: 125000,
        status: 'confirmed',
        paymentStatus: 'completed',
        specialRequirements: 'Traditional Sri Lankan wedding ceremony',
        notes: 'Anniversary celebration with family',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        id: 'booking-2',
        client: 'user-2',
        vendor: 'vendor-2',
        venue: 'venue-2',
        service: 'Multi-Cuisine Buffet',
        date: '2024-07-20T00:00:00.000Z',
        startTime: '12:00',
        endTime: '20:00',
        guestCount: 80,
        totalAmount: 120000,
        status: 'pending',
        paymentStatus: 'partial',
        specialRequirements: 'Vegetarian and halal options required',
        notes: 'Wedding reception for 80 guests',
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z'
      },
      {
        id: 'booking-3',
        client: 'user-3',
        vendor: 'vendor-3',
        venue: 'venue-3',
        service: 'Premium Music Package',
        date: '2024-08-10T00:00:00.000Z',
        startTime: '14:00',
        endTime: '22:00',
        guestCount: 100,
        totalAmount: 95000,
        status: 'confirmed',
        paymentStatus: 'completed',
        specialRequirements: 'Traditional and modern music mix',
        notes: 'Beach wedding with live music',
        createdAt: '2024-01-25T00:00:00.000Z',
        updatedAt: '2024-01-25T00:00:00.000Z'
      }
    ];

    // 5. REVIEWS DATA
    const reviews = [
      {
        id: 'review-1',
        client: 'user-1',
        vendor: 'vendor-1',
        venue: 'venue-1',
        booking: 'booking-1',
        rating: 5,
        review: 'Absolutely amazing photography service! The team captured every precious moment beautifully. Highly professional and creative. Worth every penny!',
        isVerified: true,
        helpful: 12,
        images: ['/images/review-1-1.jpg'],
        createdAt: '2024-01-16T00:00:00.000Z',
        updatedAt: '2024-01-16T00:00:00.000Z'
      },
      {
        id: 'review-2',
        client: 'user-2',
        vendor: 'vendor-2',
        venue: 'venue-2',
        booking: 'booking-2',
        rating: 4,
        review: 'Great food and excellent service. The Spice Garden team was very professional and the food was delicious. The venue was beautiful too.',
        isVerified: true,
        helpful: 8,
        images: ['/images/review-2-1.jpg'],
        createdAt: '2024-01-21T00:00:00.000Z',
        updatedAt: '2024-01-21T00:00:00.000Z'
      },
      {
        id: 'review-3',
        client: 'user-3',
        vendor: 'vendor-3',
        venue: 'venue-3',
        booking: 'booking-3',
        rating: 5,
        review: 'Fantastic music and entertainment! The Harmony band made our wedding unforgettable. Great mix of traditional and modern music. Highly recommended!',
        isVerified: true,
        helpful: 15,
        images: ['/images/review-3-1.jpg'],
        createdAt: '2024-01-26T00:00:00.000Z',
        updatedAt: '2024-01-26T00:00:00.000Z'
      }
    ];

    // 6. TASKS DATA
    const tasks = [
      {
        id: 'task-1',
        title: 'Venue Selection',
        description: 'Research and select wedding venue',
        client: 'user-1',
        planner: 'planner-1',
        category: 'venue',
        priority: 'high',
        dueDate: '2024-03-15T00:00:00.000Z',
        status: 'completed',
        estimatedHours: 8,
        actualHours: 6,
        notes: 'Client approved the Grand Ballroom Hotel',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'task-2',
        title: 'Catering Menu Finalization',
        description: 'Finalize wedding menu with caterer',
        client: 'user-1',
        planner: 'planner-1',
        category: 'catering',
        priority: 'medium',
        dueDate: '2024-04-01T00:00:00.000Z',
        status: 'in_progress',
        estimatedHours: 4,
        actualHours: 2,
        notes: 'Waiting for client feedback on menu options',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'task-3',
        title: 'Photography Booking',
        description: 'Book wedding photographer',
        client: 'user-2',
        planner: 'planner-1',
        category: 'photography',
        priority: 'high',
        dueDate: '2024-03-20T00:00:00.000Z',
        status: 'pending',
        estimatedHours: 3,
        actualHours: 0,
        notes: 'Need to compare packages and prices',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    // 7. PAYMENTS DATA
    const payments = [
      {
        id: 'payment-1',
        booking: 'booking-1',
        client: 'user-1',
        vendor: 'vendor-1',
        amount: 125000,
        currency: 'LKR',
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN000001',
        paymentDate: '2024-01-15T00:00:00.000Z',
        notes: 'Full payment for photography package',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        id: 'payment-2',
        booking: 'booking-2',
        client: 'user-2',
        vendor: 'vendor-2',
        amount: 60000,
        currency: 'LKR',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN000002',
        paymentDate: '2024-01-20T00:00:00.000Z',
        notes: '50% advance payment for catering',
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z'
      },
      {
        id: 'payment-3',
        booking: 'booking-3',
        client: 'user-3',
        vendor: 'vendor-3',
        amount: 95000,
        currency: 'LKR',
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN000003',
        paymentDate: '2024-01-25T00:00:00.000Z',
        notes: 'Full payment for music package',
        createdAt: '2024-01-25T00:00:00.000Z',
        updatedAt: '2024-01-25T00:00:00.000Z'
      }
    ];

    // Write all data to files
    fs.writeFileSync(path.join(DB_DIR, 'users.json'), JSON.stringify(users, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'vendors.json'), JSON.stringify(vendors, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'venues.json'), JSON.stringify(venues, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'bookings.json'), JSON.stringify(bookings, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'reviews.json'), JSON.stringify(reviews, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2));
    fs.writeFileSync(path.join(DB_DIR, 'payments.json'), JSON.stringify(payments, null, 2));

    console.log('✅ Comprehensive sample data created successfully!');
    console.log('\n📊 Data Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏢 Vendors: ${vendors.length}`);
    console.log(`   🏛️ Venues: ${venues.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   ⭐ Reviews: ${reviews.length}`);
    console.log(`   📋 Tasks: ${tasks.length}`);
    console.log(`   💳 Payments: ${payments.length}`);

    console.log('\n🔑 Test Credentials:');
    console.log('   All accounts use password: admin123');
    console.log('   Admin: admin1@wedding.lk / admin123');
    console.log('   User: user1@example.com / admin123');
    console.log('   Planner: planner1@example.com / admin123');

  } catch (error) {
    console.error('❌ Error creating comprehensive data:', error);
  }
}

// Run the script
createComprehensiveData();
