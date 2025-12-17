import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    }

    // Try to check database connection
    try {
      await connectDB()
      status.database = 'connected'
    } catch (error) {
      status.database = 'disconnected'
    }

    return NextResponse.json({
      success: true,
      status
    })
  } catch (error) {
    console.error('Error checking status:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

