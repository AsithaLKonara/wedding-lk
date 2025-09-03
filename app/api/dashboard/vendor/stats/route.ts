import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { Booking } from "@/lib/models/booking"
import { Review } from "@/lib/models/review"
import { Service } from "@/lib/models/service"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    // Get vendor stats
    const vendorProfile = await Vendor.findById(vendorId)
    if (!vendorProfile) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      )
    }

    // Get booking stats
    const totalBookings = await Booking.countDocuments({ vendor: vendorId })
    const totalRevenue = await Booking.aggregate([
      { $match: { vendor: vendorId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]).then(result => result[0]?.total || 0)

    // Get review stats
    const reviews = await Review.find({ vendor: vendorId })
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Get service stats
    const activeServices = await Service.countDocuments({ 
      vendor: vendorId, 
      isActive: true 
    })

    const stats = {
      totalBookings,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      activeServices
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching vendor stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor stats" },
      { status: 500 }
    )
  }
} 