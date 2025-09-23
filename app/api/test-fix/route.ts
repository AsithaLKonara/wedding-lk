import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Test Fix API is working!",
    timestamp: new Date().toISOString()
  })
}
