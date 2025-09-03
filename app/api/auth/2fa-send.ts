import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { sendEmail } from "@/lib/email"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    const otp = generateOTP()
    // Store OTP and expiry (5 min)
    user.twoFactorTemp = JSON.stringify({ code: otp, expires: Date.now() + 5 * 60 * 1000 })
    await user.save()
    
    // Send email with OTP
    // TODO: Implement HTML email template when email service supports HTML

    await sendEmail(
      user.email,
      'Two-Factor Authentication Code',
      `Your 2FA code is: ${otp}. This code will expire in 10 minutes.`
    );

    return NextResponse.json({ success: true, message: "Verification code sent to your email." })
  } catch (error) {
    console.error("2FA send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
} 