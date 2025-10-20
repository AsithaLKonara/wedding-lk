import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'No database connection configured. Using sample data mode.',
        mode: 'sample'
      })
    }

    // Test if we can access collections
    const collections = await db.connection.db.listCollections().toArray()
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      mode: 'database',
      collections: collections.map(col => col.name),
      connectionState: db.connection.readyState
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: `Database connection failed: ${error}`,
      mode: 'error'
    })
  }
}
