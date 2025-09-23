import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await (User as any).findOne({ email })
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token
    await (User as any).findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    })

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    
    await sendEmail({
      to: email,
      subject: "Password Reset Request - WeddingLK",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); padding: 40px 20px; text-align: center;">
            <h1 style="color: #be185d; margin: 0; font-size: 28px;">WeddingLK</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Your Ultimate Wedding Planning Platform</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #111827; margin: 0 0 20px 0;">Password Reset Request</h2>
            <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
              Hi ${user.firstName || 'there'},
            </p>
            <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your password for your WeddingLK account. Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ec4899, #be185d); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block; 
                        font-weight: 600;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #6b7280; line-height: 1.6; margin: 10px 0 0 0; font-size: 14px; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Security Note:</strong> This link will expire in 1 hour for your security. 
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              © 2024 WeddingLK. All rights reserved.
            </p>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link."
    })

  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process password reset request"
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
