import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-config';
import { AdsPaymentService } from '@/lib/services/ads-payment-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      campaignId, 
      amount, 
      currency = 'USD', 
      description, 
      packageId,
      paymentMethod = 'card',
      billingCycle = 'one_time'
    } = body;

    // Validate required fields
    if (!campaignId || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: campaignId, amount, description' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 10) {
      return NextResponse.json(
        { error: 'Minimum payment amount is $10' },
        { status: 400 }
      );
    }

    const adsPaymentService = new AdsPaymentService();

    const paymentRequest = {
      campaignId,
      amount,
      currency,
      description,
      vendorId: session.user.id,
      packageId,
      paymentMethod,
      billingCycle,
    };

    const payment = await adsPaymentService.createAdsPayment(paymentRequest);

    return NextResponse.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Ads payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create ads payment' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const adsPaymentService = new AdsPaymentService();
    const payments = await adsPaymentService.getVendorPaymentHistory(session.user.id, limit);

    return NextResponse.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
