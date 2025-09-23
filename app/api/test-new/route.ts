import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "New Test API is working!",
    timestamp: new Date().toISOString()
  })
}
