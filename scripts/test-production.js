#!/usr/bin/env node

const https = require('https');
const http = require('http');

const PRODUCTION_URL = 'https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app';

// Test endpoints
const endpoints = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/vendors',
  '/venues',
  '/packages',
  '/api/health',
  '/api/simple-health'
];

async function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}${path}`;
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          size: data.length
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        path,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        path,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Production Deployment...\n');
  console.log(`📍 Testing: ${PRODUCTION_URL}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} (${result.size} bytes)`);
    } else {
      console.log(`❌ ${result.status} - ${result.error || 'Failed'}`);
    }
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All tests passed! Production deployment is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the issues above.');
  }
  
  console.log('\n🔗 Production URL:', PRODUCTION_URL);
  console.log('📋 Next steps:');
  console.log('1. Set up environment variables in Vercel dashboard');
  console.log('2. Configure MongoDB Atlas production cluster');
  console.log('3. Set up Stripe production keys');
  console.log('4. Configure email service');
  console.log('5. Run content population script');
}

runTests().catch(console.error);
