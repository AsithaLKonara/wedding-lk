import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = { client: userId }
    if (status) query.status = status

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('venue', 'name location')
      .populate('vendor', 'businessName category')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Booking.countDocuments(query)

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch user bookings" },
      { status: 500 }
    )
  }
} 