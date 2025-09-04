const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database directory
const DB_DIR = path.join(process.cwd(), 'database');
const USERS_FILE = path.join(DB_DIR, 'users.json');

async function fixPasswords() {
  try {
    console.log('🔧 Fixing passwords in local database...');
    
    // Read users from local database
    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    console.log(`📊 Found ${usersData.length} users to update\n`);

    // Hash the correct password
    const correctPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(correctPassword, 10);
    console.log(`🔐 Generated hash for password: ${correctPassword}`);
    console.log(`🔑 Hash: ${hashedPassword}\n`);

    // Update all users with the correct password hash
    const updatedUsers = usersData.map(user => ({
      ...user,
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    }));

    // Write back to file
    fs.writeFileSync(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    console.log('✅ All user passwords updated successfully!');

    // Test the updated passwords
    console.log('\n🧪 Testing updated passwords:');
    console.log('------------------------------');
    
    for (const user of updatedUsers.slice(0, 4)) { // Test first 4 users
      const isPasswordValid = await bcrypt.compare(correctPassword, user.password);
      console.log(`${isPasswordValid ? '✅' : '❌'} ${user.email} - ${isPasswordValid ? 'Valid' : 'Invalid'}`);
    }

    console.log('\n🎉 Password fix completed!');
    console.log('All accounts now use password: admin123');

  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
  }
}

// Run the fix
fixPasswords();
