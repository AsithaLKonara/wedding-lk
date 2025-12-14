import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: bookingId } = await params
    await connectDB()

    // Get booking
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email')
      .populate('vendorId', 'businessName contactEmail')
      .populate('venueId', 'name location')

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this booking
    const hasAccess = 
      booking.userId?._id.toString() === authResult.user.id ||
      authResult.user.role === 'admin' ||
      (authResult.user.role === 'vendor' && booking.vendorId?._id.toString() === authResult.user.id)

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Generate invoice data
    const invoice = {
      invoiceNumber: `INV-${booking.bookingNumber}`,
      date: booking.createdAt,
      booking: {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
        totalPrice: booking.totalPrice,
        status: booking.status
      },
      customer: {
        name: (typeof booking.userId === 'object' && booking.userId && 'name' in booking.userId) 
          ? String((booking.userId as { name: string }).name)
          : '',
        email: (typeof booking.userId === 'object' && booking.userId && 'email' in booking.userId)
          ? String((booking.userId as { email: string }).email)
          : ''
      },
      vendor: booking.vendorId && typeof booking.vendorId === 'object' ? {
        name: ('businessName' in booking.vendorId) 
          ? String((booking.vendorId as { businessName: string }).businessName)
          : '',
        email: ('contactEmail' in booking.vendorId)
          ? String((booking.vendorId as { contactEmail: string }).contactEmail)
          : ''
      } : null,
      venue: booking.venueId && typeof booking.venueId === 'object' ? {
        name: ('name' in booking.venueId)
          ? String((booking.venueId as { name: string }).name)
          : '',
        location: ('location' in booking.venueId)
          ? String((booking.venueId as { location: string }).location)
          : ''
      } : null,
      items: booking.items || [],
      subtotal: booking.totalPrice,
      tax: 0,
      total: booking.totalPrice,
      paymentStatus: booking.paymentStatus || 'pending'
    }

    return NextResponse.json({ success: true, invoice }, { status: 200 })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

