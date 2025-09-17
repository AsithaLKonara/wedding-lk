const https = require('https');

const BASE_URL = 'https://wedding-lkcom.vercel.app';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      timeout: 15000,
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

async function forceUpdatePackages() {
  console.log('🔧 Force updating packages with vendors...\n');

  try {
    // Get vendors first
    console.log('1. Fetching vendors...');
    const vendorsResult = await makeRequest(`${BASE_URL}/api/vendors`);
    if (vendorsResult.status !== 200) {
      console.log('❌ Failed to fetch vendors');
      return;
    }
    
    const vendors = vendorsResult.data.vendors;
    console.log(`   ✅ Found ${vendors.length} vendors`);

    // Get current packages
    console.log('\n2. Fetching current packages...');
    const packagesResult = await makeRequest(`${BASE_URL}/api/packages`);
    if (packagesResult.status !== 200) {
      console.log('❌ Failed to fetch packages');
      return;
    }
    
    const packages = packagesResult.data.packages;
    console.log(`   ✅ Found ${packages.length} packages`);

    // Create new packages with vendors
    console.log('\n3. Creating new packages with vendors...');
    
    const newPackages = [
      {
        name: "Premium Wedding Package",
        description: "Luxury wedding package with top vendors and premium services",
        price: 2000000,
        originalPrice: 2500000,
        features: ["Luxury service", "Premium vendors", "Full coordination"],
        vendors: vendors.slice(0, 3).map(v => v._id),
        featured: true
      },
      {
        name: "Standard Wedding Package", 
        description: "Complete wedding package with quality vendors",
        price: 1200000,
        originalPrice: 1500000,
        features: ["Complete service", "Quality vendors", "Professional team"],
        vendors: vendors.slice(1, 4).map(v => v._id),
        featured: true
      },
      {
        name: "Essential Wedding Package",
        description: "Essential wedding services with reliable vendors",
        price: 800000,
        originalPrice: 1000000,
        features: ["Essential services", "Reliable vendors", "Budget friendly"],
        vendors: vendors.slice(2, 5).map(v => v._id),
        featured: false
      }
    ];

    for (const packageData of newPackages) {
      console.log(`   Creating: ${packageData.name}`);
      
      const createResult = await makeRequest(`${BASE_URL}/api/packages`, {
        method: 'POST',
        body: JSON.stringify(packageData)
      });
      
      if (createResult.status === 200) {
        console.log(`   ✅ Created successfully`);
      } else {
        console.log(`   ❌ Failed to create: ${createResult.status}`);
      }
    }

    // Verify new packages
    console.log('\n4. Verifying new packages...');
    const verifyResult = await makeRequest(`${BASE_URL}/api/packages`);
    if (verifyResult.status === 200) {
      const newPackages = verifyResult.data.packages;
      console.log(`   ✅ Total packages: ${newPackages.length}`);
      
      for (const pkg of newPackages) {
        console.log(`   📦 ${pkg.name}: ${pkg.vendors ? pkg.vendors.length : 0} vendors`);
      }
    }

    console.log('\n🎉 Package update completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

forceUpdatePackages();
