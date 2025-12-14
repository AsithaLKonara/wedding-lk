import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'

export async function GET() {
  try {
    // Try to connect to database
    await connectDB()
    
    // Try to query a collection
    const userCount = await User.countDocuments()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Health Check] Database error:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
