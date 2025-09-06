import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user (you might want to add these fields to your User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'WeddingLK <noreply@weddinglk.com>',
        to: email,
        subject: 'Password Reset Request - Wedding.lk',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f43f5e, #8b5cf6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Wedding.lk</h1>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #374151; margin-bottom: 20px;">Password Reset Request</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Hello ${user.name},
              </p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password for your Wedding.lk account. 
                Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #f43f5e, #8b5cf6); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: 600;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="color: #6b7280; word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-top: 20px;">
                This link will expire in 1 hour for security reasons.
              </p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-top: 20px;">
                If you didn't request this password reset, please ignore this email. 
                Your password will remain unchanged.
              </p>
            </div>
            
            <div style="background: #374151; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 Wedding.lk. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
