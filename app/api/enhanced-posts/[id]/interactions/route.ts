import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedPost } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function POST(
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

    const { action, reactionType } = await request.json();
    const postId = params.id;

    console.log(`📝 Processing ${action} interaction for post ${postId}...`);

    // Find the post
    const post = await EnhancedPost.findById(postId);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    const userId = session.user.id;
    let updatedPost;

    switch (action) {
      case 'like':
        updatedPost = await handleLike(post, userId);
        break;
      case 'love':
        updatedPost = await handleReaction(post, userId, 'love');
        break;
      case 'wow':
        updatedPost = await handleReaction(post, userId, 'wow');
        break;
      case 'laugh':
        updatedPost = await handleReaction(post, userId, 'laugh');
        break;
      case 'angry':
        updatedPost = await handleReaction(post, userId, 'angry');
        break;
      case 'sad':
        updatedPost = await handleReaction(post, userId, 'sad');
        break;
      case 'bookmark':
        updatedPost = await handleBookmark(post, userId);
        break;
      case 'share':
        updatedPost = await handleShare(post, userId);
        break;
      case 'view':
        updatedPost = await handleView(post, userId);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

    console.log('✅ Interaction processed successfully');

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: `${action} interaction processed successfully`
    });

  } catch (error) {
    console.error('❌ Error processing interaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process interaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleLike(post: any, userId: string) {
  const isLiked = post.userInteractions.reactions.includes('like');
  
  if (isLiked) {
    // Unlike
    post.engagement.likes -= 1;
    post.userInteractions.reactions = post.userInteractions.reactions.filter(
      (r: string) => r !== 'like'
    );
  } else {
    // Like
    post.engagement.likes += 1;
    post.userInteractions.reactions.push('like');
  }

  await post.save();
  return post;
}

async function handleReaction(post: any, userId: string, reactionType: string) {
  const isReacted = post.userInteractions.reactions.includes(reactionType);
  
  if (isReacted) {
    // Remove reaction
    post.engagement.reactions[reactionType] -= 1;
    post.userInteractions.reactions = post.userInteractions.reactions.filter(
      (r: string) => r !== reactionType
    );
  } else {
    // Add reaction
    post.engagement.reactions[reactionType] += 1;
    post.userInteractions.reactions.push(reactionType);
  }

  await post.save();
  return post;
}

async function handleBookmark(post: any, userId: string) {
  const isBookmarked = post.userInteractions.isBookmarked;
  
  if (isBookmarked) {
    // Remove bookmark
    post.engagement.bookmarks -= 1;
    post.userInteractions.isBookmarked = false;
  } else {
    // Add bookmark
    post.engagement.bookmarks += 1;
    post.userInteractions.isBookmarked = true;
  }

  await post.save();
  return post;
}

async function handleShare(post: any, userId: string) {
  // Increment share count
  post.engagement.shares += 1;
  post.userInteractions.isShared = true;

  await post.save();
  return post;
}

async function handleView(post: any, userId: string) {
  // Increment view count
  post.engagement.views += 1;

  await post.save();
  return post;
}
