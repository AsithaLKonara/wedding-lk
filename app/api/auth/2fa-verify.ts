import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }
    const user = await (User as any).findOne({ email })
    if (!user || !user.twoFactorTemp) {
      return NextResponse.json({ success: false, error: "No verification code found" }, { status: 400 })
    }
    const { code: storedCode, expires } = JSON.parse(user.twoFactorTemp)
    if (Date.now() > expires) {
      user.twoFactorTemp = undefined
      await user.save()
      return NextResponse.json({ success: false, error: "Code expired" }, { status: 400 })
    }
    if (code !== storedCode) {
      return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 })
    }
    user.twoFactorEnabled = true
    user.twoFactorTemp = undefined
    await user.save()
    return NextResponse.json({ success: true, message: "Two-Factor Authentication enabled!" })
  } catch (error) {
    console.error("2FA verify error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
} 