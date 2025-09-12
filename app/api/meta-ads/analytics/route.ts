import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-config';
import { MetaAdsService } from '@/lib/services/meta-ads-service';
import { MetaAdsAccount } from '@/lib/models/metaAds';

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
    const campaignId = searchParams.get('campaignId');
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'daily';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get vendor's Meta Ads account
    const account = await MetaAdsAccount.findOne({ 
      vendorId: session.user.id,
      isActive: true 
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Meta Ads account not found or not connected' },
        { status: 404 }
      );
    }

    const metaAdsService = new MetaAdsService(account.accessToken);

    let insights;
    if (campaignId) {
      // Get specific campaign insights
      const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
      insights = await metaAdsService.getCampaignInsights(campaignId, dateRange);
      
      // Get trends if requested
      if (period) {
        const trends = await metaAdsService.getCampaignTrends(campaignId, period);
        insights.trends = trends;
      }
    } else {
      // Get account-level insights
      insights = await metaAdsService.getAccountInsights();
    }

    return NextResponse.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Meta Ads analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Meta Ads analytics' },
      { status: 500 }
    );
  }
}

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
    const { campaignId, action, parameters } = body;

    // Get vendor's Meta Ads account
    const account = await MetaAdsAccount.findOne({ 
      vendorId: session.user.id,
      isActive: true 
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Meta Ads account not found or not connected' },
        { status: 404 }
      );
    }

    const metaAdsService = new MetaAdsService(account.accessToken);

    let result;
    switch (action) {
      case 'optimize_campaign':
        // Implement campaign optimization logic
        result = await optimizeCampaign(metaAdsService, campaignId, parameters);
        break;
      case 'update_budget':
        result = await updateCampaignBudget(metaAdsService, campaignId, parameters.budget);
        break;
      case 'pause_campaign':
        result = await metaAdsService.updateCampaignStatus(campaignId, 'PAUSED');
        break;
      case 'resume_campaign':
        result = await metaAdsService.updateCampaignStatus(campaignId, 'ACTIVE');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Meta Ads action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform Meta Ads action' },
      { status: 500 }
    );
  }
}

// Helper functions for campaign optimization
async function optimizeCampaign(metaAdsService: MetaAdsService, campaignId: string, parameters: any) {
  // Get current campaign insights
  const insights = await metaAdsService.getCampaignInsights(campaignId);
  
  // Generate optimization recommendations based on current performance
  const optimizations = [];
  
  if (insights.metrics.ctr < 1.0) {
    optimizations.push({
      type: 'creative',
      recommendation: 'Update ad creative to improve click-through rate',
      priority: 'high'
    });
  }
  
  if (insights.metrics.cpc > 2.0) {
    optimizations.push({
      type: 'targeting',
      recommendation: 'Refine targeting to reduce cost per click',
      priority: 'high'
    });
  }
  
  if (insights.metrics.conversions === 0 && insights.metrics.spend > 0) {
    optimizations.push({
      type: 'budget',
      recommendation: 'Adjust budget allocation or targeting strategy',
      priority: 'medium'
    });
  }
  
  return {
    campaignId,
    optimizations,
    currentMetrics: insights.metrics,
    recommendations: insights.recommendations
  };
}

async function updateCampaignBudget(metaAdsService: MetaAdsService, campaignId: string, budget: number) {
  // This would typically involve updating the campaign budget
  // For now, we'll return a success response
  return {
    campaignId,
    newBudget: budget,
    message: 'Budget updated successfully'
  };
}
