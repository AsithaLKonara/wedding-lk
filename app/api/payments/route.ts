import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const vendorId = searchParams.get('vendorId');
    const bookingId = searchParams.get('bookingId');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');

    console.log('📊 Fetching payments from MongoDB Atlas...');

    // Build MongoDB query
    const query: any = {};

    if (clientId) {
      query.user = clientId;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (bookingId) {
      query.booking = bookingId;
    }

    if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('user', 'name email')
        .populate('vendor', 'businessName')
        .populate('booking', 'date status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query)
    ]);

    console.log(`✅ Found ${payments.length} payments`);

    return NextResponse.json({
      success: true,
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payments',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const paymentData = await request.json();
    
    console.log('📝 Creating new payment...');

    // Validate required fields
    if (!paymentData.user || !paymentData.amount || !paymentData.paymentMethod) {
      return NextResponse.json({
        success: false,
        error: 'User, amount, and payment method are required'
      }, { status: 400 });
    }

    // Create payment
    const newPayment = new Payment({
      ...paymentData,
      currency: 'LKR',
      status: 'pending',
      transactionId: `TXN${Date.now()}`
    });

    await newPayment.save();

    console.log('✅ Payment created successfully:', newPayment._id);

    return NextResponse.json({
      success: true,
      payment: newPayment,
      message: 'Payment created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}