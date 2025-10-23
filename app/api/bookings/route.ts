import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Booking, Package } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const bookings = await Booking.find({ user: user.id })
      .populate('vendor')
      .populate('venue')
        .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        success: true, 
        bookings: [
          {
            _id: 'mock-booking-1',
            user: user ?.user?.id || 'test-user',
            vendor: {
              _id: 'mock-vendor-1',
              businessName: 'Elegant Photography Studio'
            },
            venue: {
              _id: 'mock-venue-1',
              name: 'Beautiful Garden Venue'
            },
            eventDate: new Date('2024-12-25'),
            eventTime: '18:00',
            guestCount: 100,
            status: 'confirmed',
            payment: {
              amount: 50000,
              currency: 'LKR',
              status: 'completed'
            },
            createdAt: new Date()
          }
        ]
      })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      packageId,
      eventDate,
      eventTime,
      guestCount,
      contactPhone,
      contactEmail,
      specialRequests,
      totalPrice
    } = await request.json()

    if (!packageId || !eventDate || !eventTime || !guestCount || !contactPhone || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Get package details to find vendor
    const packageData = await Package.findById(packageId).populate('vendors')
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Use the first vendor from the package
    const primaryVendor = packageData.vendors && packageData.vendors.length > 0 ? packageData.vendors[0] : null

    const booking = new Booking({
      user: user.id,
      vendor: primaryVendor,
      eventDate: new Date(eventDate),
      eventTime: eventTime,
      guestCount: parseInt(guestCount),
      payment: {
        amount: parseFloat(totalPrice),
        currency: 'LKR',
        status: 'pending',
        method: 'bank_transfer'
      },
      notes: `Contact: ${contactPhone}, Email: ${contactEmail}. Special Requests: ${specialRequests || 'None'}`,
      status: 'pending'
    })

    await booking.save()

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}