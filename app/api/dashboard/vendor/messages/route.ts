import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Message } from "@/lib/models/message"
import { Vendor } from "@/lib/models/vendor"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const conversationId = searchParams.get('conversationId') || ''
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const skip = (page - 1) * limit

    // Build query
    const query: any = { vendor: vendorId }
    if (conversationId) query.conversationId = conversationId
    if (unreadOnly) query.isRead = false

    // Get messages with pagination
    const messages = await Message.find(query)
      .populate('sender', 'name email avatar')
      .populate('client', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Message.countDocuments(query)

    // Get unread count
    const unreadCount = await Message.countDocuments({
      vendor: vendorId,
      isRead: false
    })

    // Get conversations summary
    const conversations = await Message.aggregate([
      { $match: { vendor: vendorId } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: { $cond: ['$isRead', 0, 1] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.client',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ])

    return NextResponse.json({
      messages,
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
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
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const body = await request.json()
    const { conversationId, clientId, content, messageType = 'text' } = body

    if (!conversationId || !clientId || !content) {
      return NextResponse.json(
        { error: "Conversation ID, client ID, and content are required" },
        { status: 400 }
      )
    }

    // Create new message
    const message = await Message.create({
      conversationId,
      vendor: vendorId,
      client: clientId,
      sender: session.user.id,
      content,
      messageType,
      isRead: false,
      direction: 'outbound'
    })

    // Populate sender and client info
    await message.populate('sender', 'name email avatar')
    await message.populate('client', 'name email avatar')

    return NextResponse.json({ message }, { status: 201 })

  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const body = await request.json()
    const { messageId, updates } = body

    if (!messageId || !updates) {
      return NextResponse.json(
        { error: "Message ID and updates are required" },
        { status: 400 }
      )
    }

    // Verify message belongs to vendor
    const message = await Message.findOne({ _id: messageId, vendor: vendorId })
    if (!message) {
      return NextResponse.json(
        { error: "Message not found or access denied" },
        { status: 404 }
      )
    }

    // Update message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('sender', 'name email avatar')
     .populate('client', 'name email avatar')

    return NextResponse.json({ message: updatedMessage })

  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const body = await request.json()
    const { conversationId } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      )
    }

    // Mark all messages in conversation as read
    await Message.updateMany(
      { 
        conversationId, 
        vendor: vendorId, 
        isRead: false,
        direction: 'inbound'
      },
      { isRead: true }
    )

    return NextResponse.json({ message: "Messages marked as read" })

  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    )
  }
} 