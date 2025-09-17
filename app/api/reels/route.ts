import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Reel, User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const trending = searchParams.get('trending') === 'true';

    console.log('📊 Fetching reels...');

    // Build query
    let query: any = { 
      status: 'published'
    };

    if (category) {
      query.category = category;
    }

    if (trending) {
      query.isTrending = true;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [reels, total] = await Promise.all([
      Reel.find(query)
        .populate('author.id', 'name avatar verified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Reel.countDocuments(query)
    ]);

    console.log(`✅ Found ${reels.length} reels`);

    return NextResponse.json({
      success: true,
      reels,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching reels:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reels',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const reelData = await request.json();
    
    console.log('📝 Creating reel...');

    // Validate required fields
    if (!reelData.videoUrl || !reelData.author) {
      return NextResponse.json({
        success: false,
        error: 'Video URL and author are required'
      }, { status: 400 });
    }

    // Create reel
    const newReel = new Reel({
      ...reelData,
      isActive: true,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    });

    await newReel.save();

    // Populate the response
    const populatedReel = await Reel.findById(newReel._id)
      .populate('author', 'name avatar verified')
      .lean();

    console.log('✅ Reel created successfully:', newReel._id);

    return NextResponse.json({
      success: true,
      reel: populatedReel,
      message: 'Reel created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating reel:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create reel',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
