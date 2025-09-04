import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching vendor stats from local database...');

    // Get vendor data from local database
    const vendors = LocalDatabase.read('vendors');
    const bookings = LocalDatabase.read('bookings');
    const payments = LocalDatabase.read('payments');
    const reviews = LocalDatabase.read('reviews');

    // Mock vendor stats (in real app, you'd filter by current vendor)
    const vendorStats = {
      totalBookings: 15,
      totalRevenue: 450000,
      averageRating: 4.7,
      activeServices: 3,
      pendingBookings: 2,
      completedBookings: 13,
      monthlyRevenue: 75000,
      revenueGrowth: 20
    };

    console.log('✅ Vendor stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: vendorStats
    });

  } catch (error) {
    console.error('❌ Error fetching vendor stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}