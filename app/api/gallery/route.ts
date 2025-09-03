import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || 'all';
    const venue = searchParams.get('venue') || 'all';
    const skip = (page - 1) * limit;

    // Build query for posts with images
    const query: any = { 
      status: 'active', 
      isActive: true,
      images: { $exists: true, $ne: [] } // Only posts with images
    };

    // Apply filters
    if (venue !== 'all') {
      query['location.name'] = new RegExp(venue, 'i');
    }

    // Build sort criteria
    const sortCriteria = { 
      'engagement.likes': -1, 
      'engagement.views': -1,
      createdAt: -1 
    };

    // Get posts with pagination
    const posts = await Post.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Post.countDocuments(query);

    // Format posts as gallery photos
    const galleryPhotos = posts.flatMap(post => 
      post.images?.map((image, index) => ({
        id: `${post._id}-${index}`,
        url: image,
        title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
        category: getCategoryFromTags(post.tags),
        venue: post.location?.name || 'Unknown Venue',
        venueId: post.location?.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
        photographer: post.author.name,
        photographerAvatar: post.author.avatar || getDefaultAvatar(post.author.name),
        date: post.createdAt.toISOString().split('T')[0],
        likes: post.engagement.likes,
        views: post.engagement.views,
        isLiked: false, // TODO: Check user interactions
        tags: post.tags || [],
        description: post.content,
        postId: post._id.toString(),
      })) || []
    );

    // Apply category filter
    const filteredPhotos = category === 'all' 
      ? galleryPhotos 
      : galleryPhotos.filter(photo => photo.category === category);

    return NextResponse.json({
      success: true,
      data: filteredPhotos,
      pagination: {
        page,
        limit,
        total: filteredPhotos.length,
        pages: Math.ceil(filteredPhotos.length / limit),
        hasNext: page < Math.ceil(filteredPhotos.length / limit),
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('❌ Error fetching gallery photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery photos' },
      { status: 500 }
    );
  }
}

function getCategoryFromTags(tags: string[] = []): string {
  const tagString = tags.join(' ').toLowerCase();
  
  if (tagString.includes('ceremony') || tagString.includes('traditional')) return 'ceremonies';
  if (tagString.includes('reception') || tagString.includes('party')) return 'receptions';
  if (tagString.includes('couple') || tagString.includes('portrait')) return 'couples';
  if (tagString.includes('decoration') || tagString.includes('flower')) return 'decorations';
  if (tagString.includes('venue') || tagString.includes('architecture')) return 'venues';
  if (tagString.includes('dance') || tagString.includes('cultural')) return 'traditional';
  
  return 'general';
}

function getDefaultAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`;
}
