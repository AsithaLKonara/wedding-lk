import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const filter = searchParams.get('filter') || 'all';
    const authorType = searchParams.get('authorType') || 'all';
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { 
      status: 'active', 
      isActive: true 
    };

    // Apply filters
    if (authorType !== 'all') {
      query['author.type'] = authorType;
    }

    // Build sort criteria
    let sortCriteria: any = { createdAt: -1 };
    
    switch (filter) {
      case 'trending':
        sortCriteria = { 
          'engagement.likes': -1, 
          'engagement.comments': -1, 
          createdAt: -1 
        };
        break;
      case 'recent':
        sortCriteria = { createdAt: -1 };
        break;
      case 'liked':
        sortCriteria = { 'engagement.likes': -1, createdAt: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Get posts with pagination
    const posts = await Post.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Post.countDocuments(query);

    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      images: post.images || [],
      tags: post.tags || [],
      author: {
        type: post.author.type,
        id: post.author.id.toString(),
        name: post.author.name,
        avatar: post.author.avatar,
        verified: post.author.verified || false,
      },
      location: post.location,
      engagement: {
        likes: post.engagement.likes,
        comments: post.engagement.comments,
        shares: post.engagement.shares,
        views: post.engagement.views,
      },
      createdAt: post.createdAt,
      formattedDate: getFormattedDate(post.createdAt),
    }));

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

    // Validate author exists
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
      isVerified: false,
    });

    await newPost.save();

    console.log(`✅ New post created by ${authorType}: ${authorId}`);

    return NextResponse.json({
      success: true,
      data: {
        id: newPost._id.toString(),
        content: newPost.content,
        images: newPost.images,
        tags: newPost.tags,
        author: {
          type: newPost.author.type,
          id: newPost.author.id.toString(),
          name: newPost.author.name,
          avatar: newPost.author.avatar,
          verified: newPost.author.verified,
        },
        location: newPost.location,
        engagement: newPost.engagement,
        createdAt: newPost.createdAt,
        formattedDate: getFormattedDate(newPost.createdAt),
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
