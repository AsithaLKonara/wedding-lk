#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
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

async function testAuthentication() {
  console.log('🔐 Testing authentication system...');
  
  try {
    // Test simple auth
    const response = await makeRequest(`${BASE_URL}/api/simple-auth`, {
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
      console.log('✅ Simple auth working');
      console.log(`   User: ${response.data.user.name} (${response.data.user.role})`);
      return { success: true, user: response.data.user };
    } else {
      console.log('❌ Simple auth failed:', response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Simple auth error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testDashboardPages() {
  console.log('\n🏠 Testing dashboard pages...');
  
  const pages = [
    { path: '/dashboard', name: 'Main Dashboard' },
    { path: '/dashboard/admin', name: 'Admin Dashboard' },
    { path: '/dashboard/vendor', name: 'Vendor Dashboard' },
    { path: '/dashboard/planner', name: 'Planner Dashboard' },
    { path: '/dashboard/user', name: 'User Dashboard' }
  ];
  
  const results = [];
  
  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      
      if (response.status === 200) {
        console.log(`✅ ${page.name} - Accessible`);
        results.push({ page: page.name, accessible: true, status: response.status });
      } else {
        console.log(`❌ ${page.name} - Not accessible (${response.status})`);
        results.push({ page: page.name, accessible: false, status: response.status });
      }
    } catch (error) {
      console.log(`❌ ${page.name} - Error: ${error.message}`);
      results.push({ page: page.name, accessible: false, error: error.message });
    }
  }
  
  return results;
}

async function testAPIEndpoints() {
  console.log('\n🔌 Testing API endpoints...');
  
  const endpoints = [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/debug-auth', name: 'Debug Auth' },
    { path: '/api/test-dashboard-debug', name: 'Dashboard Debug' },
    { path: '/api/notifications', name: 'Notifications' },
    { path: '/api/venues/search', name: 'Venues Search' },
    { path: '/api/vendors/search', name: 'Vendors Search' },
    { path: '/api/favorites', name: 'Favorites' },
    { path: '/api/packages', name: 'Packages' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name} - Working`);
        results.push({ endpoint: endpoint.name, working: true, status: response.status });
      } else {
        console.log(`❌ ${endpoint.name} - Failed (${response.status})`);
        results.push({ endpoint: endpoint.name, working: false, status: response.status });
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} - Error: ${error.message}`);
      results.push({ endpoint: endpoint.name, working: false, error: error.message });
    }
  }
  
  return results;
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing database connection...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug-auth`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database connected');
      console.log(`   Total users: ${response.data.data.database.userCount}`);
      console.log(`   Role distribution:`, response.data.data.roles);
      return { connected: true, data: response.data.data };
    } else {
      console.log('❌ Database connection failed:', response.data);
      return { connected: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return { connected: false, error: error.message };
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting comprehensive dashboard test...\n');
  
  // Test 1: Database Connection
  const dbTest = await testDatabaseConnection();
  
  // Test 2: Authentication
  const authTest = await testAuthentication();
  
  // Test 3: Dashboard Pages
  const pageTest = await testDashboardPages();
  
  // Test 4: API Endpoints
  const apiTest = await testAPIEndpoints();
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Database Connection: ${dbTest.connected ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication: ${authTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Dashboard Pages: ${pageTest.filter(p => p.accessible).length}/${pageTest.length} accessible`);
  console.log(`API Endpoints: ${apiTest.filter(a => a.working).length}/${apiTest.length} working`);
  
  // Issues found
  const issues = [];
  if (!dbTest.connected) issues.push('Database connection failed');
  if (!authTest.success) issues.push('Authentication not working');
  if (pageTest.some(p => !p.accessible)) issues.push('Some dashboard pages not accessible');
  if (apiTest.some(a => !a.working)) issues.push('Some API endpoints not working');
  
  if (issues.length > 0) {
    console.log('\n⚠️ ISSUES FOUND:');
    issues.forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log('\n🎉 All tests passed! Dashboard system is working correctly.');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (!authTest.success) {
    console.log('- Create test users in the database');
    console.log('- Test login functionality');
  }
  if (pageTest.some(p => !p.accessible)) {
    console.log('- Check role-based access control');
    console.log('- Verify middleware configuration');
  }
  if (apiTest.some(a => !a.working)) {
    console.log('- Check API route implementations');
    console.log('- Verify database models');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Fix any identified issues');
  console.log('2. Test dashboard functionality in browser');
  console.log('3. Verify sidebar navigation works');
  console.log('4. Test role-based access');
}

runCompleteTest().catch(console.error);
