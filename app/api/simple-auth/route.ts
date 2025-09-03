import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hardcoded credentials for testing
const hardcodedUsers = [
  // Admins
  { email: 'admin1@wedding.lk', password: 'admin123', name: 'Admin 1', role: 'admin' },
  { email: 'admin2@wedding.lk', password: 'admin123', name: 'Admin 2', role: 'admin' },
  { email: 'admin3@wedding.lk', password: 'admin123', name: 'Admin 3', role: 'admin' },
  
  // Users (Wedding Couples)
  { email: 'user1@example.com', password: 'user123', name: 'User 1', role: 'user' },
  { email: 'user2@example.com', password: 'user123', name: 'User 2', role: 'user' },
  { email: 'user3@example.com', password: 'user123', name: 'User 3', role: 'user' },
  
  // Vendors
  { email: 'vendor1@example.com', password: 'vendor123', name: 'Vendor 1', role: 'vendor' },
  { email: 'vendor2@example.com', password: 'vendor123', name: 'Vendor 2', role: 'vendor' },
  { email: 'vendor3@example.com', password: 'vendor123', name: 'Vendor 3', role: 'vendor' },
  
  // Wedding Planners
  { email: 'planner1@example.com', password: 'planner123', name: 'Planner 1', role: 'wedding_planner' },
  { email: 'planner2@example.com', password: 'planner123', name: 'Planner 2', role: 'wedding_planner' },
  { email: 'planner3@example.com', password: 'planner123', name: 'Planner 3', role: 'wedding_planner' },
];

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

    // Check hardcoded credentials
    const user = hardcodedUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      console.log('❌ Simple Auth - User not found:', email);
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    console.log('✅ Simple Auth - User found:', user.email, 'Role:', user.role);

    // Create session data
    const sessionData = {
      user: {
        id: user.email,
        email: user.email,
        name: user.name,
        role: user.role,
        image: null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('simple-auth-session', JSON.stringify(sessionData), {
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
    const sessionCookie = cookieStore.get('simple-auth-session');
    
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
      cookieStore.delete('simple-auth-session');
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
    cookieStore.delete('simple-auth-session');
    
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
