import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Message } from '@/lib/models/message'
import { ChatRoom } from '@/lib/models/chat-room'
import { connectDB } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    await connectDB()

    // Verify user has access to the room
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: session.user.id,
      isActive: true
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found or access denied' }, { status: 404 })
    }

    const skip = (page - 1) * limit

    const messages = await Message.find({
      roomId,
      isDeleted: false
    })
    .populate('senderId', 'firstName lastName profileImage userType')
    .populate('replyTo')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)

    // Mark messages as read
    await Message.updateMany(
      {
        roomId,
        'readBy.userId': { $ne: session.user.id }
      },
      {
        $push: {
          readBy: {
            userId: session.user.id,
            readAt: new Date()
          }
        }
      }
    )

    return NextResponse.json({ 
      messages: messages.reverse(),
      hasMore: messages.length === limit
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

