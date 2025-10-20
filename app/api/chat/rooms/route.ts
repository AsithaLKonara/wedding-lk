import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChatRoom } from '@/lib/models/chat-room'
import { User } from '@/lib/models/user'
import { connectDB } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const rooms = await ChatRoom.find({
      participants: session.user.id,
      isActive: true
    })
    .populate('participants', 'firstName lastName profileImage userType')
    .populate('lastMessage.senderId', 'firstName lastName')
    .sort({ updatedAt: -1 })

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

