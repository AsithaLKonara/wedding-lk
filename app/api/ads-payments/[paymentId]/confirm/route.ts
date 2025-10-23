import { NextRequest, NextResponse } from 'next/server';
import { AdsPaymentService } from '@/lib/services/ads-payment-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { paymentId } = params;
    const adsPaymentService = new AdsPaymentService();

    const result = await adsPaymentService.confirmAdsPayment(paymentId);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
