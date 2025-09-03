import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import { User } from "@/lib/models/user"
import { getServerSession } from '@/lib/auth-utils';

// POST /api/bookings - Create booking
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
    const { venueId, vendorId, date, startTime, endTime, guestCount, totalAmount, services, notes, specialRequirements } = body

    if (!venueId || !date || !guestCount || !totalAmount) {
      return NextResponse.json({
        error: 'Venue ID, date, guest count, and total amount are required'
      }, { status: 400 })
    }

    // Validate venue exists
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Validate vendor if provided
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId)
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
      }
    }

    // Check venue availability
    const existingBooking = await Booking.findOne({
      venue: venueId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    })

    if (existingBooking) {
      return NextResponse.json({
        error: 'Venue is already booked for this date'
      }, { status: 409 })
    }

    // Create new booking
    const booking = new Booking({
      user: user._id,
      venue: venueId,
      vendor: vendorId || null,
      date: new Date(date),
      startTime,
      endTime,
      guestCount: parseInt(guestCount),
      totalAmount: parseFloat(totalAmount),
      services: services || [],
      notes: notes || '',
      specialRequirements: specialRequirements || '',
      status: 'pending',
      depositAmount: parseFloat(totalAmount) * 0.2, // 20% deposit
      depositPaid: false
    })

    await booking.save()

    // Populate related data
    await booking.populate('venue', 'name location')
    await booking.populate('vendor', 'businessName category')
    await booking.populate('user', 'name email')

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Booking creation failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Get bookings
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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query based on user role
    const query: any = {}
    
    if (user.role === 'admin') {
      // Admin can see all bookings
    } else if (user.role === 'vendor') {
      // Vendor can see their own bookings
      query.vendor = user._id
    } else {
      // Regular user can see their own bookings
      query.user = user._id
    }

    if (status) {
      query.status = status
    }

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('venue', 'name location capacity pricing')
      .populate('vendor', 'businessName category contact')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)

    // Get total count
    const total = await Booking.countDocuments(query)

    // Get status counts
    const statusCounts = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusSummary = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      statusSummary
    })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/bookings - Update booking
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

    const body = await request.json()
    const { bookingId, status, startTime, endTime, guestCount, notes, specialRequirements } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Find booking and check permissions
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user has permission to update this booking
    if (user.role !== 'admin' && 
        user.role !== 'vendor' && 
        booking.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to update this booking' }, { status: 403 })
    }

    // Update booking fields
    const updateData: any = {}
    if (status) updateData.status = status
    if (startTime) updateData.startTime = startTime
    if (endTime) updateData.endTime = endTime
    if (guestCount) updateData.guestCount = parseInt(guestCount)
    if (notes !== undefined) updateData.notes = notes
    if (specialRequirements !== undefined) updateData.specialRequirements = specialRequirements

    // Add status change timestamp
    if (status && status !== booking.status) {
      updateData.statusChangedAt = new Date()
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).populate('venue vendor user')

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    })

  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update booking',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings - Cancel booking
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
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Find booking and check permissions
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user has permission to cancel this booking
    if (user.role !== 'admin' && 
        user.role !== 'vendor' && 
        booking.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to cancel this booking' }, { status: 403 })
    }

    // Cancel booking (soft delete)
    await Booking.findByIdAndUpdate(bookingId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: user._id
    })

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    })

  } catch (error) {
    console.error('Booking cancellation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel booking',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 