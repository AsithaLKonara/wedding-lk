import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedPost } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const postId = params.id;

    console.log('📊 Fetching post:', postId);

    const post = await EnhancedPost.findById(postId)
      .populate('author.id', 'name avatar verified')
      .populate('groupId', 'name avatar')
      .populate('eventId', 'title date')
      .lean();

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Add user interaction data
    const postWithInteractions = {
      ...post,
      userInteractions: {
        reactions: post.userInteractions.reactions || [],
        isBookmarked: post.userInteractions.isBookmarked || false,
        isShared: post.userInteractions.isShared || false,
        canEdit: session?.user?.id ? (
          post.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
        ) : false,
        canDelete: session?.user?.id ? (
          post.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
        ) : false
      }
    };

    console.log('✅ Post fetched successfully');

    return NextResponse.json({
      success: true,
      post: postWithInteractions
    });

  } catch (error) {
    console.error('❌ Error fetching post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch post',
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const postId = params.id;
    const updateData = await request.json();

    console.log('📝 Updating post:', postId);

    // Find post
    const post = await EnhancedPost.findById(postId);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Check permissions
    const canEdit = post.author.id.toString() === session.user.id || 
                   session.user.role === 'admin';

    if (!canEdit) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to edit this post'
      }, { status: 403 });
    }

    // Update post
    const updatedPost = await EnhancedPost.findByIdAndUpdate(
      postId,
      {
        content: updateData.content,
        media: updateData.media,
        tags: updateData.tags,
        location: updateData.location,
        visibility: updateData.visibility,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('author.id', 'name avatar verified')
      .populate('groupId', 'name avatar')
      .populate('eventId', 'title date')
      .lean();

    console.log('✅ Post updated successfully');

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update post',
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const postId = params.id;

    console.log('📝 Deleting post:', postId);

    // Find post
    const post = await EnhancedPost.findById(postId);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Check permissions
    const canDelete = post.author.id.toString() === session.user.id || 
                     session.user.role === 'admin';

    if (!canDelete) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to delete this post'
      }, { status: 403 });
    }

    // Soft delete post
    await EnhancedPost.findByIdAndUpdate(postId, {
      isActive: false,
      updatedAt: new Date()
    });

    console.log('✅ Post deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
