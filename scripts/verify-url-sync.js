#!/usr/bin/env node

const https = require('https');

const TARGET_URL = 'https://wedding-lkcom.vercel.app';
const CURRENT_DEPLOYMENT = 'https://wedding-i8lcm8jy5-asithalkonaras-projects.vercel.app';

console.log('🔍 Verifying URL synchronization...');
console.log('Target URL:', TARGET_URL);
console.log('Current Deployment:', CURRENT_DEPLOYMENT);

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testAuthentication(url, label) {
  console.log(`\n🔐 Testing authentication on ${label}...`);
  
  try {
    const response = await makeRequest(`${url}/api/simple-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@weddinglk.com',
        password: 'admin123'
      })
    });
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ Authentication working on ${label}`);
      console.log(`   User: ${response.data.user.name} (${response.data.user.role})`);
      return true;
    } else {
      console.log(`❌ Authentication failed on ${label}:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Authentication error on ${label}:`, error.message);
    return false;
  }
}

async function testDashboardAccess(url, label) {
  console.log(`\n🏠 Testing dashboard access on ${label}...`);
  
  try {
    const response = await makeRequest(`${url}/dashboard`);
    
    if (response.status === 200) {
      console.log(`✅ Dashboard accessible on ${label}`);
      return true;
    } else {
      console.log(`❌ Dashboard not accessible on ${label} (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Dashboard error on ${label}:`, error.message);
    return false;
  }
}

async function testAPIEndpoints(url, label) {
  console.log(`\n🔌 Testing API endpoints on ${label}...`);
  
  const endpoints = [
    '/api/health',
    '/api/debug-auth',
    '/api/notifications',
    '/api/venues/search',
    '/api/vendors/search',
    '/api/favorites',
    '/api/packages'
  ];
  
  let working = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${url}${endpoint}`);
      if (response.status === 200) {
        console.log(`  ✅ ${endpoint}`);
        working++;
      } else {
        console.log(`  ❌ ${endpoint} (${response.status})`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint} (Error: ${error.message})`);
    }
  }
  
  console.log(`  📊 ${working}/${endpoints.length} APIs working`);
  return working === endpoints.length;
}

async function runTests() {
  console.log('🚀 Starting comprehensive URL verification...\n');
  
  // Test target URL (wedding-lkcom.vercel.app)
  const targetAuth = await testAuthentication(TARGET_URL, 'Target URL');
  const targetDashboard = await testDashboardAccess(TARGET_URL, 'Target URL');
  const targetAPIs = await testAPIEndpoints(TARGET_URL, 'Target URL');
  
  // Test current deployment
  const currentAuth = await testAuthentication(CURRENT_DEPLOYMENT, 'Current Deployment');
  const currentDashboard = await testDashboardAccess(CURRENT_DEPLOYMENT, 'Current Deployment');
  const currentAPIs = await testAPIEndpoints(CURRENT_DEPLOYMENT, 'Current Deployment');
  
  // Summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('========================');
  console.log(`Target URL (${TARGET_URL}):`);
  console.log(`  Authentication: ${targetAuth ? '✅' : '❌'}`);
  console.log(`  Dashboard: ${targetDashboard ? '✅' : '❌'}`);
  console.log(`  APIs: ${targetAPIs ? '✅' : '❌'}`);
  
  console.log(`\nCurrent Deployment (${CURRENT_DEPLOYMENT}):`);
  console.log(`  Authentication: ${currentAuth ? '✅' : '❌'}`);
  console.log(`  Dashboard: ${currentDashboard ? '✅' : '❌'}`);
  console.log(`  APIs: ${currentAPIs ? '✅' : '❌'}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (targetAuth && targetDashboard && targetAPIs) {
    console.log('✅ Target URL is fully functional - use this for production');
  } else if (currentAuth && currentDashboard && currentAPIs) {
    console.log('⚠️  Current deployment is functional but target URL needs updating');
    console.log('   Consider updating the target URL project with latest code');
  } else {
    console.log('❌ Both URLs have issues - check deployment and configuration');
  }
  
  if (!targetAuth) {
    console.log('🔧 Target URL needs test users - run: node scripts/create-test-users.js');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Use the working URL for production');
  console.log('2. Update environment variables to point to the working URL');
  console.log('3. Test all dashboard features on the working URL');
}

runTests().catch(console.error);
