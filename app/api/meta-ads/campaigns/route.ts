import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { MetaAdsCampaign, MetaAdsAccount, Vendor } from '@/lib/models';
import { MetaAdsService } from '@/lib/services/meta-ads-service';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const campaigns = await MetaAdsCampaign.find({ vendorId })
      .populate('packageId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching Meta Ads campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, packageId, name, objective, budget, dailyBudget, lifetimeBudget, startTime, endTime, targeting } = body;

    if (!vendorId || !name || !objective || !budget || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get Meta Ads account for this vendor
    const metaAccount = await MetaAdsAccount.findOne({ vendorId, isActive: true });
    if (!metaAccount) {
      return NextResponse.json({ error: 'Meta Ads account not connected' }, { status: 400 });
    }

    // Initialize Meta Ads service
    const metaAdsService = new MetaAdsService(metaAccount.accessToken);

    // Validate access token
    const isValidToken = await metaAdsService.validateAccessToken();
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid Meta Ads access token' }, { status: 400 });
    }

    // Create campaign in Meta Ads
    const metaCampaign = await metaAdsService.createCampaign({
      name,
      objective,
      budget,
      dailyBudget,
      lifetimeBudget,
      startTime,
      endTime
    });

    // Save campaign to database
    const campaign = new MetaAdsCampaign({
      vendorId,
      packageId,
      metaCampaignId: metaCampaign.id,
      name,
      objective,
      status: 'DRAFT',
      budget,
      dailyBudget,
      lifetimeBudget,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      targeting: targeting || {
        ageMin: 25,
        ageMax: 45,
        genders: [1, 2],
        geoLocations: {
          countries: ['LK'],
          regions: [],
          cities: []
        },
        interests: [],
        behaviors: [],
        demographics: []
      }
    });

    await campaign.save();

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating Meta Ads campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
