import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      location,
      status: 'active',
      isVerified: false,
      isActive: true
    });

    await newUser.save();

    console.log(`✅ New user registered: ${email} with role: ${role}`);

    // TODO: Send welcome email
    // TODO: Send verification email
    // TODO: Send admin notification for vendor/wedding_planner registrations

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status
        }
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('❌ Registration error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}