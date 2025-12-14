import { NextRequest, NextResponse } from 'next/server';
import { AdsPaymentService } from '@/lib/services/ads-payment-service';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { error } = getUserFromRequestWithError(req);
    if (error) return error;

    const { paymentId } = await params;
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
