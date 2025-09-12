import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { connectDB } from '@/lib/db';
import { Payment } from '@/lib/models/Payment';
import { User } from '@/lib/models/user';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { sessionId } = params;

    // Find payment by Stripe session ID
    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
      user: user._id
    });

    if (!payment) {
      return NextResponse.json({ 
        error: 'Payment not found' 
      }, { status: 404 });
    }

    // Format payment data for frontend
    const paymentData = {
      id: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      items: payment.metadata?.items || [],
    };

    return NextResponse.json({
      success: true,
      payment: paymentData
    });

  } catch (error) {
    console.error('Payment session fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payment details',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}



