import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/lib/models';
import { paymentSchemas } from '@/lib/validations/api-validators';
import { handleApiError, createSuccessResponse, createPaginatedResponse } from '@/lib/utils/error-handler';

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
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        payments: [
          {
            _id: 'mock-payment-1',
            user: { _id: 'mock-user-1', name: 'Test User', email: 'test@example.com' },
            vendor: { _id: 'mock-vendor-1', businessName: 'Elegant Photography Studio' },
            booking: { _id: 'mock-booking-1', date: '2024-12-25', status: 'confirmed' },
            amount: 50000,
            currency: 'LKR',
            status: 'completed',
            paymentMethod: 'stripe',
            transactionId: 'TXN123456789',
            createdAt: new Date()
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    }
    
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

    // Validate input data
    const validation = paymentSchemas.create.safeParse(paymentData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Create payment
    const newPayment = new Payment({
      ...validatedData,
      currency: validatedData.currency || 'LKR',
      status: 'pending',
      transactionId: `TXN${Date.now()}`
    });

    await newPayment.save();

    console.log('✅ Payment created successfully:', newPayment._id);

    return createSuccessResponse(newPayment, 'Payment created successfully', 201);

  } catch (error) {
    console.error('❌ Error creating payment:', error);
    return handleApiError(error, '/api/payments');
  }
}

// PUT - Update payment
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');
    const paymentData = await request.json();

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 });
    }

    console.log('📝 Updating payment:', paymentId);

    // Validate input data
    const validation = paymentSchemas.update.safeParse(paymentData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    // Update payment
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('vendor', 'businessName')
     .populate('venue', 'name')
     .populate('booking', 'date status');

    console.log('✅ Payment updated successfully:', updatedPayment._id);

    return createSuccessResponse(updatedPayment, 'Payment updated successfully');

  } catch (error) {
    console.error('❌ Error updating payment:', error);
    return handleApiError(error, '/api/payments');
  }
}

// DELETE - Delete payment (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 });
    }

    console.log('📝 Deleting payment:', paymentId);

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    // Soft delete - set status to cancelled
    await Payment.findByIdAndUpdate(paymentId, {
      status: 'cancelled',
      updatedAt: new Date()
    });

    console.log('✅ Payment deleted successfully:', payment._id);

    return createSuccessResponse(null, 'Payment deleted successfully');

  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    return handleApiError(error, '/api/payments');
  }
}