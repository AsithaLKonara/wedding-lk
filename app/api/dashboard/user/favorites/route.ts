import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!token || session.user?.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID from session
    const userId = session.user.id

    // Get user with favorites
    const user = await User.findById(userId).populate('favorites')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ favorites: user.favorites || [] })

  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch user favorites" },
      { status: 500 }
    )
  }
} 