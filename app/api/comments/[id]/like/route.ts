import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment } from '@/lib/models';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!token?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const commentId = params.id;
    const { action } = await request.json(); // 'like' or 'dislike'

    console.log(`📝 ${action} comment:`, commentId);

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    const userId = session.user.id;
    let updatedComment;

    if (action === 'like') {
      // Check if user already liked
      const alreadyLiked = comment.likes.some(like => 
        like.user.toString() === userId
      );
      
      if (alreadyLiked) {
        // Unlike
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          {
            $pull: { likes: { user: userId } },
            $pull: { dislikes: { user: userId } } // Remove from dislikes if present
          },
          { new: true }
        );
      } else {
        // Like
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          {
            $addToSet: { likes: { user: userId, likedAt: new Date() } },
            $pull: { dislikes: { user: userId } } // Remove from dislikes if present
          },
          { new: true }
        );
      }
    } else if (action === 'dislike') {
      // Check if user already disliked
      const alreadyDisliked = comment.dislikes.some(dislike => 
        dislike.user.toString() === userId
      );
      
      if (alreadyDisliked) {
        // Remove dislike
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          {
            $pull: { dislikes: { user: userId } },
            $pull: { likes: { user: userId } } // Remove from likes if present
          },
          { new: true }
        );
      } else {
        // Dislike
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          {
            $addToSet: { dislikes: { user: userId, dislikedAt: new Date() } },
            $pull: { likes: { user: userId } } // Remove from likes if present
          },
          { new: true }
        );
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action. Use "like" or "dislike"'
      }, { status: 400 });
    }

    // Populate the response
    const populatedComment = await Comment.findById(commentId)
      .populate('author.id', 'name avatar verified')
      .populate('likes.user', 'name avatar')
      .populate('mentions.user', 'name username')
      .lean();

    // Add user interaction data
    const commentWithInteractions = {
      ...populatedComment,
      userInteractions: {
        isLiked: populatedComment.likes.some(like => 
          like.user._id.toString() === userId
        ),
        isDisliked: populatedComment.dislikes.some(dislike => 
          dislike.user._id.toString() === userId
        )
      }
    };

    console.log(`✅ Comment ${action} successful`);

    return NextResponse.json({
      success: true,
      comment: commentWithInteractions,
      message: `Comment ${action} successful`
    });

  } catch (error) {
    console.error(`❌ Error ${action} comment:`, error);
    return NextResponse.json({
      success: false,
      error: `Failed to ${action} comment`,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
