import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { getServerSession } from '@/lib/auth-utils';

// DELETE /api/posts/[id]/comments/[commentId] - Delete a comment
export async function DELETE(
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

    // Check if user is the author of the comment
    if (comment.author.id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this comment' },
        { status: 403 }
      );
    }

    // Remove comment
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    post.engagement.comments = Math.max(0, post.engagement.comments - 1);
    
    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}


