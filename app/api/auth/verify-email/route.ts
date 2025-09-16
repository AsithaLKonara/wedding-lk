import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token } = await request.json();

    console.log('📧 Email verification attempt:', { token: token ? 'provided' : 'missing' });

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Verify user email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.status = 'active';
    await user.save();

    console.log(`✅ Email verified successfully for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error: unknown) {
    console.error('❌ Email verification error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}