import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { MetaAdsAccount, Vendor } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, accessToken } = body;

    if (!vendorId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user is the vendor or admin
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || (vendor.userId.toString() !== session.user.id && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate access token with Meta
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name'
        }
      });

      // Get ad accounts
      const accountsResponse = await axios.get('https://graph.facebook.com/v18.0/me/adaccounts', {
        params: {
          access_token: accessToken,
          fields: 'id,name,account_status,currency,timezone_name'
        }
      });

      if (accountsResponse.data.data.length === 0) {
        return NextResponse.json({ error: 'No ad accounts found' }, { status: 400 });
      }

      const adAccount = accountsResponse.data.data[0];

      // Check if account already exists
      const existingAccount = await MetaAdsAccount.findOne({ vendorId });
      if (existingAccount) {
        // Update existing account
        existingAccount.accessToken = accessToken;
        existingAccount.accountName = adAccount.name;
        existingAccount.currency = adAccount.currency;
        existingAccount.timezone = adAccount.timezone_name;
        existingAccount.isActive = adAccount.account_status === 1;
        existingAccount.lastSyncAt = new Date();
        await existingAccount.save();

        return NextResponse.json({ 
          message: 'Meta Ads account updated successfully',
          account: existingAccount 
        });
      } else {
        // Create new account
        const metaAccount = new MetaAdsAccount({
          vendorId,
          metaAccountId: adAccount.id,
          accessToken,
          accountName: adAccount.name,
          currency: adAccount.currency,
          timezone: adAccount.timezone_name,
          isActive: adAccount.account_status === 1,
          permissions: ['ads_management', 'ads_read']
        });

        await metaAccount.save();

        return NextResponse.json({ 
          message: 'Meta Ads account connected successfully',
          account: metaAccount 
        }, { status: 201 });
      }
    } catch (error) {
      console.error('Error validating Meta Ads token:', error);
      return NextResponse.json({ error: 'Invalid access token' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error connecting Meta Ads account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const account = await MetaAdsAccount.findOne({ vendorId, isActive: true });
    
    if (!account) {
      return NextResponse.json({ error: 'Meta Ads account not connected' }, { status: 404 });
    }

    // Return account info without sensitive data
    const accountInfo = {
      id: account._id,
      metaAccountId: account.metaAccountId,
      accountName: account.accountName,
      currency: account.currency,
      timezone: account.timezone,
      isActive: account.isActive,
      permissions: account.permissions,
      lastSyncAt: account.lastSyncAt,
      createdAt: account.createdAt
    };

    return NextResponse.json({ account: accountInfo });
  } catch (error) {
    console.error('Error fetching Meta Ads account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const account = await MetaAdsAccount.findOne({ vendorId });
    if (!account) {
      return NextResponse.json({ error: 'Meta Ads account not found' }, { status: 404 });
    }

    // Deactivate account instead of deleting
    account.isActive = false;
    await account.save();

    return NextResponse.json({ message: 'Meta Ads account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting Meta Ads account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
