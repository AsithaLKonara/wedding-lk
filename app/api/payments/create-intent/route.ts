import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Payment, Booking } from '@/lib/models'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, amount, currency = 'lkr', description } = await request.json()

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId)
    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId,
        userId: session.user.id,
        description: description || 'WeddingLK Package Booking'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create payment record
    const payment = new Payment({
      userId: session.user.id,
      bookingId: bookingId,
      amount: amount,
      currency: currency,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      description: description || 'WeddingLK Package Booking',
      createdAt: new Date()
    })

    await payment.save()

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
