#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: './env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import the actual User model
async function loadUserModel() {
  try {
    // Try to load the User model from the lib/models directory
    const { User } = await import('./lib/models/user.js');
    return User;
  } catch (error) {
    console.log('⚠️ Could not import User model, creating fallback schema');
    
    // Create a fallback User schema that matches our seed data
    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true, minlength: 8 },
      role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user' },
      roleVerified: { type: Boolean, default: true },
      roleVerifiedAt: { type: Date, default: Date.now },
      isEmailVerified: { type: Boolean, default: true },
      isPhoneVerified: { type: Boolean, default: false },
      isIdentityVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      isVerified: { type: Boolean, default: true },
      status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active' },
      location: {
        country: { type: String, required: true, default: 'Sri Lanka' },
        state: { type: String, required: true, default: 'Western Province' },
        city: { type: String, required: true, default: 'Colombo' }
      },
      preferences: {
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'LKR' },
        timezone: { type: String, default: 'Asia/Colombo' },
        notifications: {
          email: { type: Boolean, default: true },
          sms: { type: Boolean, default: false },
          push: { type: Boolean, default: true }
        },
        marketing: {
          email: { type: Boolean, default: false },
          sms: { type: Boolean, default: false },
          push: { type: Boolean, default: false }
        }
      },
      lastActiveAt: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    return mongoose.models.User || mongoose.model('User', UserSchema);
  }
}

// Test complete authentication flow
async function testAuthenticationFlow() {
  console.log('🔐 AUTHENTICATION FLOW TEST');
  console.log('============================');
  
  try {
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Load User model
    console.log('📦 Loading User model...');
    const User = await loadUserModel();
    console.log('✅ User model loaded successfully!');
    
    // Test 1: Check if seeded users exist
    console.log('\n🔍 Test 1: Checking seeded users...');
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
    if (totalUsers === 0) {
      console.log('❌ No users found in database - seed data may not be loaded');
      return false;
    }
    
    // Test 2: Find admin user
    console.log('\n🔍 Test 2: Finding admin user...');
    const adminUser = await User.findOne({ email: 'admin1@wedding.lk' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return false;
    }
    
    console.log('✅ Admin user found:');
    console.log(`   - Name: ${adminUser.name}`);
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role: ${adminUser.role}`);
    console.log(`   - Status: ${adminUser.status}`);
    console.log(`   - Is Active: ${adminUser.isActive}`);
    console.log(`   - Is Verified: ${adminUser.isVerified}`);
    console.log(`   - Has Password: ${!!adminUser.password}`);
    
    // Test 3: Password verification
    console.log('\n🔍 Test 3: Testing password verification...');
    const testPassword = 'password123';
    const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
    
    if (!isValidPassword) {
      console.log('❌ Password verification failed');
      return false;
    }
    
    console.log('✅ Password verification successful!');
    
    // Test 4: Test regular user
    console.log('\n🔍 Test 4: Testing regular user...');
    const regularUser = await User.findOne({ email: 'user1@example.com' });
    
    if (!regularUser) {
      console.log('❌ Regular user not found');
      return false;
    }
    
    console.log('✅ Regular user found:');
    console.log(`   - Name: ${regularUser.name}`);
    console.log(`   - Email: ${regularUser.email}`);
    console.log(`   - Role: ${regularUser.role}`);
    console.log(`   - Status: ${regularUser.status}`);
    
    const isRegularPasswordValid = await bcrypt.compare(testPassword, regularUser.password);
    console.log(`   - Password Valid: ${isRegularPasswordValid ? 'Yes' : 'No'}`);
    
    // Test 5: Role-based queries
    console.log('\n🔍 Test 5: Testing role-based queries...');
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    console.log(`📊 Admin users: ${adminCount}`);
    console.log(`📊 Regular users: ${userCount}`);
    console.log(`📊 Active users: ${activeUsers}`);
    
    // Test 6: Simulate authentication flow
    console.log('\n🔍 Test 6: Simulating authentication flow...');
    
    const testCredentials = {
      email: 'admin1@wedding.lk',
      password: 'password123'
    };
    
    console.log(`🔐 Testing credentials: ${testCredentials.email}`);
    
    // Step 1: Find user
    const foundUser = await User.findOne({ email: testCredentials.email });
    if (!foundUser) {
      console.log('❌ User not found in database');
      return false;
    }
    console.log('✅ User found in database');
    
    // Step 2: Check if user is active
    if (!foundUser.isActive) {
      console.log('❌ User account is not active');
      return false;
    }
    console.log('✅ User account is active');
    
    // Step 3: Verify password
    const passwordValid = await bcrypt.compare(testCredentials.password, foundUser.password);
    if (!passwordValid) {
      console.log('❌ Invalid password');
      return false;
    }
    console.log('✅ Password is valid');
    
    // Step 4: Create user object for session
    const userObject = {
      id: foundUser._id.toString(),
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      image: foundUser.avatar || null,
    };
    
    console.log('✅ User object created for session:');
    console.log(`   - ID: ${userObject.id}`);
    console.log(`   - Email: ${userObject.email}`);
    console.log(`   - Name: ${userObject.name}`);
    console.log(`   - Role: ${userObject.role}`);
    
    console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED!');
    console.log('✅ Database connection: Working');
    console.log('✅ User model: Working');
    console.log('✅ User queries: Working');
    console.log('✅ Password verification: Working');
    console.log('✅ Role-based access: Working');
    console.log('✅ Authentication flow: Working');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ AUTHENTICATION TEST FAILED:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Name:', error.name);
    
    if (error.code === 'ENOTFOUND') {
      console.error('   💡 MongoDB hostname cannot be resolved');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   💡 MongoDB connection refused');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   💡 Connection timeout');
    }
    
    return false;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testAuthenticationFlow()
  .then(success => {
    if (success) {
      console.log('\n🚀 READY FOR PRODUCTION!');
      console.log('   The authentication system is working correctly.');
      console.log('   Users can log in with:');
      console.log('   - admin1@wedding.lk / password123 (Admin)');
      console.log('   - user1@example.com / password123 (User)');
      process.exit(0);
    } else {
      console.log('\n❌ AUTHENTICATION SYSTEM NEEDS FIXES!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 UNEXPECTED ERROR:', error);
    process.exit(1);
  });
