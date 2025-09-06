import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get featured vendors with basic info
    const vendors = await Vendor.find({ 
      featured: true, 
      isActive: true, 
      isVerified: true 
    })
    .select('name businessName category description location contact rating portfolio')
    .limit(6)
    .sort({ 'rating.average': -1, createdAt: -1 })

    // If no featured vendors found, get top-rated vendors instead
    if (!vendors || vendors.length === 0) {
      const topVendors = await Vendor.find({ 
        isActive: true, 
        isVerified: true 
      })
      .select('name businessName category description location contact rating portfolio')
      .limit(6)
      .sort({ 'rating.average': -1, createdAt: -1 })
      
      return NextResponse.json({ vendors: topVendors })
    }

    return NextResponse.json({ vendors })

  } catch (error) {
    console.error("Error fetching featured vendors:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured vendors" },
      { status: 500 }
    )
  }
} 