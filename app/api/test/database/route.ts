import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const connection = await connectDB()

    // Test basic database operations
    const dbStats = {
      connected: true,
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name,
      collections: Object.keys(connection.connection.collections),
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      stats: dbStats,
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
