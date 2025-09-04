import { NextRequest, NextResponse } from 'next/server';
import LocalAuthService from '@/lib/local-auth-service';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      location
    } = await request.json();

    console.log('🔐 Registration attempt:', { email, role, hasLocation: !!location });

    // Validate required fields
    if (!name || !email || !password || !phone || !role || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'vendor', 'wedding_planner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Create new user using local database
    const newUser = await LocalAuthService.createUser({
      name,
      email,
      password,
      phone,
      role,
      location
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    console.log(`✅ New user registered: ${email} with role: ${role}`);

    // TODO: Send welcome email
    // TODO: Send verification email
    // TODO: Send admin notification for vendor/wedding_planner registrations

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Handle specific errors
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}