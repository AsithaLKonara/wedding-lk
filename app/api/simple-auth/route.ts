import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Simple Auth - Starting...');
    
    const { email, password } = await request.json();
    console.log('🔐 Simple Auth - Email:', email, 'Has Password:', !!password);
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    console.log('🔐 Simple Auth - Connecting to database...');
    await connectDB();
    console.log('✅ Simple Auth - Database connected');

    console.log('🔐 Simple Auth - Finding user...');
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔐 Simple Auth - User found:', !!user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    console.log('🔐 Simple Auth - User details:', {
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      status: user.status,
      hasPassword: !!user.password
    });

    if (!user.isActive || user.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: 'Account is inactive'
      }, { status: 401 });
    }

    console.log('🔐 Simple Auth - Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Simple Auth - Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    console.log('✅ Simple Auth - Authentication successful');

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatar || null,
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('❌ Simple Auth Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'GET method not supported. Use POST for login.'
  }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({
    success: true,
    message: 'Logout successful'
  });
}
