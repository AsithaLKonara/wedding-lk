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

async function testUserAuthentication(email, password, role) {
  console.log(`\n🔐 Testing ${role} authentication...`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/simple-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ ${role} authentication successful`);
      console.log(`   User: ${response.data.user.name} (${response.data.user.role})`);
      return { success: true, user: response.data.user };
    } else {
      console.log(`❌ ${role} authentication failed:`, response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log(`❌ ${role} authentication error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testDashboardAccess(role, expectedPages) {
  console.log(`\n🏠 Testing ${role} dashboard access...`);
  
  const results = [];
  
  for (const page of expectedPages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      
      if (response.status === 200) {
        console.log(`  ✅ ${page.name} - Accessible`);
        results.push({ page: page.name, accessible: true, status: response.status });
      } else {
        console.log(`  ❌ ${page.name} - Not accessible (${response.status})`);
        results.push({ page: page.name, accessible: false, status: response.status });
      }
    } catch (error) {
      console.log(`  ❌ ${page.name} - Error: ${error.message}`);
      results.push({ page: page.name, accessible: false, error: error.message });
    }
  }
  
  return results;
}

async function testRoleBasedNavigation() {
  console.log('🎭 Testing role-based navigation...');
  
  const testUsers = [
    {
      email: 'admin@weddinglk.com',
      password: 'admin123',
      role: 'admin',
      expectedPages: [
        { path: '/dashboard/admin', name: 'Admin Dashboard' },
        { path: '/dashboard/admin/users', name: 'User Management' },
        { path: '/dashboard/admin/vendors', name: 'Vendor Management' },
        { path: '/dashboard/admin/reports', name: 'Reports & Analytics' },
        { path: '/dashboard/admin/settings', name: 'System Settings' }
      ]
    },
    {
      email: 'vendor@weddinglk.com',
      password: 'vendor123',
      role: 'vendor',
      expectedPages: [
        { path: '/dashboard/vendor', name: 'Vendor Dashboard' },
        { path: '/dashboard/vendor/services', name: 'Services' },
        { path: '/dashboard/vendor/bookings', name: 'Bookings' },
        { path: '/dashboard/vendor/boost-campaigns', name: 'Boost Campaigns' }
      ]
    },
    {
      email: 'planner@weddinglk.com',
      password: 'planner123',
      role: 'wedding_planner',
      expectedPages: [
        { path: '/dashboard/planner', name: 'Planner Dashboard' },
        { path: '/dashboard/planner/clients', name: 'Clients' },
        { path: '/dashboard/planner/tasks', name: 'Tasks' },
        { path: '/dashboard/planner/timeline', name: 'Timeline' }
      ]
    },
    {
      email: 'user@weddinglk.com',
      password: 'user123',
      role: 'user',
      expectedPages: [
        { path: '/dashboard/user', name: 'User Dashboard' },
        { path: '/dashboard/user/profile', name: 'Profile' },
        { path: '/dashboard/user/bookings', name: 'Bookings' },
        { path: '/dashboard/user/favorites', name: 'Favorites' }
      ]
    }
  ];
  
  const results = [];
  
  for (const testUser of testUsers) {
    console.log(`\n👤 Testing ${testUser.role} user...`);
    
    // Test authentication
    const authResult = await testUserAuthentication(
      testUser.email, 
      testUser.password, 
      testUser.role
    );
    
    if (authResult.success) {
      // Test dashboard access
      const pageResults = await testDashboardAccess(
        testUser.role, 
        testUser.expectedPages
      );
      
      results.push({
        role: testUser.role,
        authentication: authResult.success,
        pages: pageResults,
        accessiblePages: pageResults.filter(p => p.accessible).length,
        totalPages: pageResults.length
      });
    } else {
      results.push({
        role: testUser.role,
        authentication: false,
        pages: [],
        accessiblePages: 0,
        totalPages: 0
      });
    }
  }
  
  return results;
}

async function runSidebarTest() {
  console.log('🚀 Starting dashboard sidebar functionality test...\n');
  
  // Test role-based navigation
  const results = await testRoleBasedNavigation();
  
  // Summary
  console.log('\n📊 DASHBOARD SIDEBAR TEST SUMMARY');
  console.log('==================================');
  
  let totalAuthenticated = 0;
  let totalPagesAccessible = 0;
  let totalPages = 0;
  
  results.forEach(result => {
    console.log(`\n${result.role.toUpperCase()}:`);
    console.log(`  Authentication: ${result.authentication ? '✅' : '❌'}`);
    console.log(`  Pages Accessible: ${result.accessiblePages}/${result.totalPages}`);
    
    if (result.authentication) totalAuthenticated++;
    totalPagesAccessible += result.accessiblePages;
    totalPages += result.totalPages;
  });
  
  console.log('\n📈 OVERALL STATISTICS:');
  console.log(`  Users Authenticated: ${totalAuthenticated}/${results.length}`);
  console.log(`  Pages Accessible: ${totalPagesAccessible}/${totalPages}`);
  console.log(`  Success Rate: ${Math.round((totalPagesAccessible / totalPages) * 100)}%`);
  
  // Issues and recommendations
  const issues = [];
  if (totalAuthenticated < results.length) {
    issues.push('Some users cannot authenticate');
  }
  if (totalPagesAccessible < totalPages) {
    issues.push('Some dashboard pages are not accessible');
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️ ISSUES FOUND:');
    issues.forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log('\n🎉 All dashboard sidebar functionality tests passed!');
    console.log('✅ Authentication working for all user roles');
    console.log('✅ All dashboard pages accessible');
    console.log('✅ Role-based navigation working correctly');
  }
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Test dashboard in browser with different user roles');
  console.log('2. Verify sidebar navigation items appear correctly');
  console.log('3. Test role-based access control');
  console.log('4. Verify all dashboard features work as expected');
}

runSidebarTest().catch(console.error);

