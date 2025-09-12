import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { MetaAdsCampaign, MetaAdsAccount, Vendor } from '@/lib/models';
import { MetaAdsService } from '@/lib/services/meta-ads-service';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await MetaAdsCampaign.findById(params.id)
      .populate('vendorId')
      .populate('packageId');

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(campaign.vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error fetching Meta Ads campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, status, budget, dailyBudget, lifetimeBudget, endTime } = body;

    const campaign = await MetaAdsCampaign.findById(params.id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(campaign.vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get Meta Ads account
    const metaAccount = await MetaAdsAccount.findOne({ vendorId: campaign.vendorId, isActive: true });
    if (!metaAccount) {
      return NextResponse.json({ error: 'Meta Ads account not connected' }, { status: 400 });
    }

    // Initialize Meta Ads service
    const metaAdsService = new MetaAdsService(metaAccount.accessToken);

    // Update campaign in Meta Ads if status is being changed
    if (status && status !== campaign.status) {
      await metaAdsService.updateCampaignStatus(campaign.metaCampaignId, status);
    }

    // Update campaign in database
    const updateData: any = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    if (budget !== undefined) updateData.budget = budget;
    if (dailyBudget !== undefined) updateData.dailyBudget = dailyBudget;
    if (lifetimeBudget !== undefined) updateData.lifetimeBudget = lifetimeBudget;
    if (endTime) updateData.endTime = new Date(endTime);

    const updatedCampaign = await MetaAdsCampaign.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('packageId');

    return NextResponse.json({ campaign: updatedCampaign });
  } catch (error) {
    console.error('Error updating Meta Ads campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await MetaAdsCampaign.findById(params.id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(campaign.vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get Meta Ads account
    const metaAccount = await MetaAdsAccount.findOne({ vendorId: campaign.vendorId, isActive: true });
    if (metaAccount) {
      // Initialize Meta Ads service
      const metaAdsService = new MetaAdsService(metaAccount.accessToken);
      
      // Delete campaign in Meta Ads
      await metaAdsService.updateCampaignStatus(campaign.metaCampaignId, 'DELETED');
    }

    // Update campaign status in database
    await MetaAdsCampaign.findByIdAndUpdate(params.id, { status: 'DELETED' });

    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting Meta Ads campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
