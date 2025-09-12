import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { getServerSession } from '@/lib/auth-utils';

// GET /api/posts/stats - Get post statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const vendor = searchParams.get('vendor') === 'true';
    const userId = session.user.id;

    let matchQuery: any = {};
    
    if (vendor) {
      // Get posts by vendor
      matchQuery = {
        'author.type': 'vendor',
        'author.id': userId
      };
    } else {
      // Get posts by user
      matchQuery = {
        'author.type': 'user',
        'author.id': userId
      };
    }

    const stats = await Post.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$engagement.likes' },
          totalComments: { $sum: '$engagement.comments' },
          totalShares: { $sum: '$engagement.shares' },
          totalViews: { $sum: '$engagement.views' },
          avgLikes: { $avg: '$engagement.likes' },
          avgComments: { $avg: '$engagement.comments' },
          avgViews: { $avg: '$engagement.views' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPosts: 1,
          totalLikes: 1,
          totalComments: 1,
          totalShares: 1,
          totalViews: 1,
          avgEngagement: {
            $multiply: [
              {
                $add: [
                  { $divide: ['$avgLikes', 10] },
                  { $divide: ['$avgComments', 5] },
                  { $divide: ['$avgViews', 100] }
                ]
              },
              100
            ]
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalViews: 0,
      avgEngagement: 0
    };

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching post stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post statistics' },
      { status: 500 }
    );
  }
}


