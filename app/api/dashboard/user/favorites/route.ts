import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID
    const userId = authUser.id

    // Get user with favorites
    const dbUser = await User.findById(userId).populate('favorites')
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ favorites: (dbUser as any).favorites || [] })

  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch user favorites" },
      { status: 500 }
    )
  }
} 