import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get all categories with counts
    const categories = await Vendor.aggregate([
      { $match: { isVerified: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get featured categories (top 5)
    const featuredCategories = categories.slice(0, 5)

    // Get all categories for filter dropdown
    const allCategories = categories.map(cat => ({
      value: cat._id,
      label: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
      count: cat.count
    }))

    return NextResponse.json({
      featured: featuredCategories,
      all: allCategories
    })

  } catch (error) {
    console.error("Error fetching vendor categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor categories" },
      { status: 500 }
    )
  }
} 