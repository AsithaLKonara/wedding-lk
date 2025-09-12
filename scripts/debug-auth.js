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

async function testUserCreation() {
  console.log('🔧 Testing user creation...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/test-users`, {
      method: 'POST'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Test users created successfully');
      console.log('   Users:', response.data.data.createdUsers.length);
      return response.data.data.createdUsers;
    } else {
      console.log('❌ Test user creation failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Test user creation error:', error.message);
    return null;
  }
}

async function testAuthentication(email, password) {
  console.log(`\n🔐 Testing authentication for ${email}...`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/simple-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Authentication successful');
      console.log('   User:', response.data.user.name, `(${response.data.user.role})`);
      return true;
    } else {
      console.log('❌ Authentication failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    return false;
  }
}

async function testDatabaseUsers() {
  console.log('\n🗄️ Testing database users...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug-auth`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database connection successful');
      console.log('   Total users:', response.data.data.database.userCount);
      console.log('   Sample users:', response.data.data.database.sampleUsers.length);
      
      // Show sample users
      response.data.data.database.sampleUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
      
      return response.data.data.database.sampleUsers;
    } else {
      console.log('❌ Database connection failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return null;
  }
}

async function runDebug() {
  console.log('🚀 Starting authentication debug...\n');
  
  // Test 1: Database users
  const dbUsers = await testDatabaseUsers();
  
  // Test 2: Create test users
  const testUsers = await testUserCreation();
  
  // Test 3: Test authentication with different users
  const testCredentials = [
    { email: 'admin@weddinglk.com', password: 'admin123' },
    { email: 'vendor@weddinglk.com', password: 'vendor123' },
    { email: 'planner@weddinglk.com', password: 'planner123' },
    { email: 'user@weddinglk.com', password: 'user123' }
  ];
  
  console.log('\n🔐 Testing authentication with all test users...');
  let successCount = 0;
  
  for (const creds of testCredentials) {
    const success = await testAuthentication(creds.email, creds.password);
    if (success) successCount++;
  }
  
  console.log(`\n📊 AUTHENTICATION SUMMARY`);
  console.log('========================');
  console.log(`Database Users: ${dbUsers ? dbUsers.length : 0}`);
  console.log(`Test Users Created: ${testUsers ? testUsers.length : 0}`);
  console.log(`Authentication Success: ${successCount}/${testCredentials.length}`);
  
  if (successCount === 0) {
    console.log('\n❌ All authentication attempts failed');
    console.log('💡 Possible issues:');
    console.log('- Password hashing mismatch');
    console.log('- User model comparePassword method issue');
    console.log('- Database connection issues');
    console.log('- User not found in database');
  } else if (successCount < testCredentials.length) {
    console.log('\n⚠️ Some authentication attempts failed');
    console.log('💡 Check individual user accounts');
  } else {
    console.log('\n✅ All authentication tests passed!');
  }
}

runDebug().catch(console.error);

