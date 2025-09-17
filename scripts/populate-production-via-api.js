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

async function populateProductionData() {
  console.log('🚀 Populating production database via API calls...\n');

  // Test venues endpoint first
  console.log('1. Testing venues endpoint...');
  try {
    const venuesResult = await makeRequest(`${BASE_URL}/api/venues`);
    console.log(`   Status: ${venuesResult.status}`);
    if (venuesResult.data && venuesResult.data.venues) {
      console.log(`   Current venues: ${venuesResult.data.venues.length}`);
    } else {
      console.log(`   Response: ${JSON.stringify(venuesResult.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test vendors endpoint
  console.log('\n2. Testing vendors endpoint...');
  try {
    const vendorsResult = await makeRequest(`${BASE_URL}/api/vendors`);
    console.log(`   Status: ${vendorsResult.status}`);
    if (vendorsResult.data && vendorsResult.data.vendors) {
      console.log(`   Current vendors: ${vendorsResult.data.vendors.length}`);
    } else {
      console.log(`   Response: ${JSON.stringify(vendorsResult.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test packages endpoint
  console.log('\n3. Testing packages endpoint...');
  try {
    const packagesResult = await makeRequest(`${BASE_URL}/api/packages`);
    console.log(`   Status: ${packagesResult.status}`);
    if (packagesResult.data && packagesResult.data.packages) {
      console.log(`   Current packages: ${packagesResult.data.packages.length}`);
    } else {
      console.log(`   Response: ${JSON.stringify(packagesResult.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test reviews endpoint
  console.log('\n4. Testing reviews endpoint...');
  try {
    const reviewsResult = await makeRequest(`${BASE_URL}/api/reviews`);
    console.log(`   Status: ${reviewsResult.status}`);
    if (reviewsResult.data && Array.isArray(reviewsResult.data)) {
      console.log(`   Current reviews: ${reviewsResult.data.length}`);
    } else {
      console.log(`   Response: ${JSON.stringify(reviewsResult.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test health endpoint
  console.log('\n5. Testing health endpoint...');
  try {
    const healthResult = await makeRequest(`${BASE_URL}/api/simple-health`);
    console.log(`   Status: ${healthResult.status}`);
    console.log(`   Response: ${JSON.stringify(healthResult.data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✅ Production API testing completed!');
}

populateProductionData().catch(console.error);
