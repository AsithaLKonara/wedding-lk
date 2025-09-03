import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
import { User } from "@/lib/models/user"
import { Message } from "@/lib/models/message"
import { Payment } from "@/lib/models/Payment"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID from session
    const userId = session.user.id

    // Get user stats
    const totalBookings = await Booking.countDocuments({ client: userId })
    const totalFavorites = await User.findById(userId).then(user => user?.favorites?.length || 0)
    const totalMessages = await Message.countDocuments({ 
      client: userId, 
      isRead: false 
    })
    const totalPayments = await Payment.countDocuments({ 
      user: userId, 
      status: 'completed' 
    })

    const stats = {
      totalBookings,
      totalFavorites,
      totalMessages,
      totalPayments
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    )
  }
} 