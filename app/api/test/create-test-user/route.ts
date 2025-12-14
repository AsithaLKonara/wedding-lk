import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role = 'user', name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'User already exists',
          user: {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role
          }
        },
        { status: 200 }
      );
    }

    // Create new test user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name || `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email,
      password: hashedPassword,
      role,
      status: 'active',
      isVerified: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test user creation endpoint',
    usage: 'POST with { email, password, role?, name? }'
  });
}
