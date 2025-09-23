import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"

export async function GET(request: NextRequest) {
  await connectDB()
  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
  }
  const user = await (User as any).findOne({ verificationToken: token })
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 })
  }
  user.isVerified = true
  user.verificationToken = undefined
  await user.save()
  return NextResponse.json({ success: true, message: "Email verified" })
} 