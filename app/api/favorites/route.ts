import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getServerSession } from '@/lib/auth-utils';
import User from "@/lib/models/user"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    // Get user's favorites
    const user = await User.findById(session.user.id).populate('favorites.venues favorites.vendors')
    
    return NextResponse.json({
      success: true,
      favorites: {
        venues: user.favorites?.venues || [],
        vendors: user.favorites?.vendors || []
      }
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { type, itemId } = await request.json()
    
    if (!type || !itemId) {
      return NextResponse.json({ success: false, error: "Type and itemId are required" }, { status: 400 })
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Initialize favorites if not exists
    if (!user.favorites) {
      user.favorites = { venues: [], vendors: [] }
    }

    // Add to favorites
    if (type === 'venue' && !user.favorites.venues.includes(itemId)) {
      user.favorites.venues.push(itemId)
    } else if (type === 'vendor' && !user.favorites.vendors.includes(itemId)) {
      user.favorites.vendors.push(itemId)
    }

    await user.save()

    return NextResponse.json({ success: true, message: "Added to favorites" })
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return NextResponse.json({ success: false, error: "Failed to add to favorites" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { type, itemId } = await request.json()
    
    if (!type || !itemId) {
      return NextResponse.json({ success: false, error: "Type and itemId are required" }, { status: 400 })
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Remove from favorites
    if (type === 'venue' && user.favorites?.venues) {
      user.favorites.venues = user.favorites.venues.filter((id: any) => id.toString() !== itemId)
    } else if (type === 'vendor' && user.favorites?.vendors) {
      user.favorites.vendors = user.favorites.vendors.filter((id: any) => id.toString() !== itemId)
    }

    await user.save()

    return NextResponse.json({ success: true, message: "Removed from favorites" })
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return NextResponse.json({ success: false, error: "Failed to remove from favorites" }, { status: 500 })
  }
} 