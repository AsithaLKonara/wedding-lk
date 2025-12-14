import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { verifyToken } from '@/lib/auth/custom-auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const user = verifyToken(token)
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()
    const userProfile = await User.findById(user.id).select('-password').lean()

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, user: userProfile })
  } catch (error) {
    console.error('[Users Profile] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    if (!user?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const updates = await request.json()
    await connectDB()

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password').lean()

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('[Users Profile] Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
