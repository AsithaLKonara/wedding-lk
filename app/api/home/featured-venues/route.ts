import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/venue';

export async function GET() {
  try {
    await connectDB();

    const venues = await Venue.find({ featured: true })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      venues
    });

  } catch (error) {
    console.error('Error fetching featured venues:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured venues'
    }, { status: 500 });
  }
}