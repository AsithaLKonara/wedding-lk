const https = require('https');

const BASE_URL = 'https://wedding-lkcom.vercel.app';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = https.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function createVenuesViaAPI() {
  console.log('🏛️ Creating venues via production API...\n');

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
      owner: "68c9c198207087bceec98636", // Use existing user ID
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
      owner: "68c9c198207087bceec98636",
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
      owner: "68c9c198207087bceec98636",
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
      owner: "68c9c198207087bceec98636",
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
      owner: "68c9c198207087bceec98636",
      isActive: true,
      featured: false
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const venue of venues) {
    try {
      console.log(`Creating venue: ${venue.name}...`);
      const result = await makeRequest(`${BASE_URL}/api/venues`, {
        method: 'POST',
        body: venue
      });

      if (result.status === 201 || result.status === 200) {
        console.log(`✅ Successfully created: ${venue.name}`);
        successCount++;
      } else {
        console.log(`❌ Failed to create ${venue.name}: ${result.status} - ${JSON.stringify(result.data)}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error creating ${venue.name}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Successfully created: ${successCount} venues`);
  console.log(`❌ Failed: ${errorCount} venues`);

  // Test the venues endpoint after creation
  console.log('\n🧪 Testing venues endpoint after creation...');
  try {
    const venuesResult = await makeRequest(`${BASE_URL}/api/venues`);
    console.log(`Status: ${venuesResult.status}`);
    if (venuesResult.data && venuesResult.data.venues) {
      console.log(`Total venues now: ${venuesResult.data.venues.length}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

createVenuesViaAPI().catch(console.error);
