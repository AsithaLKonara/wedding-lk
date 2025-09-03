import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Test basic database operations
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ 
        error: "Database connection not established",
        status: "failed"
      }, { status: 500 })
    }
    
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({ 
      status: "success",
      collections: collections.map(c => c.name),
      message: "Database connection and models working"
    })

  } catch (error) {
    console.error("Test models error:", error)
    return NextResponse.json(
      { 
        error: "Failed to test models",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 