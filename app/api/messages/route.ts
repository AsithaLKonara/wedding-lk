import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from '@/lib/auth-utils';
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { Message } from "@/lib/models/message"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      )
    }

    // Get messages for the conversation
    const messages = await Message.find({ 
      conversationId,
      $or: [
        { sender: user._id },
        { receiver: user._id }
      ],
      isDeleted: false
    })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)

    // Get total count
    const totalCount = await Message.countDocuments({ 
      conversationId,
      $or: [
        { sender: user._id },
        { receiver: user._id }
      ],
      isDeleted: false
    })

    // Mark messages as read if receiver is current user
    const unreadMessages = messages.filter(m => 
      m.receiver.toString() === user._id.toString() && !m.isRead
    )

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { isRead: true, readAt: new Date() }
      )
    }

    return NextResponse.json({
      messages,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { receiverId, content, messageType, attachments, replyTo } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 }
      )
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      )
    }

    // Generate conversation ID (simple hash of sorted user IDs)
    const userIds = [user._id.toString(), receiverId].sort()
    const conversationId = `${userIds[0]}-${userIds[1]}`

    const message = new Message({
      sender: user._id,
      receiver: receiverId,
      content,
      messageType: messageType || 'text',
      attachments: attachments || [],
      conversationId,
      replyTo
    })

    await message.save()

    // Populate sender and receiver info
    await message.populate('sender', 'name email avatar')
    await message.populate('receiver', 'name email avatar')

    return NextResponse.json({ 
      success: true, 
      message 
    })

  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// PUT - Update message
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')
    const body = await request.json()
    const { content, messageType, attachments } = body

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      )
    }

    // Find the message
    const message = await Message.findById(messageId)
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    // Check if user is the sender
    if (message.sender.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to update this message" },
        { status: 403 }
      )
    }

    // Update message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        content: content || message.content,
        messageType: messageType || message.messageType,
        attachments: attachments || message.attachments,
        updatedAt: new Date(),
        isEdited: true
      },
      { new: true, runValidators: true }
    ).populate('sender', 'name email avatar')
     .populate('receiver', 'name email avatar')

            return NextResponse.json({
              success: true,
              data: updatedMessage,
              message: 'Message updated successfully'
            })

  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    )
  }
}

// DELETE - Delete message (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      )
    }

    // Find the message
    const message = await Message.findById(messageId)
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    // Check if user is the sender or receiver
    if (message.sender.toString() !== user._id.toString() && 
        message.receiver.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to delete this message" },
        { status: 403 }
      )
    }

    // Soft delete - set isDeleted to true
    await Message.findByIdAndUpdate(messageId, {
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })

  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    )
  }
} 