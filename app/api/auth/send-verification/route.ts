import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import crypto from 'crypto';
import { emailService } from '@/lib/services/email-service';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    console.log('📧 Email verification request:', { email });

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours from now

    // Save verification token to user
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationTokenExpiry;
    await user.save();

    console.log(`✅ Email verification token generated for: ${email}`);

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      emailSent,
      // In development, you might want to return the token for testing
      ...(process.env.NODE_ENV === 'development' && {
        verificationToken: verificationToken,
        verificationLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`
      })
    });

  } catch (error: unknown) {
    console.error('❌ Send verification error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
