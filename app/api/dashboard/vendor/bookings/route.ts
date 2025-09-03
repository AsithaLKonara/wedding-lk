import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const date = searchParams.get('date') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = { vendor: vendorId }
    if (status) query.status = status
    if (date) {
      const searchDate = new Date(date)
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      }
    }
    if (search) {
      query.$or = [
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.email': { $regex: search, $options: 'i' } },
        { 'client.phone': { $regex: search, $options: 'i' } }
      ]
    }

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('client', 'name email phone')
      .populate('venue', 'name location')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Booking.countDocuments(query)

    // Get status counts for summary
    const statusCounts = await Booking.aggregate([
      { $match: { vendor: vendorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusSummary = statusCounts.reduce((acc: any, item) => {
      acc[item._id] = item.count
      return acc
    }, {})

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statusSummary
    })

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
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
    const { bookingId, updates } = body

    if (!bookingId || !updates) {
      return NextResponse.json(
        { error: "Booking ID and updates are required" },
        { status: 400 }
      )
    }

    // Verify booking belongs to vendor
    const booking = await Booking.findOne({ _id: bookingId, vendor: vendorId })
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or access denied" },
        { status: 404 }
      )
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('client', 'name email phone')
     .populate('venue', 'name location')

    return NextResponse.json({ booking: updatedBooking })

  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
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
    const { bookingId, action } = body

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: "Booking ID and action are required" },
        { status: 400 }
      )
    }

    // Verify booking belongs to vendor
    const booking = await Booking.findOne({ _id: bookingId, vendor: vendorId })
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or access denied" },
        { status: 404 }
      )
    }

    let updates: any = {}

    switch (action) {
      case 'confirm':
        updates = { status: 'confirmed' }
        break
      case 'reject':
        updates = { status: 'rejected' }
        break
      case 'complete':
        updates = { status: 'completed' }
        break
      case 'cancel':
        updates = { status: 'cancelled' }
        break
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('client', 'name email phone')
     .populate('venue', 'name location')

    return NextResponse.json({ 
      booking: updatedBooking,
      message: `Booking ${action}ed successfully` 
    })

  } catch (error) {
    console.error("Error processing booking action:", error)
    return NextResponse.json(
      { error: "Failed to process booking action" },
      { status: 500 }
    )
  }
} 