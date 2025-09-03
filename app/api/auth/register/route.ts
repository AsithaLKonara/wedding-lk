import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

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

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      location: {
        country: location.country || 'Sri Lanka',
        state: location.state,
        city: location.city,
        zipCode: location.zipCode || '',
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        marketing: {
          email: false,
          sms: false,
          push: false,
        },
      },
      isEmailVerified: false,
      isPhoneVerified: false,
      isIdentityVerified: false,
      status: role === 'user' ? 'active' : 'pending_verification',
      isVerified: role === 'user',
      isActive: true,
      loginCount: 0,
      loginAttempts: 0,
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

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}