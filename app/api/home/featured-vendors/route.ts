import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models/vendor';
import { APIResponse } from '@/lib/api-optimization';

export async function GET() {
  try {
    await connectDB();

    const vendors = await Vendor.find({ featured: true })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .lean();

    return NextResponse.json(APIResponse.success({
      vendors
    }));

  } catch (error) {
    console.error('Error fetching featured vendors:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured vendors'
    }, { status: 500 });
  }
}