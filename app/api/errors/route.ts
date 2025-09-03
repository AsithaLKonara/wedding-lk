import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { error, stack, userAgent, url } = await request.json()

    // Log error to database or external service
    console.error("Client error:", {
      error,
      stack,
      userAgent,
      url,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
