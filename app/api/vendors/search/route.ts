import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models/vendor';

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
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');

    await connectDB();

    let query: any = {};

    // Text search
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { services: { $in: [new RegExp(search, 'i')] } }
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

    // Rating filter
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Verified filter
    if (verified === 'true') {
      query.verificationStatus = 'verified';
    }

    const vendors = await Vendor.find(query)
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Vendor.countDocuments(query);

    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error searching vendors:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search vendors'
    }, { status: 500 });
  }
}