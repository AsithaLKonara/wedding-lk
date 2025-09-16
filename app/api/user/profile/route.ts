import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { withAuth } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get user profile
      const user = await User.findById(req.user?.id)
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
      // Update user profile
      const updateData = await req.json();
      const { name, phone, bio, city, state, country, gender } = updateData;

      const user = await User.findById(req.user?.id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update basic fields
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;

      // Update location
      if (city || state || country) {
        user.location = {
          city: city || user.location?.city || '',
          state: state || user.location?.state || '',
          country: country || user.location?.country || ''
        };
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          gender: user.gender,
          location: user.location,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Profile API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PATCH = withAuth(handler);
