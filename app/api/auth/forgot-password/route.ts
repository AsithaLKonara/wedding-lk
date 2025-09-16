import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import crypto from 'crypto';
import { emailService } from '@/lib/services/email-service';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    console.log('🔐 Password reset request:', { email });

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
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    console.log(`✅ Password reset token generated for: ${email}`);

    // Send email with reset link
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      emailSent,
      // In development, you might want to return the token for testing
      ...(process.env.NODE_ENV === 'development' && {
        resetToken: resetToken,
        resetLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
      })
    });

  } catch (error: unknown) {
    console.error('❌ Forgot password error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}