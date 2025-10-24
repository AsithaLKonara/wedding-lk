import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, Venue, Vendor, Booking } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const [userCount, venueCount, vendorCount, bookingCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Venue.countDocuments({ isActive: true }),
      Vendor.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: 'confirmed' })
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalVenues: venueCount,
        totalVendors: vendorCount,
        successfulBookings: bookingCount,
        platformStats: {
          usersOnline: Math.floor(userCount * 0.3),
          activeListings: venueCount + vendorCount,
          bookingsThisMonth: bookingCount
        }
      }
    })
  } catch (error) {
    console.error('[Home Stats API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 