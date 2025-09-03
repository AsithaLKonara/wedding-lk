import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 TEST AUTH API CALLED');
    console.log('🔌 Attempting database connection...');
    
    const dbConnection = await connectDB();
    if (!dbConnection) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed - unable to connect to MongoDB',
      }, { status: 500 });
    }
    
    console.log('✅ Database connected successfully');

    // Test finding a user with timeout
    console.log('🔍 Looking for test user: admin1@wedding.lk');
    const testUser = await User.findOne({ email: 'admin1@wedding.lk' }).maxTimeMS(5000);
    console.log('Test user found:', testUser ? 'Yes' : 'No');
    
    if (testUser) {
      console.log('User details:', {
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        hasPassword: !!testUser.password
      });

      // Test password verification
      const testPassword = 'password123';
      const isValidPassword = await bcrypt.compare(testPassword, testUser.password);
      console.log('Password verification:', isValidPassword ? 'Valid' : 'Invalid');

      return NextResponse.json({
        success: true,
        message: 'Database connection and authentication test successful',
        user: {
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          passwordValid: isValidPassword
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Test user not found'
      });
    }
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
