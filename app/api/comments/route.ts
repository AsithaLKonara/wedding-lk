import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment, EnhancedPost } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const parentCommentId = searchParams.get('parentCommentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required'
      }, { status: 400 });
    }

    console.log('📊 Fetching comments for post:', postId);

    // Build query
    let query: any = { 
      postId, 
      isActive: true,
      isDeleted: false
    };

    if (parentCommentId) {
      query.parentComment = parentCommentId;
    } else {
      query.parentComment = { $exists: false }; // Only top-level comments
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate('author.id', 'name avatar verified')
        .populate('replies')
        .populate('likes.user', 'name avatar')
        .populate('mentions.user', 'name username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query)
    ]);

    // Add user interaction data
    const commentsWithInteractions = comments.map(comment => ({
      ...comment,
      userInteractions: {
        isLiked: session?.user?.id ? comment.likes.some(like => 
          like.user._id.toString() === session.user.id
        ) : false,
        isDisliked: session?.user?.id ? comment.dislikes.some(dislike => 
          dislike.user._id.toString() === session.user.id
        ) : false,
        canEdit: session?.user?.id ? (
          comment.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
        ) : false,
        canDelete: session?.user?.id ? (
          comment.author.id._id.toString() === session.user.id || 
          session.user.role === 'admin'
        ) : false
      }
    }));

    console.log(`✅ Found ${comments.length} comments`);

    return NextResponse.json({
      success: true,
      comments: commentsWithInteractions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch comments',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const commentData = await request.json();
    
    console.log('📝 Creating comment...');

    // Validate required fields
    if (!commentData.postId || !commentData.content) {
      return NextResponse.json({
        success: false,
        error: 'Post ID and content are required'
      }, { status: 400 });
    }

    // Check if post exists
    const post = await EnhancedPost.findById(commentData.postId);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Extract mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(commentData.content)) !== null) {
      // TODO: Find user by username and add to mentions
      mentions.push({
        user: match[1], // This should be the actual user ID
        username: match[1]
      });
    }

    // Create comment
    const newComment = new Comment({
      postId: commentData.postId,
      author: {
        type: session.user.role || 'user',
        id: session.user.id,
        name: session.user.name || 'Unknown User',
        avatar: session.user.image,
        verified: session.user.verified || false
      },
      content: commentData.content,
      parentComment: commentData.parentComment,
      mentions,
      isActive: true
    });

    await newComment.save();

    // Update parent comment's replies array if this is a reply
    if (commentData.parentComment) {
      await Comment.findByIdAndUpdate(commentData.parentComment, {
        $push: { replies: newComment._id }
      });
    }

    // Update post's comment count
    await EnhancedPost.findByIdAndUpdate(commentData.postId, {
      $inc: { 'engagement.comments': 1 }
    });

    // Populate the response
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author.id', 'name avatar verified')
      .populate('likes.user', 'name avatar')
      .populate('mentions.user', 'name username')
      .lean();

    console.log('✅ Comment created successfully:', newComment._id);

    return NextResponse.json({
      success: true,
      comment: populatedComment,
      message: 'Comment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating comment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
