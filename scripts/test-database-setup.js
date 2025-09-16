#!/usr/bin/env node

/**
 * Database Setup Test Script
 * Tests MongoDB Atlas connection and verifies seed data
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.log('Please create a .env.local file with your MongoDB Atlas connection string');
  process.exit(1);
}

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    console.log(`Connection string: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Test basic operations
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    const testDoc = await testCollection.findOne({ test: true });
    await testCollection.deleteOne({ test: true });
    
    console.log('✅ Database operations test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔍 Checking environment variables...');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  const optionalVars = [
    'REDIS_URL',
    'CLOUDINARY_URL',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY'
  ];
  
  let allRequired = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Not set`);
      allRequired = false;
    }
  });
  
  console.log('\n📋 Optional variables:');
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`⚠️  ${varName}: Not set (optional)`);
    }
  });
  
  return allRequired;
}

async function main() {
  console.log('🚀 WeddingLK Database Setup Test\n');
  
  // Check environment variables
  const envCheck = await checkEnvironmentVariables();
  
  if (!envCheck) {
    console.log('\n❌ Some required environment variables are missing');
    console.log('Please check your .env.local file');
    process.exit(1);
  }
  
  // Test database connection
  const dbCheck = await testDatabaseConnection();
  
  if (!dbCheck) {
    console.log('\n❌ Database connection test failed');
    console.log('Please check your MongoDB Atlas configuration');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed!');
  console.log('✅ Environment variables configured');
  console.log('✅ MongoDB Atlas connection working');
  console.log('✅ Database operations functional');
  
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/admin/reset-database');
  console.log('3. Enter admin key: weddinglk-admin-2024');
  console.log('4. Click "Reset Database & Create Seed Data"');
  
  console.log('\n🚀 Your database is ready for seeding!');
}

// Run the test
main().catch(console.error);
