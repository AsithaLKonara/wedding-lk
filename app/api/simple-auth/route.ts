import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LocalAuth } from '@/lib/local-auth';

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

    // Use local database authentication
    const result = await LocalAuth.login(email, password);

    if (!result.success) {
      console.log('❌ Simple Auth - Login failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error || 'Invalid credentials'
      }, { status: 401 });
    }

    if (!result.user || !result.token) {
      console.log('❌ Simple Auth - Missing user or token');
      return NextResponse.json({
        success: false,
        error: 'Authentication failed'
      }, { status: 500 });
    }

    console.log('✅ Simple Auth - User found:', result.user.email, 'Role:', result.user.role);

    // Create session data
    const sessionData = {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
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
