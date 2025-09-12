import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { User, Vendor, Venue } from '@/lib/models';
import { getServerSession } from '@/lib/auth-utils';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(500, 'Comment too long'),
  authorId: z.string().min(1, 'Author ID is required'),
});

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get comments with author details
    const comments = await Post.aggregate([
      { $match: { _id: post._id } },
      { $unwind: '$comments' },
      { $replaceRoot: { newRoot: '$comments' } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author.id',
          foreignField: '_id',
          as: 'authorDetails'
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'author.id',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'author.id',
          foreignField: '_id',
          as: 'venueDetails'
        }
      },
      {
        $addFields: {
          author: {
            $cond: {
              if: { $gt: [{ $size: '$authorDetails' }, 0] },
              then: {
                id: '$author.id',
                name: { $arrayElemAt: ['$authorDetails.name', 0] },
                avatar: { $arrayElemAt: ['$authorDetails.avatar', 0] },
                verified: { $arrayElemAt: ['$authorDetails.isVerified', 0] }
              },
              else: {
                $cond: {
                  if: { $gt: [{ $size: '$vendorDetails' }, 0] },
                  then: {
                    id: '$author.id',
                    name: { $arrayElemAt: ['$vendorDetails.businessName', 0] },
                    avatar: { $arrayElemAt: ['$vendorDetails.avatar', 0] },
                    verified: { $arrayElemAt: ['$vendorDetails.isVerified', 0] }
                  },
                  else: {
                    id: '$author.id',
                    name: { $arrayElemAt: ['$venueDetails.name', 0] },
                    avatar: { $arrayElemAt: ['$venueDetails.avatar', 0] },
                    verified: { $arrayElemAt: ['$venueDetails.isVerified', 0] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          content: 1,
          author: 1,
          likes: 1,
          isLiked: { $in: ['$author.id', '$likedBy'] },
          replies: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const validation = commentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { content, authorId } = validation.data;

    // Verify the post exists
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get author details
    let author;
    const user = await User.findById(authorId);
    if (user) {
      author = {
        type: 'user',
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        verified: user.isVerified || false
      };
    } else {
      const vendor = await Vendor.findById(authorId);
      if (vendor) {
        author = {
          type: 'vendor',
          id: vendor._id,
          name: vendor.businessName,
          avatar: vendor.avatar,
          verified: vendor.isVerified || false
        };
      } else {
        const venue = await Venue.findById(authorId);
        if (venue) {
          author = {
            type: 'venue',
            id: venue._id,
            name: venue.name,
            avatar: venue.avatar,
            verified: venue.isVerified || false
          };
        } else {
          return NextResponse.json(
            { error: 'Author not found' },
            { status: 404 }
          );
        }
      }
    }

    // Create comment
    const comment = {
      _id: new Date().getTime().toString(), // Simple ID for now
      content,
      author,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add comment to post
    post.comments.push(comment);
    post.engagement.comments += 1;
    
    await post.save();

    return NextResponse.json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}


