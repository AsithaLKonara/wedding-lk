import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching user profile from MongoDB Atlas...');

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        preferences: user.preferences,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = await request.json();
    
    console.log('📝 Updating user profile...');

    // Update user profile
    Object.assign(user, updateData);
    user.updatedAt = new Date();
    await user.save();

    console.log('✅ User profile updated successfully');

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        preferences: user.preferences,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
