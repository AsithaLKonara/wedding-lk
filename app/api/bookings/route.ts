import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const bookings = await Booking.find({ userId: session.user.id })
      .populate('packageId')
      .populate('vendorId')
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

    const booking = new Booking({
      userId: session.user.id,
      packageId,
      vendorId: 'mock-vendor-id', // Replace with actual vendor ID from package
      eventDate: new Date(eventDate),
      eventTime,
      guestCount,
      contactPhone,
      contactEmail,
      specialRequests: specialRequests || '',
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date()
    })

    await booking.save()

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}