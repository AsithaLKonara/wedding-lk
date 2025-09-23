import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ 
      success: true, 
      message: "Database connected successfully!",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Database connection failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
