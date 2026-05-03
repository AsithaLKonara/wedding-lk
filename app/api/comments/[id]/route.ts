import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment, EnhancedPost } from '@/lib/models';
import { getUserFromRequest, getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { PopulatedComment } from '@/lib/types/populated-documents';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const user = await getUserFromRequest(request);
    const { id: commentId } = await params;

    console.log('📊 Fetching comment:', commentId);

    const comment = await Comment.findById(commentId)
      .populate('author.id', 'name avatar verified')
      .populate('replies')
      .populate('likes.user', 'name avatar')
      .populate('mentions.user', 'name username')
      .lean();

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    // Add user interaction data
    const populatedComment = comment as unknown as PopulatedComment;
    const commentWithInteractions = {
      ...populatedComment,
      userInteractions: {
        isLiked: user ? (populatedComment.likes || []).some((like) => 
          (typeof like.user === 'object' && like.user && '_id' in like.user) 
            ? like.user._id?.toString() === user.id
            : like.user?.toString() === user.id
        ) : false,
        isDisliked: user ? (populatedComment.dislikes || []).some((dislike) => 
          (typeof dislike.user === 'object' && dislike.user && '_id' in dislike.user)
            ? dislike.user._id?.toString() === user.id
            : dislike.user?.toString() === user.id
        ) : false,
        canEdit: user ? (
          (populatedComment.author?.id && typeof populatedComment.author.id === 'object' && '_id' in populatedComment.author.id)
            ? populatedComment.author.id._id?.toString() === user.id
            : populatedComment.author?.id?.toString() === user.id || 
          user.role === 'admin'
        ) : false,
        canDelete: user ? (
          (populatedComment.author?.id && typeof populatedComment.author.id === 'object' && '_id' in populatedComment.author.id)
            ? populatedComment.author.id._id?.toString() === user.id
            : populatedComment.author?.id?.toString() === user.id || 
          user.role === 'admin'
        ) : false
      }
    };

    console.log('✅ Comment fetched successfully');

    return NextResponse.json({
      success: true,
      comment: commentWithInteractions
    });

  } catch (error) {
    console.error('❌ Error fetching comment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { id: commentId } = await params;
    const updateData = await request.json();

    console.log('📝 Updating comment:', commentId);

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    // Check permissions
    const canEdit = (comment.author as any).id.toString() === user.id || 
                   user.role === 'admin';

    if (!canEdit) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to edit this comment'
      }, { status: 403 });
    }

    // Extract mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(updateData.content)) !== null) {
      // TODO: Find user by username and add to mentions
      mentions.push({
        user: match[1], // This should be the actual user ID
        username: match[1]
      });
    }

    // Update comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content: updateData.content,
        mentions,
        isEdited: true,
        editedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('author.id', 'name avatar verified')
      .populate('likes.user', 'name avatar')
      .populate('mentions.user', 'name username')
      .lean();

    console.log('✅ Comment updated successfully');

    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: 'Comment updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating comment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { id: commentId } = await params;

    console.log('📝 Deleting comment:', commentId);

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    // Check permissions
    const canDelete = (comment.author as any).id.toString() === user.id || 
                     user.role === 'admin';

    if (!canDelete) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to delete this comment'
      }, { status: 403 });
    }

    // Soft delete comment
    await Comment.findByIdAndUpdate(commentId, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user.id,
      updatedAt: new Date()
    });

    // Update post's comment count
    await EnhancedPost.findByIdAndUpdate(comment.postId, {
      $inc: { 'engagement.comments': -1 }
    });

    // If this is a reply, remove from parent comment's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId }
      });
    }

    console.log('✅ Comment deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
