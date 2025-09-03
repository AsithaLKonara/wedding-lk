import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { action, userId } = body;

    if (!action || !userId) {
      return NextResponse.json(
        { error: 'Action and userId are required' },
        { status: 400 }
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    let result;
    switch (action) {
      case 'like':
        result = post.toggleLike(userId);
        break;
      case 'bookmark':
        result = post.toggleBookmark(userId);
        break;
      case 'share':
        post.addShare(userId);
        result = true;
        break;
      case 'view':
        post.incrementViews();
        result = true;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await post.save();

    return NextResponse.json({
      success: true,
      data: {
        action,
        result,
        engagement: post.engagement,
        userInteractions: {
          isLiked: post.userInteractions.likedBy.includes(userId),
          isBookmarked: post.userInteractions.bookmarkedBy.includes(userId),
        },
      },
    });

  } catch (error) {
    console.error('❌ Error updating post interaction:', error);
    return NextResponse.json(
      { error: 'Failed to update interaction' },
      { status: 500 }
    );
  }
}
