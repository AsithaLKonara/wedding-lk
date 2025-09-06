#!/usr/bin/env node

/**
 * Quick Test Script for WeddingLK
 * Tests basic functionality after fixes
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: jsonData,
            raw: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: null,
            raw: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runQuickTest() {
  console.log('🚀 Running Quick Test Suite...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/api/health',
      expectedStatus: 200
    },
    {
      name: 'Vendors API',
      method: 'GET',
      path: '/api/vendors',
      expectedStatus: 200
    },
    {
      name: 'Venues API',
      method: 'GET',
      path: '/api/venues',
      expectedStatus: 200
    },
    {
      name: 'Gallery API',
      method: 'GET',
      path: '/api/gallery',
      expectedStatus: 200
    },
    {
      name: 'Admin Route Protection',
      method: 'GET',
      path: '/api/dashboard/admin/stats',
      expectedStatus: 401
    },
    {
      name: 'Vendor Route Protection',
      method: 'GET',
      path: '/api/dashboard/vendor/stats',
      expectedStatus: 401
    },
    {
      name: 'User Route Protection',
      method: 'GET',
      path: '/api/dashboard/user/stats',
      expectedStatus: 401
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await makeRequest(test.method, test.path);
      const success = response.status === test.expectedStatus;
      
      if (success) {
        console.log(`✅ ${test.name} - ${response.status}`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - Expected ${test.expectedStatus}, got ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Quick Test Results:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

  if (failed === 0) {
    console.log('\n✅ All quick tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check the issues above.');
    process.exit(1);
  }
}

runQuickTest().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
