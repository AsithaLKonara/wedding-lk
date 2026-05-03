import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/venue';
import { APIResponse } from '@/lib/api-optimization';

export async function GET() {
  try {
    await connectDB();

    const venues = await Venue.find({ featured: true })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .lean();

    return NextResponse.json(APIResponse.success({
      venues
    }));

  } catch (error) {
    console.error('Error fetching featured venues:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured venues'
    }, { status: 500 });
  }
}