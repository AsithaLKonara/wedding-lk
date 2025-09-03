import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { Payment } from "@/lib/models/Payment"

// POST /api/payments - Process payments
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { type, amount, currency, description, paymentMethod, userId } = body

    if (!type || !amount || !userId) {
      return NextResponse.json({ 
        error: 'Payment type, amount, and userId are required' 
      }, { status: 400 })
    }

    // Validate user exists
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Create new payment
    const payment = new Payment({
      userId,
      type,
      amount: parseFloat(amount),
      currency: currency || 'LKR',
      method: paymentMethod || 'card',
      status: 'pending',
      description: description || 'WeddingLK Payment'
    })

    await payment.save()

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment processed successfully'
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Payment processing failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/payments - Get payment history
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ 
        error: 'UserId is required' 
      }, { status: 400 })
    }

    // Build query
    const query: any = { userId }
    if (type) {
      query.type = type
    }

    // Get payments with user population
    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('bookingId', 'date guestCount totalAmount')
      .sort({ createdAt: -1 })
      .limit(limit)

    const total = await Payment.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: payments,
      total
    })

  } catch (error) {
    console.error('Payment history error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load payment history',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 