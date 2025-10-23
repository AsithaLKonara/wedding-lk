import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment, EnhancedPost } from '@/lib/models';

export async function GET(
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

    const commentId = params.id;

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
    const commentWithInteractions = {
      ...comment,
      userInteractions: {
        isLiked: token ?.user?.id ? comment.likes.some(like => 
          like.user._id.toString() === session.user.id
        ) : false,
        isDisliked: token ?.user?.id ? comment.dislikes.some(dislike => 
          dislike.user._id.toString() === session.user.id
        ) : false,
        canEdit: token ?.user?.id ? (
          comment.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
        ) : false,
        canDelete: token ?.user?.id ? (
          comment.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
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
    const canEdit = comment.author.id.toString() === session.user.id || 
                   session.user.role === 'admin';

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
    const canDelete = comment.author.id.toString() === session.user.id || 
                     session.user.role === 'admin';

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
      deletedBy: session.user.id,
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
