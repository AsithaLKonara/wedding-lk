import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Test User model
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Test creating a test user (if none exists)
    let testUser = await User.findOne({ email: 'test@weddinglk.com' });
    
    if (!testUser) {
      console.log('🔧 Creating test user...');
      testUser = new User({
        name: 'Test User',
        email: 'test@weddinglk.com',
        password: 'testpassword123',
        role: 'user',
        isActive: true,
        status: 'active'
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully');
    } else {
      console.log('✅ Test user already exists');
    }
    
    // Test fetching users
    const users = await User.find({}).limit(5).lean();
    console.log(`📋 Sample users: ${users.length} found`);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      data: {
        connected: true,
        userCount,
        testUser: {
          id: testUser._id,
          name: testUser.name,
          email: testUser.email,
          role: testUser.role
        },
        sampleUsers: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

