const https = require('https');

const BASE_URL = 'https://wedding-lkcom.vercel.app';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'WeddingLK-Test-Script/1.0',
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
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function updatePackagesWithVendors() {
  console.log('🔧 Updating packages with vendors...\n');

  try {
    // Get packages
    console.log('1. Fetching packages...');
    const packagesResult = await makeRequest(`${BASE_URL}/api/packages`);
    if (packagesResult.status !== 200) {
      console.log('❌ Failed to fetch packages');
      return;
    }
    
    const packages = packagesResult.data.packages;
    console.log(`   Found ${packages.length} packages`);

    // Get vendors
    console.log('\n2. Fetching vendors...');
    const vendorsResult = await makeRequest(`${BASE_URL}/api/vendors`);
    if (vendorsResult.status !== 200) {
      console.log('❌ Failed to fetch vendors');
      return;
    }
    
    const vendors = vendorsResult.data.vendors;
    console.log(`   Found ${vendors.length} vendors`);

    // Update each package with vendors
    console.log('\n3. Updating packages with vendors...');
    for (let i = 0; i < packages.length; i++) {
      const packageData = packages[i];
      console.log(`   Updating package: ${packageData.name}`);
      
      // Assign 2-3 vendors to each package
      const vendorIds = vendors.slice(0, Math.min(3, vendors.length)).map(v => v._id);
      
      const updateData = {
        ...packageData,
        vendors: vendorIds
      };

      // Note: Since we don't have a PUT endpoint for packages, we'll just log what should be updated
      console.log(`     Should assign vendors: ${vendorIds.join(', ')}`);
    }

    console.log('\n📊 Package-Vendor Assignment Summary:');
    console.log('=====================================');
    console.log('✅ Packages found:', packages.length);
    console.log('✅ Vendors available:', vendors.length);
    console.log('✅ Each package should have 2-3 vendors assigned');
    
    console.log('\n🎯 Recommendation:');
    console.log('   Update packages in the database to include vendor references');
    console.log('   This will enable proper booking functionality');

  } catch (error) {
    console.error('❌ Error updating packages:', error.message);
  }
}

updatePackagesWithVendors();
