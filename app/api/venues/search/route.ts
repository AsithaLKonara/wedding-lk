import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/venue';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minCapacity = searchParams.get('minCapacity');
    const maxCapacity = searchParams.get('maxCapacity');
    const rating = searchParams.get('rating');

    await connectDB();

    let query: any = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Capacity filter
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }

    // Rating filter
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    const venues = await Venue.find(query)
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Venue.countDocuments(query);

    return NextResponse.json({
      success: true,
      venues,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error searching venues:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search venues'
    }, { status: 500 });
  }
}