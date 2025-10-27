import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookingId = params.id
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
        name: (booking.userId as any)?.name,
        email: (booking.userId as any)?.email
      },
      vendor: booking.vendorId ? {
        name: (booking.vendorId as any)?.businessName,
        email: (booking.vendorId as any)?.contactEmail
      } : null,
      venue: booking.venueId ? {
        name: (booking.venueId as any)?.name,
        location: (booking.venueId as any)?.location
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

