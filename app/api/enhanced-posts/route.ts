import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedPost, Group } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const filter = searchParams.get('filter') || 'all';
    const groupId = searchParams.get('groupId');
    const authorType = searchParams.get('authorType');
    const tags = searchParams.get('tags')?.split(',');
    const location = searchParams.get('location');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('📊 Fetching enhanced posts...');

    // Build query based on user role and permissions
    let query: any = { isActive: true };

    // Role-based content filtering
    if (session?.user?.role) {
      const userRole = session.user.role;
      
      // Users can see public posts and posts from followed vendors
      if (userRole === 'user') {
        query.$or = [
          { 'visibility.type': 'public' },
          { 'visibility.type': 'followers' },
          { 'author.type': 'vendor' }
        ];
      }
      
      // Vendors can see all posts
      if (userRole === 'vendor') {
        query = { isActive: true };
      }
      
      // Admins can see all posts
      if (userRole === 'admin') {
        query = { isActive: true };
      }
    }

    // Apply filters
    if (filter === 'following' && session?.user?.id) {
      // TODO: Implement following logic
      query['author.type'] = 'vendor';
    }

    if (filter === 'trending') {
      // Posts with high engagement in last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: yesterday };
      query['engagement.likes'] = { $gte: 10 };
    }

    if (filter === 'nearby' && location) {
      // TODO: Implement location-based filtering
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    if (groupId) {
      query.groupId = groupId;
    }

    if (authorType) {
      query['author.type'] = authorType;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Exclude expired stories
    query.$or = [
      { isStory: false },
      { isStory: true, storyExpiresAt: { $gt: new Date() } }
    ];

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort criteria
    let sortCriteria: any = {};
    if (sortBy === 'engagement') {
      sortCriteria = { 'engagement.likes': -1, 'engagement.comments': -1, createdAt: -1 };
    } else if (sortBy === 'trending') {
      sortCriteria = { 'engagement.views': -1, 'engagement.likes': -1, createdAt: -1 };
    } else {
      sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query with pagination
    const [posts, total] = await Promise.all([
      EnhancedPost.find(query)
        .populate('author.id', 'name avatar verified')
        .populate('groupId', 'name avatar')
        .populate('eventId', 'title date')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .lean(),
      EnhancedPost.countDocuments(query)
    ]);

    console.log(`✅ Found ${posts.length} enhanced posts`);

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        applied: {
          filter,
          groupId,
          authorType,
          tags,
          location,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching enhanced posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const postData = await request.json();
    
    console.log('📝 Creating enhanced post...');

    // Validate required fields
    if (!postData.content && (!postData.media || postData.media.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'Content or media is required'
      }, { status: 400 });
    }

    // Create enhanced post
    const newPost = new EnhancedPost({
      content: postData.content || '',
      media: postData.media || [],
      author: {
        type: session.user.role || 'user',
        id: session.user.id,
        name: session.user.name || 'Unknown User',
        avatar: session.user.image,
        verified: session.user.verified || false,
        role: session.user.role || 'user'
      },
      engagement: {
        reactions: {
          like: 0,
          love: 0,
          wow: 0,
          laugh: 0,
          angry: 0,
          sad: 0
        },
        comments: 0,
        shares: 0,
        views: 0,
        bookmarks: 0
      },
      userInteractions: {
        reactions: [],
        isBookmarked: false,
        isShared: false
      },
      visibility: postData.visibility || { type: 'public' },
      boost: {
        isBoosted: false
      },
      tags: postData.tags || [],
      location: postData.location,
      groupId: postData.groupId,
      eventId: postData.eventId,
      isStory: postData.isStory || false,
      storyExpiresAt: postData.isStory ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
      isReel: postData.isReel || false,
      reelData: postData.reelData,
      isActive: true
    });

    await newPost.save();

    // Populate the response
    const populatedPost = await EnhancedPost.findById(newPost._id)
      .populate('author.id', 'name avatar verified')
      .populate('groupId', 'name avatar')
      .populate('eventId', 'title date')
      .lean();

    console.log('✅ Enhanced post created successfully:', newPost._id);

    return NextResponse.json({
      success: true,
      post: populatedPost,
      message: 'Post created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating enhanced post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
