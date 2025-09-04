import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const vendorId = searchParams.get('vendorId');
    const bookingId = searchParams.get('bookingId');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');

    console.log('📊 Fetching payments from local database...');

    let payments = LocalDatabase.read('payments');

    // Filter by client if provided
    if (clientId) {
      payments = payments.filter((payment: any) => payment.client === clientId);
    }

    // Filter by vendor if provided
    if (vendorId) {
      payments = payments.filter((payment: any) => payment.vendor === vendorId);
    }

    // Filter by booking if provided
    if (bookingId) {
      payments = payments.filter((payment: any) => payment.booking === bookingId);
    }

    // Filter by status if provided
    if (status) {
      payments = payments.filter((payment: any) => payment.status === status);
    }

    // Filter by payment method if provided
    if (paymentMethod) {
      payments = payments.filter((payment: any) => payment.paymentMethod === paymentMethod);
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('payments', page, limit);

    console.log(`✅ Found ${payments.length} payments`);

    return NextResponse.json({
      success: true,
      payments: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
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
    const paymentData = await request.json();
    
    console.log('📝 Creating new payment...');

    // Validate required fields
    if (!paymentData.booking || !paymentData.client || !paymentData.vendor || !paymentData.amount || !paymentData.paymentMethod) {
      return NextResponse.json({
        success: false,
        error: 'Booking, client, vendor, amount, and payment method are required'
      }, { status: 400 });
    }

    // Create payment
    const newPayment = LocalDatabase.create('payments', {
      ...paymentData,
      currency: 'LKR',
      status: 'pending',
      transactionId: `TXN${Date.now()}`
    });

    if (!newPayment) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create payment'
      }, { status: 500 });
    }

    console.log('✅ Payment created successfully:', newPayment.id);

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