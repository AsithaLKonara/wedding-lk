import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment, EnhancedPost } from '@/lib/models';
import { getUserFromRequest, getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { MongoQuery } from '@/lib/types/mongodb-queries';
import { CommentSearchCriteria } from '@/lib/types/search-criteria';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);

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
    const query: MongoQuery<CommentSearchCriteria> = { 
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
    const commentsWithInteractions = comments.map((comment: unknown) => {
      const c = comment as {
        _id: unknown;
        likes?: Array<{ user: { _id: { toString: () => string } } }>;
        dislikes?: Array<{ user: { _id: { toString: () => string } } }>;
        author: { id: { _id: { toString: () => string } } };
      };
      return {
        ...c,
        userInteractions: {
          isLiked: user ? (c.likes || []).some((like: { user: { _id: { toString: () => string } } }) => 
            like.user._id.toString() === user.id
          ) : false,
          isDisliked: user ? (c.dislikes || []).some((dislike: { user: { _id: { toString: () => string } } }) => 
            dislike.user._id.toString() === user.id
          ) : false,
          canEdit: user ? (
            c.author.id._id.toString() === user.id || 
            user.role === 'admin'
          ) : false,
          canDelete: user ? (
            c.author.id._id.toString() === user.id || 
            user.role === 'admin'
          ) : false
        }
      };
    });

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
    
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
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
        type: user.role || 'user',
        id: user.id,
        name: user.name || 'Unknown User',
        avatar: undefined, // User object doesn't have image in AuthUser
        verified: false
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
