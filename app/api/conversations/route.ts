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

    // Get all conversations for the user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: user._id },
            { receiver: user._id }
          ],
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ])

    // Populate user information for each conversation
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = conv.lastMessage
        
        // Determine the other user in the conversation
        const otherUserId = lastMessage.sender.toString() === user._id.toString() 
          ? lastMessage.receiver 
          : lastMessage.sender

        const otherUser = await User.findById(otherUserId).select('name email avatar role')
        
        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: {
            content: lastMessage.content,
            messageType: lastMessage.messageType,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead
          },
          unreadCount: conv.unreadCount
        }
      })
    )

    return NextResponse.json({ conversations: populatedConversations })

  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
} 