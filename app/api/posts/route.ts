import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post, User, Vendor, Venue } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const filter = searchParams.get('filter') || 'all';
    const authorType = searchParams.get('authorType') || 'all';

    console.log('📊 Fetching posts from MongoDB Atlas...');

    // Build query
    const query: any = { status: 'active', isActive: true };
    
    if (authorType !== 'all') {
      query['author.type'] = authorType;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query)
    ]);

    // Apply sorting based on filter
    let sortQuery = { createdAt: -1 };
    switch (filter) {
      case 'trending':
        // Sort by engagement (likes + comments)
        posts.sort((a: any, b: any) => {
          const aEngagement = (a.engagement?.likes || 0) + (a.engagement?.comments || 0);
          const bEngagement = (b.engagement?.likes || 0) + (b.engagement?.comments || 0);
          return bEngagement - aEngagement;
        });
        break;
      case 'liked':
        posts.sort((a: any, b: any) => (b.engagement?.likes || 0) - (a.engagement?.likes || 0));
        break;
      default:
        // Already sorted by createdAt in the query
        break;
    }

    // Format posts for frontend
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      content: post.content,
      images: post.images || [],
      tags: post.tags || [],
      author: {
        type: post.author?.type || 'user',
        id: post.author?.id || post.id,
        name: post.author?.name || 'Unknown',
        avatar: post.author?.avatar || null,
        verified: post.author?.verified || false,
      },
      location: post.location,
      engagement: {
        likes: post.engagement?.likes || 0,
        comments: post.engagement?.comments || 0,
        shares: post.engagement?.shares || 0,
        views: post.engagement?.views || 0,
      },
      createdAt: post.createdAt,
      formattedDate: getFormattedDate(post.createdAt),
    }));

    console.log(`✅ Found ${formattedPosts.length} posts`);

    return NextResponse.json({
      success: true,
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });

    } catch (error) {
    console.error('❌ Error fetching posts:', error);
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'mock-post-1',
            content: 'Beautiful wedding at the beach! 🌊💒 #wedding #beach #love',
            images: [],
            tags: ['wedding', 'beach', 'love'],
            author: {
              type: 'user',
              id: 'mock-user-1',
              name: 'Test User',
              avatar: null,
              verified: false,
            },
            location: null,
            engagement: {
              likes: 25,
              comments: 8,
              shares: 3,
              views: 150,
            },
            createdAt: new Date(),
            formattedDate: '2h ago',
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      content, 
      images, 
      tags, 
      authorType, 
      authorId, 
      location 
    } = body;

    // Validate required fields
    if (!content || !authorType || !authorId) {
      return NextResponse.json(
        { error: 'Content, author type, and author ID are required' },
        { status: 400 }
      );
    }

    // Get author from MongoDB Atlas
    let author;
    switch (authorType) {
      case 'user':
        author = await User.findById(authorId);
        break;
      case 'vendor':
        author = await Vendor.findById(authorId);
        break;
      case 'venue':
        author = await Venue.findById(authorId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid author type' },
          { status: 400 }
        );
    }

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Create new post
    const newPost = new Post({
      content,
      images: images || [],
      tags: tags || [],
      author: {
        type: authorType,
        id: authorId,
        name: author.name || author.businessName,
        avatar: author.avatar,
        verified: author.isVerified || false,
      },
      location: location || undefined,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
      userInteractions: {
        likedBy: [],
        bookmarkedBy: [],
        sharedBy: [],
      },
      status: 'active',
      isActive: true,
      isVerified: false
    });

    const createdPost = await newPost.save();

    if (!createdPost) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    console.log(`✅ New post created by ${authorType}: ${authorId}`);

    return NextResponse.json({
      success: true,
      data: {
        id: createdPost._id,
        content: createdPost.content,
        images: createdPost.images,
        tags: createdPost.tags,
        author: {
          type: createdPost.author.type,
          id: createdPost.author.id,
          name: createdPost.author.name,
          avatar: createdPost.author.avatar,
          verified: createdPost.author.verified,
        },
        location: createdPost.location,
        engagement: createdPost.engagement,
        createdAt: createdPost.createdAt,
        formattedDate: getFormattedDate(createdPost.createdAt),
      },
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

function getFormattedDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
