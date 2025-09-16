import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { withAdmin } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const { userId } = params;

    if (req.method === 'GET') {
      // Get user details
      const user = await User.findById(userId)
        .select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires');

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user
      });

    } else if (req.method === 'PATCH') {
      // Update user
      const { action, ...updateData } = await req.json();

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      switch (action) {
        case 'activate':
          user.status = 'active';
          user.isActive = true;
          break;
        case 'suspend':
          user.status = 'suspended';
          user.isActive = false;
          break;
        case 'verify':
          user.isEmailVerified = true;
          user.status = 'active';
          break;
        case 'unverify':
          user.isEmailVerified = false;
          break;
        case 'update':
          Object.assign(user, updateData);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: `User ${action} successful`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive
        }
      });

    } else if (req.method === 'DELETE') {
      // Delete user (soft delete)
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      user.status = 'suspended';
      user.isActive = false;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'User suspended successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Admin user management error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(handler);
export const PATCH = withAdmin(handler);
export const DELETE = withAdmin(handler);
