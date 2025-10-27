import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { User, Booking, Vendor, Venue } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, ['vendor'])
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = authResult.user
    await connectDB()

    // Get vendor profile
    const vendor = await Vendor.findOne({ userId: user.id })
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Get vendor statistics
    const totalBookings = await Booking.countDocuments({ vendorId: user.id })
    const totalRevenue = await Booking.aggregate([
      { $match: { vendorId: user.id, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]).then(result => result[0]?.total || 0)

    const recentBookings = await Booking.find({ vendorId: user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')

    const stats = {
      vendor: {
        id: vendor._id.toString(),
        name: vendor.businessName || vendor.name,
        email: vendor.contactEmail || user.email
      },
      stats: {
        totalBookings,
        totalRevenue,
        pendingBookings: await Booking.countDocuments({ vendorId: user.id, status: 'pending' }),
        completedBookings: await Booking.countDocuments({ vendorId: user.id, status: 'completed' })
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking._id.toString(),
        client: booking.userId?.name || 'Unknown',
        date: booking.date,
        status: booking.status,
        amount: booking.totalPrice
      }))
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Vendor dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

