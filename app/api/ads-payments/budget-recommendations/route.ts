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
    const { amount, priority = 'medium', billingCycle = 'one_time' } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const adsPaymentService = new AdsPaymentService();
    
    const campaignData = {
      priority,
      billingCycle,
      amount
    };

    const recommendations = adsPaymentService.calculateBudgetRecommendations(campaignData);

    return NextResponse.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Budget recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate budget recommendations' },
      { status: 500 }
    );
  }
}
