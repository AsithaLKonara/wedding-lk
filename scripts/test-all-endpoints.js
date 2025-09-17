const https = require('https');

const BASE_URL = 'https://wedding-lkcom.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing all API endpoints...\n');

  const endpoints = [
    { name: 'Health Check', url: '/api/simple-health' },
    { name: 'Vendors', url: '/api/vendors' },
    { name: 'Venues', url: '/api/venues' },
    { name: 'Packages', url: '/api/packages' },
    { name: 'Posts', url: '/api/posts' },
    { name: 'Stories', url: '/api/stories' },
    { name: 'Reels', url: '/api/reels' },
    { name: 'Reviews', url: '/api/reviews' },
    { name: 'Bookings', url: '/api/bookings' },
    { name: 'Users', url: '/api/users' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const result = await makeRequest(`${BASE_URL}${endpoint.url}`);
      
      let status = '❌ FAIL';
      let details = '';
      
      if (result.status === 200) {
        if (endpoint.name === 'Health Check') {
          status = '✅ PASS';
          details = 'Health check working';
        } else if (result.data && Array.isArray(result.data)) {
          status = '✅ PASS';
          details = `${result.data.length} items found`;
        } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
          status = '✅ PASS';
          details = `${result.data.data.length} items found`;
        } else if (result.data && result.data.vendors && Array.isArray(result.data.vendors)) {
          status = '✅ PASS';
          details = `${result.data.vendors.length} vendors found`;
        } else if (result.data && result.data.venues && Array.isArray(result.data.venues)) {
          status = '✅ PASS';
          details = `${result.data.venues.length} venues found`;
        } else if (result.data && result.data.packages && Array.isArray(result.data.packages)) {
          status = '✅ PASS';
          details = `${result.data.packages.length} packages found`;
        } else {
          status = '⚠️  PARTIAL';
          details = 'Data structure unexpected';
        }
      } else {
        details = `HTTP ${result.status}`;
      }
      
      console.log(`  ${status} - ${details}`);
      results.push({ name: endpoint.name, status, details, httpStatus: result.status });
      
    } catch (error) {
      console.log(`  ❌ ERROR - ${error.message}`);
      results.push({ name: endpoint.name, status: '❌ ERROR', details: error.message, httpStatus: 0 });
    }
  }

  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.status === '✅ PASS').length;
  const partial = results.filter(r => r.status === '⚠️  PARTIAL').length;
  const failed = results.filter(r => r.status === '❌ FAIL' || r.status === '❌ ERROR').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Partial: ${partial}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed + partial * 0.5) / results.length * 100)}%`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    console.log(`${result.status} ${result.name}: ${result.details} (HTTP ${result.httpStatus})`);
  });

  return results;
}

testAllEndpoints().catch(console.error);
