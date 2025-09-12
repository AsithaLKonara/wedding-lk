const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserCredentials() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔍 Checking user credentials...');
    
    // Find admin user
    const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Password hash:', adminUser.password);
      console.log('Is Active:', adminUser.isActive);
      console.log('Is Verified:', adminUser.isVerified);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match for "password123":', isMatch);
      
      // Test with different passwords
      const testPasswords = ['password', 'admin123', '123456', 'admin', 'password123'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, adminUser.password);
        console.log(`Password "${pwd}" match:`, match);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // List first 5 users
    console.log('\n📋 First 5 users:');
    const allUsers = await users.find({}).limit(5).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUserCredentials();


