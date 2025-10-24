import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Booking, Package } from '@/lib/models'
import { verifyToken } from '@/lib/auth/custom-auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from token
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - missing token' },
        { status: 401 }
      )
    }
    
    const user = verifyToken(token)
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    await connectDB()

    const bookings = await Booking.find({ userId: user.id })
      .populate('vendorId')
      .populate('venueId')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ 
      success: true, 
      bookings,
      count: bookings.length
    })
  } catch (error) {
    console.error('[Bookings API] Error fetching bookings:', error)
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        success: true, 
        bookings: [
          {
            _id: 'mock-booking-1',
            userId: 'test-user',
            vendorId: {
              _id: 'mock-vendor-1',
              businessName: 'Elegant Photography Studio'
            },
            venueId: {
              _id: 'mock-venue-1',
              name: 'Beautiful Garden Venue'
            },
            eventDate: new Date('2024-12-25'),
            eventTime: '18:00',
            guestCount: 100,
            status: 'confirmed',
            totalPrice: 50000,
            currency: 'LKR',
            createdAt: new Date()
          }
        ],
        count: 1
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch bookings', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from token
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - missing token' },
        { status: 401 }
      )
    }
    
    const user = verifyToken(token)
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    const {
      packageId,
      vendorId,
      venueId,
      eventDate,
      eventTime,
      guestCount,
      contactPhone,
      contactEmail,
      specialRequests,
      totalPrice
    } = await request.json()

    // Validate required fields
    if (!eventDate || !eventTime || !guestCount || !contactPhone || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: eventDate, eventTime, guestCount, contactPhone, contactEmail' },
        { status: 400 }
      )
    }

    await connectDB()

    // Create booking
    const bookingData: any = {
      userId: user.id,
      eventDate: new Date(eventDate),
      eventTime: eventTime,
      guestCount: parseInt(guestCount),
      status: 'pending',
      totalPrice: totalPrice ? parseFloat(totalPrice) : 0,
      currency: 'LKR',
      contactPhone,
      contactEmail,
      specialRequests: specialRequests || ''
    }

    if (vendorId) bookingData.vendorId = vendorId
    if (venueId) bookingData.venueId = venueId
    if (packageId) bookingData.packageId = packageId

    const booking = new Booking(bookingData)
    await booking.save()

    console.log('[Bookings API] Booking created successfully:', booking._id)

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Bookings API] Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}