import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Message } from "@/lib/models/message"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!token || session.user?.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID from session
    const userId = session.user.id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Get messages with pagination
    const messages = await Message.find({ client: userId })
      .populate('sender', 'name email avatar')
      .populate('vendor', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Message.countDocuments({ client: userId })

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching user messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch user messages" },
      { status: 500 }
    )
  }
} 