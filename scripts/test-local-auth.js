const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database directory
const DB_DIR = path.join(process.cwd(), 'database');
const USERS_FILE = path.join(DB_DIR, 'users.json');

async function testLocalAuth() {
  try {
    console.log('🧪 Testing Local Authentication System');
    console.log('=====================================\n');

    // Check if database files exist
    if (!fs.existsSync(USERS_FILE)) {
      console.log('❌ Users database file not found. Initializing...');
      // Initialize the database
      const initScript = require('./init-local-database.js');
      return;
    }

    // Read users from local database
    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    console.log(`📊 Found ${usersData.length} users in local database\n`);

    // Test credentials
    const testCredentials = [
      { email: 'admin1@wedding.lk', password: 'admin123', expectedRole: 'admin' },
      { email: 'user1@example.com', password: 'admin123', expectedRole: 'user' },
      { email: 'vendor1@example.com', password: 'admin123', expectedRole: 'vendor' },
      { email: 'planner1@example.com', password: 'admin123', expectedRole: 'wedding_planner' },
    ];

    console.log('🔐 Testing Authentication:');
    console.log('-------------------------');

    for (const test of testCredentials) {
      const user = usersData.find(u => u.email === test.email);
      
      if (!user) {
        console.log(`❌ ${test.email} - User not found`);
        continue;
      }

      // Test password verification
      const isPasswordValid = await bcrypt.compare(test.password, user.password);
      
      if (isPasswordValid && user.role === test.expectedRole) {
        console.log(`✅ ${test.email} - Authentication successful (${user.role})`);
      } else if (!isPasswordValid) {
        console.log(`❌ ${test.email} - Invalid password`);
      } else if (user.role !== test.expectedRole) {
        console.log(`⚠️ ${test.email} - Role mismatch (expected: ${test.expectedRole}, got: ${user.role})`);
      }
    }

    console.log('\n📋 Available Test Accounts:');
    console.log('----------------------------');
    usersData.forEach(user => {
      console.log(`👤 ${user.name} (${user.role})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('🔑 Login Credentials:');
    console.log('--------------------');
    console.log('All accounts use password: admin123');
    console.log('');
    console.log('Admin Accounts:');
    usersData.filter(u => u.role === 'admin').forEach(user => {
      console.log(`   ${user.email} / admin123`);
    });
    console.log('');
    console.log('User Accounts:');
    usersData.filter(u => u.role === 'user').forEach(user => {
      console.log(`   ${user.email} / admin123`);
    });
    console.log('');
    console.log('Vendor Accounts:');
    usersData.filter(u => u.role === 'vendor').forEach(user => {
      console.log(`   ${user.email} / admin123`);
    });
    console.log('');
    console.log('Planner Accounts:');
    usersData.filter(u => u.role === 'wedding_planner').forEach(user => {
      console.log(`   ${user.email} / admin123`);
    });

    console.log('\n🎯 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Go to http://localhost:3000/login');
    console.log('3. Test login with any of the credentials above');
    console.log('4. Test registration at http://localhost:3000/register');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLocalAuth();
