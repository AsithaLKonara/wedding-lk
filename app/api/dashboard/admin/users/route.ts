import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { VendorProfile } from '@/lib/models/vendorProfile';
import { WeddingPlannerProfile } from '@/lib/models/weddingPlannerProfile';
import { getServerSession } from '@/lib/auth-utils';

// GET - Fetch users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('verificationDocuments', 'title status'),
      User.countDocuments(query),
    ]);

    // Get role-specific profile counts
    const vendorCount = await User.countDocuments({ role: 'vendor' });
    const plannerCount = await User.countDocuments({ role: 'wedding_planner' });
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: { $in: ['admin', 'maintainer'] } });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: {
        total,
        vendorCount,
        plannerCount,
        userCount,
        adminCount,
      },
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new admin/maintainer user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { email, name, role, permissions } = body;

    // Validate role
    if (!['admin', 'maintainer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Only admin and maintainer roles can be created.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new admin/maintainer user
    const newUser = new User({
      email,
      name,
      role,
      status: 'active',
      isEmailVerified: true,
      roleVerified: true,
      roleVerifiedBy: session.user.id,
      roleVerifiedAt: new Date(),
      location: {
        country: 'Unknown',
        state: 'Unknown',
        city: 'Unknown',
      },
      preferences: {
        language: 'en',
        currency: 'USD',
        timezone: 'UTC',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        marketing: {
          email: false,
          sms: false,
          push: false,
        },
      },
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: `${role} user created successfully`,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// PUT - Update user role and status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from modifying other admins
    if (user.role === 'admin' && session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Cannot modify other admin users' },
        { status: 403 }
      );
    }

    // Update user
    const updateData: any = {};
    
    if (updates.role && updates.role !== user.role) {
      updateData.role = updates.role;
      updateData.roleVerified = true;
      updateData.roleVerifiedBy = session.user.id;
      updateData.roleVerifiedAt = new Date();
    }
    
    if (updates.status) {
      updateData.status = updates.status;
    }
    
    if (updates.isEmailVerified !== undefined) {
      updateData.isEmailVerified = updates.isEmailVerified;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      );
    }

    // Prevent admin from deleting other admins
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Soft delete - update status to suspended
    await User.findByIdAndUpdate(userId, {
      status: 'suspended',
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'User suspended successfully',
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 