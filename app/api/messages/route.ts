import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Message, Conversation } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    await connectDB()

    if (conversationId) {
      // Get messages for specific conversation
      const messages = await Message.find({ conversationId })
        .populate('senderId', 'name email image')
        .sort({ createdAt: 1 })

      return NextResponse.json({ success: true, messages })
    } else {
      // Get all conversations for user
      const conversations = await Conversation.find({
        participants: session.user.id
      })
        .populate('participants', 'name email image')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })

      return NextResponse.json({ success: true, conversations })
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { recipientId, content, conversationId } = await request.json()

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    let currentConversationId = conversationId

    // If no conversation ID, create or find existing conversation
    if (!currentConversationId) {
      let conversation = await Conversation.findOne({
        participants: { $all: [session.user.id, recipientId] }
      })

      if (!conversation) {
        conversation = new Conversation({
          participants: [session.user.id, recipientId],
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await conversation.save()
      }

      currentConversationId = conversation._id
    }

    // Create message
    const message = new Message({
      conversationId: currentConversationId,
      senderId: session.user.id,
      content,
      createdAt: new Date()
    })

    await message.save()

    // Update conversation last message and timestamp
    await Conversation.findByIdAndUpdate(currentConversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    })

    // Populate sender info
    await message.populate('senderId', 'name email image')

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}