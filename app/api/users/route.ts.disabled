import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/users - Get users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can access user data
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const userType = searchParams.get('userType')
    const isVerified = searchParams.get('isVerified')
    const userId = searchParams.get('userId')

    await connectDB()

    // Dynamically import the User model
    const { User } = await import('@/lib/models/user')

    // If specific user ID is requested
    if (userId) {
      const user = await User.findById(userId).select('-password')
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        user,
      })
    }

    // Build query
    const query: any = {}

    if (userType) {
      query.userType = userType
    }

    if (isVerified !== null) {
      query.isVerified = isVerified === 'true'
    }

    // Get users with pagination (exclude passwords)
    const users = await User.find(query)
      .select('-password -twoFactorSecret -verificationToken')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)

    const total = await User.countDocuments(query)

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
      weddingDate,
      preferences,
    } = body

    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the User model
    const { User } = await import('@/lib/models/user')

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    // Hash password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      userType,
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      preferences,
      isVerified: true, // Admin-created users are verified by default
    })

    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, ...updateData } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the User model
    const { User } = await import('@/lib/models/user')

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.hash(updateData.password, 12)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -twoFactorSecret -verificationToken')

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the User model
    const { User } = await import('@/lib/models/user')

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    await User.findByIdAndDelete(userId)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// PATCH /api/users - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, ...updates } = body

    if (!email) {
      return NextResponse.json({
        error: 'Email is required to update user profile',
      }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the User model
    const { User } = await import('@/lib/models/user')

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({
        error: 'User not found',
      }, { status: 404 })
    }

    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true }
    ).select('-password -twoFactorSecret -verificationToken')

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User profile updated successfully',
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({
      error: 'Failed to update user profile',
    }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
