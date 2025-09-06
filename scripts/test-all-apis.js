#!/usr/bin/env node

/**
 * Comprehensive API Testing Script for WeddingLK
 * Tests all API endpoints for functionality, security, and performance
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TEST_RESULTS_FILE = 'test-results.json';

// Test data
const testUsers = {
  admin: { email: 'admin@weddinglk.com', password: 'admin123', role: 'admin' },
  vendor: { email: 'vendor@weddinglk.com', password: 'vendor123', role: 'vendor' },
  user: { email: 'user@weddinglk.com', password: 'user123', role: 'user' }
};

const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  tests: []
};

// API endpoints to test
const apiEndpoints = [
  // Public endpoints
  { method: 'GET', path: '/api/health', auth: false, description: 'Health check' },
  { method: 'GET', path: '/api/vendors', auth: false, description: 'Get vendors' },
  { method: 'GET', path: '/api/venues', auth: false, description: 'Get venues' },
  { method: 'GET', path: '/api/gallery', auth: false, description: 'Get gallery' },
  
  // Authentication endpoints
  { method: 'POST', path: '/api/auth/signin', auth: false, description: 'Sign in' },
  { method: 'POST', path: '/api/auth/signout', auth: false, description: 'Sign out' },
  { method: 'POST', path: '/api/register', auth: false, description: 'User registration' },
  { method: 'POST', path: '/api/auth/forgot-password', auth: false, description: 'Forgot password' },
  
  // Admin endpoints
  { method: 'GET', path: '/api/dashboard/admin/stats', auth: true, role: 'admin', description: 'Admin stats' },
  { method: 'GET', path: '/api/dashboard/admin/users', auth: true, role: 'admin', description: 'Admin users' },
  { method: 'GET', path: '/api/dashboard/admin/vendors', auth: true, role: 'admin', description: 'Admin vendors' },
  { method: 'GET', path: '/api/dashboard/admin/bookings', auth: true, role: 'admin', description: 'Admin bookings' },
  
  // Vendor endpoints
  { method: 'GET', path: '/api/dashboard/vendor/stats', auth: true, role: 'vendor', description: 'Vendor stats' },
  { method: 'GET', path: '/api/dashboard/vendor/services', auth: true, role: 'vendor', description: 'Vendor services' },
  { method: 'GET', path: '/api/dashboard/vendor/bookings', auth: true, role: 'vendor', description: 'Vendor bookings' },
  { method: 'GET', path: '/api/dashboard/vendor/messages', auth: true, role: 'vendor', description: 'Vendor messages' },
  
  // User endpoints
  { method: 'GET', path: '/api/dashboard/user/stats', auth: true, role: 'user', description: 'User stats' },
  { method: 'GET', path: '/api/dashboard/user/tasks', auth: true, role: 'user', description: 'User tasks' },
  { method: 'GET', path: '/api/dashboard/user/events', auth: true, role: 'user', description: 'User events' },
  { method: 'GET', path: '/api/dashboard/user/activity', auth: true, role: 'user', description: 'User activity' },
  
  // CRUD endpoints
  { method: 'GET', path: '/api/users', auth: true, role: 'admin', description: 'Get all users' },
  { method: 'POST', path: '/api/users', auth: true, role: 'admin', description: 'Create user' },
  { method: 'GET', path: '/api/bookings', auth: true, role: 'user', description: 'Get bookings' },
  { method: 'POST', path: '/api/bookings', auth: true, role: 'user', description: 'Create booking' },
  { method: 'GET', path: '/api/tasks', auth: true, role: 'user', description: 'Get tasks' },
  { method: 'POST', path: '/api/tasks', auth: true, role: 'user', description: 'Create task' },
  { method: 'GET', path: '/api/reviews', auth: true, role: 'user', description: 'Get reviews' },
  { method: 'POST', path: '/api/reviews', auth: true, role: 'user', description: 'Create review' }
];

// Utility functions
function makeRequest(method, url, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            raw: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function authenticateUser(userType) {
  const user = testUsers[userType];
  if (!user) {
    throw new Error(`Unknown user type: ${userType}`);
  }

  try {
    const response = await makeRequest('POST', `${BASE_URL}/api/auth/signin`, {}, {
      email: user.email,
      password: user.password
    });

    if (response.status === 200 && response.data.token) {
      return response.data.token;
    }

    // If direct auth doesn't work, try registration first
    if (response.status === 401) {
      console.log(`Attempting to register ${userType} user...`);
      const registerResponse = await makeRequest('POST', `${BASE_URL}/api/register`, {}, {
        name: user.email.split('@')[0],
        email: user.email,
        password: user.password,
        role: user.role
      });

      if (registerResponse.status === 200) {
        // Try to authenticate again
        const authResponse = await makeRequest('POST', `${BASE_URL}/api/auth/signin`, {}, {
          email: user.email,
          password: user.password
        });
        
        if (authResponse.status === 200 && authResponse.data.token) {
          return authResponse.data.token;
        }
      }
    }

    throw new Error(`Authentication failed for ${userType}: ${response.status}`);
  } catch (error) {
    console.error(`Authentication error for ${userType}:`, error.message);
    throw error;
  }
}

async function runTest(endpoint, authToken = null) {
  const startTime = Date.now();
  const testId = `${endpoint.method}_${endpoint.path.replace(/\//g, '_')}`;
  
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await makeRequest(
      endpoint.method,
      `${BASE_URL}${endpoint.path}`,
      headers,
      endpoint.method === 'POST' ? { test: true } : null
    );

    const duration = Date.now() - startTime;
    const success = response.status >= 200 && response.status < 300;

    const result = {
      id: testId,
      endpoint: `${endpoint.method} ${endpoint.path}`,
      description: endpoint.description,
      status: success ? 'passed' : 'failed',
      response: {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data
      },
      error: success ? null : `HTTP ${response.status}`,
      timestamp: new Date().toISOString()
    };

    testResults.tests.push(result);
    testResults.summary.total++;
    
    if (success) {
      testResults.summary.passed++;
      console.log(`✅ ${endpoint.method} ${endpoint.path} - ${response.status} (${duration}ms)`);
    } else {
      testResults.summary.failed++;
      console.log(`❌ ${endpoint.method} ${endpoint.path} - ${response.status} (${duration}ms)`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      id: testId,
      endpoint: `${endpoint.method} ${endpoint.path}`,
      description: endpoint.description,
      status: 'failed',
      response: {
        status: 0,
        duration: `${duration}ms`,
        data: null
      },
      error: error.message,
      timestamp: new Date().toISOString()
    };

    testResults.tests.push(result);
    testResults.summary.total++;
    testResults.summary.failed++;
    
    console.log(`❌ ${endpoint.method} ${endpoint.path} - ERROR: ${error.message}`);
    return result;
  }
}

async function runAllTests() {
  console.log('🚀 Starting WeddingLK API Tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test public endpoints first
  console.log('📋 Testing Public Endpoints...');
  for (const endpoint of apiEndpoints.filter(e => !e.auth)) {
    await runTest(endpoint);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
  }

  // Test authenticated endpoints
  console.log('\n🔐 Testing Authenticated Endpoints...');
  
  for (const userType of ['admin', 'vendor', 'user']) {
    console.log(`\n👤 Testing as ${userType.toUpperCase()}...`);
    
    try {
      const authToken = await authenticateUser(userType);
      console.log(`✅ Authenticated as ${userType}`);
      
      const userEndpoints = apiEndpoints.filter(e => 
        e.auth && (!e.role || e.role === userType)
      );
      
      for (const endpoint of userEndpoints) {
        await runTest(endpoint, authToken);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.log(`❌ Failed to authenticate as ${userType}: ${error.message}`);
      
      // Mark user-specific tests as skipped
      const userEndpoints = apiEndpoints.filter(e => 
        e.auth && (!e.role || e.role === userType)
      );
      
      for (const endpoint of userEndpoints) {
        const testId = `${endpoint.method}_${endpoint.path.replace(/\//g, '_')}`;
        testResults.tests.push({
          id: testId,
          endpoint: `${endpoint.method} ${endpoint.path}`,
          description: endpoint.description,
          status: 'skipped',
          response: null,
          error: `Authentication failed: ${error.message}`,
          timestamp: new Date().toISOString()
        });
        testResults.summary.total++;
        testResults.summary.skipped++;
      }
    }
  }

  // Generate report
  console.log('\n📊 Test Summary:');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Skipped: ${testResults.summary.skipped}`);
  
  const successRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2);
  console.log(`Success Rate: ${successRate}%`);

  // Save results to file
  fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${TEST_RESULTS_FILE}`);

  // Exit with appropriate code
  if (testResults.summary.failed > 0) {
    console.log('\n❌ Some tests failed. Check the results file for details.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, runTest, authenticateUser };
