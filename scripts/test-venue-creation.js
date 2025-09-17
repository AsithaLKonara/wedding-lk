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

async function testVenueCreation() {
  console.log('🧪 Testing venue creation with minimal data...\n');

  // Test with minimal required fields
  const minimalVenue = {
    name: "Test Venue",
    description: "This is a test venue description that meets the minimum length requirement",
    location: {
      address: "123 Test Street, Colombo",
      city: "Colombo",
      province: "Western Province"
    },
    capacity: {
      min: 10,
      max: 100
    },
    pricing: {
      basePrice: 50000,
      currency: "LKR"
    },
    owner: "68c9c198207087bceec98636"
  };

  try {
    console.log('Creating minimal venue...');
    const result = await makeRequest(`${BASE_URL}/api/venues`, {
      method: 'POST',
      body: minimalVenue
    });

    console.log(`Status: ${result.status}`);
    console.log(`Response: ${JSON.stringify(result.data, null, 2)}`);

    if (result.status === 201 || result.status === 200) {
      console.log('✅ Venue created successfully!');
    } else {
      console.log('❌ Venue creation failed');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test with vendor field instead of owner
  const venueWithVendor = {
    name: "Test Venue with Vendor",
    description: "This is a test venue description that meets the minimum length requirement",
    location: {
      address: "456 Test Avenue, Colombo",
      city: "Colombo",
      province: "Western Province"
    },
    capacity: {
      min: 20,
      max: 150
    },
    pricing: {
      basePrice: 75000,
      currency: "LKR"
    },
    vendor: "68c9c198207087bceec98636"
  };

  try {
    console.log('\nCreating venue with vendor field...');
    const result = await makeRequest(`${BASE_URL}/api/venues`, {
      method: 'POST',
      body: venueWithVendor
    });

    console.log(`Status: ${result.status}`);
    console.log(`Response: ${JSON.stringify(result.data, null, 2)}`);

    if (result.status === 201 || result.status === 200) {
      console.log('✅ Venue created successfully!');
    } else {
      console.log('❌ Venue creation failed');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testVenueCreation().catch(console.error);
