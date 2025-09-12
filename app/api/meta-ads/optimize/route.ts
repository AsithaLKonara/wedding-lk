import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-config';
import { CampaignOptimizationService } from '@/lib/services/campaign-optimization-service';
import { MetaAdsService } from '@/lib/services/meta-ads-service';
import { MetaAdsAccount } from '@/lib/models/metaAds';

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
    const optimizationService = new CampaignOptimizationService();

    let result;
    switch (action) {
      case 'optimize_campaign':
        if (!campaignId) {
          return NextResponse.json(
            { error: 'Campaign ID is required for optimization' },
            { status: 400 }
          );
        }
        
        const insights = await metaAdsService.getCampaignInsights(campaignId);
        result = await optimizationService.optimizeCampaign(campaignId, metaAdsService, insights);
        break;
        
      case 'get_recommendations':
        if (!campaignId) {
          return NextResponse.json(
            { error: 'Campaign ID is required for recommendations' },
            { status: 400 }
          );
        }
        
        result = await optimizationService.getOptimizationRecommendations(campaignId, metaAdsService);
        break;
        
      case 'batch_optimize':
        const campaignIds = parameters?.campaignIds || [];
        if (campaignIds.length === 0) {
          return NextResponse.json(
            { error: 'Campaign IDs are required for batch optimization' },
            { status: 400 }
          );
        }
        
        result = await optimizationService.batchOptimizeCampaigns(campaignIds, metaAdsService);
        break;
        
      case 'get_summary':
        const summaryCampaignIds = parameters?.campaignIds || [];
        result = await optimizationService.getOptimizationSummary(summaryCampaignIds, metaAdsService);
        break;
        
      case 'toggle_rule':
        const { ruleId, enabled } = parameters || {};
        if (!ruleId) {
          return NextResponse.json(
            { error: 'Rule ID is required' },
            { status: 400 }
          );
        }
        
        optimizationService.toggleRule(ruleId, enabled);
        result = { success: true, message: `Rule ${ruleId} ${enabled ? 'enabled' : 'disabled'}` };
        break;
        
      case 'get_rules':
        result = optimizationService.getOptimizationRules();
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid optimization action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Campaign optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to execute optimization action' },
      { status: 500 }
    );
  }
}
