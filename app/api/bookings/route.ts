import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Booking, Package } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const bookings = await Booking.find({ user: session.user.id })
      .populate('vendor')
      .populate('venue')
        .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
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
      user: session.user.id,
      vendor: primaryVendor,
      date: new Date(eventDate),
      startTime: eventTime,
      guestCount: parseInt(guestCount),
      totalAmount: parseFloat(totalPrice),
      notes: `Contact: ${contactPhone}, Email: ${contactEmail}`,
      specialRequirements: specialRequests || '',
      status: 'pending',
      depositPaid: false
    })

    await booking.save()

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}