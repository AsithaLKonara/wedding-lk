#!/usr/bin/env node

const https = require('https');

const PRODUCTION_URL = 'https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app';

console.log('🧪 WeddingLK Production Services Test Suite\n');
console.log(`📍 Testing: ${PRODUCTION_URL}\n`);

async function testProductionServices() {
  const tests = [
    {
      name: 'Basic Health Check',
      endpoint: '/api/simple-health',
      method: 'GET',
      expectedStatus: 200,
      description: 'Test basic application health'
    },
    {
      name: 'Database Connection',
      endpoint: '/api/health',
      method: 'GET',
      expectedStatus: 200,
      description: 'Test MongoDB connection'
    },
    {
      name: 'Authentication Endpoint',
      endpoint: '/api/auth/signin',
      method: 'GET',
      expectedStatus: 200,
      description: 'Test NextAuth.js configuration'
    },
    {
      name: 'Google OAuth',
      endpoint: '/api/auth/callback/google',
      method: 'GET',
      expectedStatus: 302,
      description: 'Test Google OAuth redirect'
    },
    {
      name: 'Payment Intent',
      endpoint: '/api/payments/create-intent',
      method: 'POST',
      expectedStatus: 400, // Expected without proper data
      description: 'Test Stripe integration'
    },
    {
      name: 'User Registration',
      endpoint: '/api/auth/register',
      method: 'POST',
      expectedStatus: 400, // Expected without proper data
      description: 'Test user registration endpoint'
    },
    {
      name: 'Vendor Registration',
      endpoint: '/api/vendors/register',
      method: 'POST',
      expectedStatus: 400, // Expected without proper data
      description: 'Test vendor registration endpoint'
    },
    {
      name: 'Search Functionality',
      endpoint: '/api/search',
      method: 'GET',
      expectedStatus: 200,
      description: 'Test search API'
    },
    {
      name: 'Notifications',
      endpoint: '/api/notifications',
      method: 'GET',
      expectedStatus: 401, // Expected without auth
      description: 'Test notifications API'
    },
    {
      name: 'Messages',
      endpoint: '/api/messages',
      method: 'GET',
      expectedStatus: 401, // Expected without auth
      description: 'Test messaging API'
    }
  ];

  const results = [];
  
  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    
    try {
      const result = await makeRequest(test.endpoint, test.method);
      const success = result.status === test.expectedStatus;
      
      results.push({
        name: test.name,
        success,
        status: result.status,
        expected: test.expectedStatus,
        description: test.description,
        error: result.error
      });
      
      if (success) {
        console.log(`✅ ${result.status}`);
      } else {
        console.log(`❌ ${result.status} (expected ${test.expectedStatus})`);
      }
      
    } catch (error) {
      results.push({
        name: test.name,
        success: false,
        status: 'ERROR',
        expected: test.expectedStatus,
        description: test.description,
        error: error.message
      });
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status} (${result.description})`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('\n🎯 Service Status:');
  console.log('==================');
  
  const serviceStatus = {
    'Application': results.find(r => r.name === 'Basic Health Check')?.success ? '✅ Working' : '❌ Issues',
    'Database': results.find(r => r.name === 'Database Connection')?.success ? '✅ Connected' : '❌ Issues',
    'Authentication': results.find(r => r.name === 'Authentication Endpoint')?.success ? '✅ Configured' : '❌ Issues',
    'Google OAuth': results.find(r => r.name === 'Google OAuth')?.success ? '✅ Working' : '❌ Issues',
    'Stripe': results.find(r => r.name === 'Payment Intent')?.success ? '✅ Configured' : '❌ Issues',
    'Search': results.find(r => r.name === 'Search Functionality')?.success ? '✅ Working' : '❌ Issues',
    'Notifications': results.find(r => r.name === 'Notifications')?.success ? '✅ Working' : '❌ Issues',
    'Messaging': results.find(r => r.name === 'Messages')?.success ? '✅ Working' : '❌ Issues'
  };
  
  Object.entries(serviceStatus).forEach(([service, status]) => {
    console.log(`${status} ${service}`);
  });
  
  console.log('\n🚀 Next Steps:');
  if (successful === total) {
    console.log('🎉 All services are working correctly!');
    console.log('1. ✅ Run content population script');
    console.log('2. ✅ Test user registration flow');
    console.log('3. ✅ Test vendor registration');
    console.log('4. ✅ Test booking and payment flow');
    console.log('5. ✅ Launch your platform!');
  } else {
    console.log('⚠️  Some services need attention:');
    console.log('1. 🔧 Check environment variables in Vercel');
    console.log('2. 🔧 Verify service configurations');
    console.log('3. 🔧 Check Vercel deployment logs');
    console.log('4. 🔧 Test individual services');
    console.log('5. 🔧 Redeploy if needed');
  }
  
  console.log('\n🔗 Useful Links:');
  console.log(`📱 Production URL: ${PRODUCTION_URL}`);
  console.log('⚙️  Vercel Dashboard: https://vercel.com/asithalkonaras-projects/wedding-lk');
  console.log('📊 Vercel Logs: https://vercel.com/asithalkonaras-projects/wedding-lk/functions');
}

function makeRequest(path, method = 'GET') {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}${path}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 500,
          status: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        status: 'ERROR',
        error: err.message
      });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

testProductionServices().catch(console.error);
