import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Booking, Payment } from '@/lib/models'

export async function POST(
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
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify user owns booking
    if (booking.userId?.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { method, amount, paymentMethod } = await request.json()

    // Create payment record
    const payment = new Payment({
      bookingId: booking._id,
      userId: booking.userId,
      amount: amount || booking.totalPrice,
      currency: 'LKR',
      status: 'pending',
      method: paymentMethod || method || 'card',
      metadata: {
        bookingNumber: booking.bookingNumber
      }
    })

    await payment.save()

    // Update booking with payment reference
    booking.paymentId = payment._id
    booking.paymentStatus = 'pending'
    await booking.save()

    return NextResponse.json(
      { 
        success: true, 
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
          method: payment.method
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

