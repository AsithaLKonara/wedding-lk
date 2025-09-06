const https = require('https');

const BASE_URL = 'https://wedding-cknbggzne-asithalkonaras-projects.vercel.app';

// Test users with different roles
const testUsers = [
  { email: 'admin@weddinglk.com', password: 'admin123', role: 'admin' },
  { email: 'vendor@weddinglk.com', password: 'vendor123', role: 'vendor' },
  { email: 'planner@weddinglk.com', password: 'planner123', role: 'wedding_planner' },
  { email: 'user@weddinglk.com', password: 'user123', role: 'user' }
];

// Test routes for each role
const testRoutes = {
  admin: [
    '/dashboard/admin',
    '/dashboard/admin/users',
    '/dashboard/admin/vendors',
    '/dashboard/admin/reports',
    '/dashboard/admin/settings'
  ],
  vendor: [
    '/dashboard/vendor',
    '/dashboard/vendor/services',
    '/dashboard/vendor/bookings',
    '/dashboard/vendor/boost-campaigns'
  ],
  wedding_planner: [
    '/dashboard/planner',
    '/dashboard/planner/clients',
    '/dashboard/planner/tasks',
    '/dashboard/planner/timeline'
  ],
  user: [
    '/dashboard/user',
    '/dashboard/user/profile',
    '/dashboard/user/bookings',
    '/dashboard/user/favorites'
  ]
};

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

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug-auth`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database connection successful');
      console.log(`📊 Total users: ${response.data.data.database.userCount}`);
      console.log(`🎭 Role distribution:`, response.data.data.roles);
      return true;
    } else {
      console.log('❌ Database connection failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔍 Testing authentication system...');
  
  const results = [];
  
  for (const user of testUsers) {
    console.log(`\n👤 Testing ${user.role} user: ${user.email}`);
    
    try {
      const response = await makeRequest(`${BASE_URL}/api/simple-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });
      
      if (response.status === 200 && response.data.success) {
        console.log(`✅ Login successful for ${user.role}`);
        console.log(`   User ID: ${response.data.user.id}`);
        console.log(`   Role: ${response.data.user.role}`);
        results.push({ user: user.role, success: true, data: response.data });
      } else {
        console.log(`❌ Login failed for ${user.role}:`, response.data);
        results.push({ user: user.role, success: false, error: response.data });
      }
    } catch (error) {
      console.log(`❌ Login error for ${user.role}:`, error.message);
      results.push({ user: user.role, success: false, error: error.message });
    }
  }
  
  return results;
}

async function testRoleBasedAccess() {
  console.log('\n🔍 Testing role-based access...');
  
  const results = [];
  
  for (const user of testUsers) {
    console.log(`\n🎭 Testing access for ${user.role} user`);
    
    const userRoutes = testRoutes[user.role] || [];
    
    for (const route of userRoutes) {
      try {
        const response = await makeRequest(`${BASE_URL}${route}`);
        
        if (response.status === 200) {
          console.log(`✅ ${route} - Access granted`);
          results.push({ user: user.role, route, success: true, status: response.status });
        } else if (response.status === 401 || response.status === 403) {
          console.log(`🔒 ${route} - Access denied (${response.status})`);
          results.push({ user: user.role, route, success: false, status: response.status });
        } else if (response.status === 404) {
          console.log(`❓ ${route} - Not found (${response.status})`);
          results.push({ user: user.role, route, success: false, status: response.status });
        } else {
          console.log(`⚠️ ${route} - Unexpected status (${response.status})`);
          results.push({ user: user.role, route, success: false, status: response.status });
        }
      } catch (error) {
        console.log(`❌ ${route} - Error:`, error.message);
        results.push({ user: user.role, route, success: false, error: error.message });
      }
    }
  }
  
  return results;
}

async function testAPIs() {
  console.log('\n🔍 Testing API endpoints...');
  
  const apiTests = [
    { name: 'Health Check', url: '/api/health' },
    { name: 'Debug Auth', url: '/api/debug-auth' },
    { name: 'Test Users', url: '/api/test-users' },
    { name: 'Notifications', url: '/api/notifications' },
    { name: 'Venues Search', url: '/api/venues/search' },
    { name: 'Vendors Search', url: '/api/vendors/search' },
    { name: 'Favorites', url: '/api/favorites' },
    { name: 'Packages', url: '/api/packages' }
  ];
  
  const results = [];
  
  for (const test of apiTests) {
    try {
      const response = await makeRequest(`${BASE_URL}${test.url}`);
      
      if (response.status === 200) {
        console.log(`✅ ${test.name} - Working`);
        results.push({ name: test.name, success: true, status: response.status });
      } else {
        console.log(`❌ ${test.name} - Failed (${response.status})`);
        results.push({ name: test.name, success: false, status: response.status });
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error:`, error.message);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }
  
  return results;
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive dashboard system test...\n');
  
  // Test 1: Database Connection
  const dbTest = await testDatabaseConnection();
  
  // Test 2: Authentication
  const authResults = await testAuthentication();
  
  // Test 3: Role-based Access
  const accessResults = await testRoleBasedAccess();
  
  // Test 4: API Endpoints
  const apiResults = await testAPIs();
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Database Connection: ${dbTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication: ${authResults.filter(r => r.success).length}/${authResults.length} users`);
  console.log(`Role-based Access: ${accessResults.filter(r => r.success).length}/${accessResults.length} routes`);
  console.log(`API Endpoints: ${apiResults.filter(r => r.success).length}/${apiResults.length} working`);
  
  // Issues found
  const issues = [];
  if (!dbTest) issues.push('Database connection failed');
  if (authResults.some(r => !r.success)) issues.push('Some users cannot authenticate');
  if (accessResults.some(r => !r.success)) issues.push('Role-based access not working properly');
  if (apiResults.some(r => !r.success)) issues.push('Some API endpoints are not working');
  
  if (issues.length > 0) {
    console.log('\n⚠️ ISSUES FOUND:');
    issues.forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log('\n🎉 All tests passed! Dashboard system is working correctly.');
  }
}

// Run the tests
runAllTests().catch(console.error);
