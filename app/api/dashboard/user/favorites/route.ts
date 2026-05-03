import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID
    const userId = authUser.id

    // Get user with favorites
    const dbUser = await User.findById(userId)
      .populate('favorites.vendors', 'businessName category description location rating')
      .populate('favorites.venues', 'name location description capacity pricing');
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const vendors = (dbUser as any).favorites?.vendors || [];
    const venues = (dbUser as any).favorites?.venues || [];

    return NextResponse.json({ 
      success: true,
      favorites: {
        vendors,
        venues
      }
    })

  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch user favorites" },
      { status: 500 }
    )
  }
} 