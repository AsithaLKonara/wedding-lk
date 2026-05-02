import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedPost, User, Vendor } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const authUser = getUserFromRequest(request);

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query based on filter
    let query: any = { isActive: true };

    if (filter === 'trending') {
      query['engagement.views'] = { $gt: 10 };
    } else if (filter === 'nearby') {
      // Logic for nearby posts would go here
    } else if (filter === 'following' && authUser) {
      // Logic for following posts
    }

    const skip = (page - 1) * limit;

    let posts = await EnhancedPost.find(query)
      .sort({ 'boost.isBoosted': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // If no posts found and it's the first page, seed some sample posts
    if (posts.length === 0 && page === 1) {
      console.log('🌱 No enhanced posts found, seeding samples...');
      await seedSamplePosts();
      posts = await EnhancedPost.find(query)
        .sort({ 'boost.isBoosted': -1, createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        total: await EnhancedPost.countDocuments(query),
        page,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching enhanced posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts'
    }, { status: 500 });
  }
}

async function seedSamplePosts() {
  try {
    const users = await User.find().limit(2);
    const vendors = await Vendor.find().limit(2);

    if (users.length === 0) return;

    const samplePosts = [
      {
        content: "Just started planning our December wedding in Colombo! Any tips for venue selection? #weddingplanning #colombo",
        author: {
          type: 'user',
          id: users[0]._id,
          name: users[0].name,
          avatar: users[0].avatar,
          verified: false,
          role: 'user'
        },
        media: [{
          type: 'image',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
        }],
        engagement: {
          reactions: { like: 12, love: 5, wow: 2, laugh: 0, angry: 0, sad: 0 },
          comments: 3,
          shares: 2,
          views: 150,
          bookmarks: 5
        },
        tags: ['weddingplanning', 'colombo'],
        isActive: true
      },
      {
        content: "New wedding portfolio update! Captured some beautiful moments at the Galle Face Hotel last weekend. #weddingphotography #srilanka",
        author: {
          type: 'vendor',
          id: vendors[0]?._id || users[0]._id,
          name: vendors[0]?.name || 'Premium Photographer',
          avatar: vendors[0]?.avatar,
          verified: true,
          role: 'vendor'
        },
        media: [{
          type: 'image',
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
        }],
        engagement: {
          reactions: { like: 45, love: 20, wow: 10, laugh: 0, angry: 0, sad: 0 },
          comments: 8,
          shares: 15,
          views: 1200,
          bookmarks: 25
        },
        boost: {
          isBoosted: true,
          boostType: 'featured'
        },
        tags: ['weddingphotography', 'srilanka'],
        isActive: true
      }
    ];

    await EnhancedPost.insertMany(samplePosts);
    console.log('✅ Sample enhanced posts seeded successfully');
  } catch (error) {
    console.error('Error seeding sample posts:', error);
  }
}
