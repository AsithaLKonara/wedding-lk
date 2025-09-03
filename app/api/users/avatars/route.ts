import { NextRequest, NextResponse } from "next/server"
import { UserAvatarService } from "@/lib/services/user-avatar-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (userId) {
      // Get single user by ID
      const user = await UserAvatarService.getUserById(userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    if (email) {
      // Get single user by email
      const user = await UserAvatarService.getUserByEmail(email)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    // Get all users for bulk avatar loading
    const users = await UserAvatarService.getAllUsers()
    return NextResponse.json({ users: users.slice(0, limit) })

  } catch (error) {
    console.error('Error fetching user avatars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user avatars' },
      { status: 500 }
    )
  }
} 