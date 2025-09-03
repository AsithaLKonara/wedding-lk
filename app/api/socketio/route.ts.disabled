import { NextRequest, NextResponse } from 'next/server'
import { initSocket } from '@/lib/socket'

export async function GET(req: NextRequest) {
  try {
    // Initialize Socket.io server
    const io = initSocket(req as any, {} as any)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Socket.io server initialized' 
    })
  } catch (error) {
    console.error('Socket.io initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize Socket.io server' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data } = body
    
    // Initialize Socket.io server
    const io = initSocket(req as any, {} as any)
    
    if (io) {
      // Emit event to all connected clients
      io.emit(event, data)
      
      return NextResponse.json({ 
        success: true, 
        message: `Event ${event} emitted successfully` 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Socket.io server not initialized' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Socket.io event emission error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to emit event' 
    }, { status: 500 })
  }
} 