import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Story, User } from '@/lib/models';
import { getUserFromRequest, getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { MongoQuery } from '@/lib/types/mongodb-queries';
import { PostSearchCriteria } from '@/lib/types/search-criteria';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const authUser = getUserFromRequest(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const groupId = searchParams.get('groupId');
    const authorType = searchParams.get('authorType');

    console.log('📊 Fetching stories...');

    // Build query
    const query: MongoQuery<PostSearchCriteria> = { 
      isActive: true,
      expiresAt: { $gt: new Date() } // Only non-expired stories
    };

    if (groupId) {
      query.groupId = groupId;
    }

    if (authorType) {
      query['author.type'] = authorType;
    }

    // Role-based filtering
    if (authUser && authUser.role === 'user') {
      // Users can see stories from vendors and other users
      query['author.type'] = { $in: ['user', 'vendor'] };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [stories, total] = await Promise.all([
      Story.find(query)
        .populate('author.id', 'name avatar verified')
        .populate('groupId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Story.countDocuments(query)
    ]);

    console.log(`✅ Found ${stories.length} stories`);

    return NextResponse.json({
      success: true,
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching stories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stories',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const storyData = await request.json();
    
    console.log('📝 Creating story...');

    // Validate required fields
    if (!storyData.content || !storyData.content.url) {
      return NextResponse.json({
        success: false,
        error: 'Content URL is required'
      }, { status: 400 });
    }

    // Create story
    const newStory = new Story({
      author: {
        type: authUser.role || 'user',
        id: authUser.id,
        name: authUser.name || 'Unknown User',
        avatar: (authUser as { image?: string }).image || undefined,
        verified: false
      },
      content: {
        type: storyData.content.type || 'image',
        url: storyData.content.url,
        thumbnail: storyData.content.thumbnail,
        duration: storyData.content.duration,
        metadata: storyData.content.metadata
      },
      interactiveElements: storyData.interactiveElements || [],
      views: [],
      reactions: [],
      interactions: [],
      location: storyData.location,
      tags: storyData.tags || [],
      groupId: storyData.groupId,
      isHighlight: storyData.isHighlight || false,
      highlightTitle: storyData.highlightTitle,
      highlightCover: storyData.highlightCover,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true
    });

    await newStory.save();

    // Populate the response
    const populatedStory = await Story.findById(newStory._id)
      .populate('author.id', 'name avatar verified')
      .populate('groupId', 'name avatar')
      .lean();

    console.log('✅ Story created successfully:', newStory._id);

    return NextResponse.json({
      success: true,
      story: populatedStory,
      message: 'Story created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating story:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create story',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
