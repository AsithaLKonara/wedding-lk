import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedPost } from '@/lib/models';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { action, reactionType } = await request.json();

    console.log(`Interacting with post ${id}: ${action} ${reactionType || ''}`);

    const post = await EnhancedPost.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update engagement metrics (simplified)
    if (action === 'share') {
      post.engagement.shares += 1;
    } else if (action === 'bookmark') {
      post.engagement.bookmarks += 1;
    } else if (reactionType) {
      const currentReactions = post.engagement.reactions as any;
      currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
    }

    await post.save();

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Error handling interaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process interaction'
    }, { status: 500 });
  }
}
