import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, phone, address } = await request.json();
    
    console.log('📝 Registration attempt:', { email, role, hasPassword: !!password });
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Validate role
    const validRoles = ['user', 'vendor', 'wedding_planner'];
    const userRole = role || 'user';
    if (!validRoles.includes(userRole)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid role. Must be one of: user, vendor, wedding_planner'
      }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone,
      address,
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo',
        zipCode: '00100'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: false,
          sms: false,
          push: false
        }
      },
      isActive: true,
      isVerified: false,
      status: 'active'
    });

    await newUser.save();

    console.log('✅ Registration successful:', newUser.email, 'Role:', newUser.role);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        isActive: newUser.isActive,
      },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
