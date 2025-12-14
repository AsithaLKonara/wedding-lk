import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment } from '@/lib/models';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { IComment } from '@/lib/models/comment';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { id: commentId } = await params;
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

    const userId = user.id;

    if (action === 'like') {
      // Check if user already liked
      const alreadyLiked = comment.likes.some((like: { user: unknown }) => 
        (typeof like.user === 'object' && like.user && 'toString' in like.user)
          ? (like.user as { toString: () => string }).toString() === userId
          : String(like.user) === userId
      );
      
      if (alreadyLiked) {
        // Unlike
        await Comment.findByIdAndUpdate(
          commentId,
          {
            $pull: { 
              likes: { user: userId },
              dislikes: { user: userId } // Remove from dislikes if present
            }
          },
          { new: true }
        );
      } else {
        // Like
        await Comment.findByIdAndUpdate(
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
      const alreadyDisliked = comment.dislikes.some((dislike: { user: unknown }) => 
        (typeof dislike.user === 'object' && dislike.user && 'toString' in dislike.user)
          ? (dislike.user as { toString: () => string }).toString() === userId
          : String(dislike.user) === userId
      );
      
      if (alreadyDisliked) {
        // Remove dislike
        await Comment.findByIdAndUpdate(
          commentId,
          {
            $pull: { 
              dislikes: { user: userId },
              likes: { user: userId } // Remove from likes if present
            }
          },
          { new: true }
        );
      } else {
        // Dislike
        await Comment.findByIdAndUpdate(
          commentId,
          {
            $addToSet: { dislikes: { user: userId, dislikedAt: new Date() } },
            $pull: { likes: { user: userId } } // Remove from likes if present
          } as any, // Type assertion needed for mixed MongoDB operators
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

    if (!populatedComment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    // Add user interaction data
    const typedComment = populatedComment as {
      likes?: Array<{ user?: { _id?: { toString: () => string } } | string }>;
      dislikes?: Array<{ user?: { _id?: { toString: () => string } } | string }>;
    };
    const commentWithInteractions = {
      ...populatedComment,
      userInteractions: {
        isLiked: typedComment.likes?.some((like) => {
          if (typeof like.user === 'object' && like.user && '_id' in like.user) {
            return like.user._id?.toString() === userId;
          }
          return String(like.user) === userId;
        }) || false,
        isDisliked: typedComment.dislikes?.some((dislike) => {
          if (typeof dislike.user === 'object' && dislike.user && '_id' in dislike.user) {
            return dislike.user._id?.toString() === userId;
          }
          return String(dislike.user) === userId;
        }) || false
      }
    };

    const actionVerb = action === 'like' ? 'liked' : 'disliked';
    console.log(`✅ Comment ${actionVerb} successfully`);

    return NextResponse.json({
      success: true,
      comment: commentWithInteractions,
      message: `Comment ${actionVerb} successfully`
    });

  } catch (error) {
    console.error('❌ Error updating comment interaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update comment interaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
