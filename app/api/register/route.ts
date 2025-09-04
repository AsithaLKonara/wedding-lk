import { NextRequest, NextResponse } from 'next/server';
import { LocalAuth } from '@/lib/local-auth';

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

    // Register user using local database
    const result = await LocalAuth.register({
      name,
      email,
      password,
      role: userRole,
      phone,
      address
    });

    if (!result.success) {
      console.log('❌ Registration failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error || 'Registration failed'
      }, { status: 400 });
    }

    console.log('✅ Registration successful:', result.user?.email, 'Role:', result.user?.role);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user?.id,
        name: result.user?.name,
        email: result.user?.email,
        role: result.user?.role,
        isVerified: result.user?.isVerified,
        isActive: result.user?.isActive,
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
