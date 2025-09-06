import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔐 Simple Auth - Login attempt:', { email, hasPassword: !!password });
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Connect to MongoDB Atlas
    await connectDB();

    // Find user in MongoDB Atlas
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ Simple Auth - User not found:', email);
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive || user.status !== 'active') {
      console.log('❌ Simple Auth - User account is inactive:', email);
      return NextResponse.json({
        success: false,
        error: 'Account is inactive'
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Simple Auth - Invalid password for:', email);
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Update last login
    await user.updateLastActive();

    console.log('✅ Simple Auth - User found:', user.email, 'Role:', user.role);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Create session data
    const sessionData = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatar || null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    // Set cookie
    const cookieStore = cookies();
    (await cookieStore).set('simple-auth-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: sessionData.user,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('❌ Simple Auth Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('simple-auth-session');
    
    if (!sessionCookie) {
      return NextResponse.json({
        success: false,
        user: null,
        message: 'No session found'
      });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      (await cookieStore).delete('simple-auth-session');
      return NextResponse.json({
        success: false,
        user: null,
        message: 'Session expired'
      });
    }

    return NextResponse.json({
      success: true,
      user: sessionData.user,
      message: 'Session valid'
    });

  } catch (error) {
    console.error('❌ Simple Auth Session Error:', error);
    return NextResponse.json({
      success: false,
      user: null,
      error: 'Session error'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete('simple-auth-session');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('❌ Simple Auth Logout Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Logout error'
    }, { status: 500 });
  }
}
