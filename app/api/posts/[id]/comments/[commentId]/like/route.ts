import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { getServerSession } from '@/lib/auth-utils';

// POST /api/posts/[id]/comments/[commentId]/like - Like/unlike a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { id, commentId } = params;
    const { userId } = await request.json();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Toggle like
    const isLiked = comment.likedBy.includes(userId);
    
    if (isLiked) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await post.save();

    return NextResponse.json({
      success: true,
      data: {
        likes: comment.likes,
        isLiked: !isLiked
      }
    });

  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}


