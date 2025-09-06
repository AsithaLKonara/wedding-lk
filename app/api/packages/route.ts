import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Package } from '@/lib/models/package';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    await connectDB();

    let query: any = {};
    if (featured) {
      query.featured = true;
    }

    const packages = await Package.find(query)
      .populate('venues', 'name rating images')
      .populate('vendors', 'businessName category rating')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Package.countDocuments(query);

    return NextResponse.json({
      success: true,
      packages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, originalPrice, features, venues, vendors, featured } = await request.json();

    if (!name || !description || !price) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectDB();

    const packageData = new Package({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      features: features || [],
      venues: venues || [],
      vendors: vendors || [],
      featured: featured || false,
      rating: {
        average: 0,
        count: 0
      }
    });

    await packageData.save();

    return NextResponse.json({
      success: true,
      package: packageData
    });

  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create package'
    }, { status: 500 });
  }
}