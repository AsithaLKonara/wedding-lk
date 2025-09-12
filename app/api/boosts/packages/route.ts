import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BoostPackage } from '@/lib/models/boostPackage';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    // Get packages with pagination
    const packages = await BoostPackage.find(query)
      .sort({ price: 1 })
      .skip(offset)
      .limit(limit);

    // Get total count
    const total = await BoostPackage.countDocuments(query);

    // Get type counts
    const typeCounts = await BoostPackage.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeSummary = typeCounts.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: packages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      summary: {
        typeCounts: typeSummary
      }
    });

  } catch (error) {
    console.error('Boost packages fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch boost packages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('@/lib/auth-utils');
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user is admin
    const { User } = await import('@/lib/models/user');
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      type,
      price,
      currency = 'LKR',
      duration,
      features = [],
      maxImpressions
    } = body;

    // Validate required fields
    if (!name || !description || !type || !price || !duration) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate type
    if (!['featured', 'premium', 'sponsored'].includes(type)) {
      return NextResponse.json({
        error: 'Invalid package type'
      }, { status: 400 });
    }

    // Validate price
    if (price <= 0) {
      return NextResponse.json({
        error: 'Price must be greater than 0'
      }, { status: 400 });
    }

    // Validate duration
    if (duration < 1 || duration > 365) {
      return NextResponse.json({
        error: 'Duration must be between 1 and 365 days'
      }, { status: 400 });
    }

    // Create boost package
    const boostPackage = new BoostPackage({
      name,
      description,
      type,
      price,
      currency,
      duration,
      features,
      maxImpressions,
      isActive: true
    });

    await boostPackage.save();

    return NextResponse.json({
      success: true,
      data: boostPackage,
      message: 'Boost package created successfully'
    });

  } catch (error) {
    console.error('Boost package creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create boost package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}



