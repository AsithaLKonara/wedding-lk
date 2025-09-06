import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { Booking } from "@/lib/models/booking"
import { Review } from "@/lib/models/review"
import { Payment } from "@/lib/models"
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get bookings analytics
    const bookings = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get revenue analytics
    const revenueStats = await Payment.aggregate([
      {
        $match: {
          vendor: vendorId,
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    // Get review analytics
    const reviewStats = await Review.aggregate([
      {
        $match: {
          vendor: vendorId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ])

    // Get category performance
    const categoryPerformance = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      {
        $group: {
          _id: { $arrayElemAt: ["$vendorInfo.category", 0] },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { revenue: -1 } }
    ])

    // Get client analytics
    const clientStats = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$client",
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      {
        $group: {
          _id: null,
          uniqueClients: { $sum: 1 },
          averageBookingsPerClient: { $avg: "$totalBookings" },
          averageSpentPerClient: { $avg: "$totalSpent" }
        }
      }
    ])

    // Format the data
    const analytics = {
      period: `${period} days`,
      dateRange: { start: startDate, end: endDate },
      bookings: {
        data: bookings,
        total: bookings.reduce((sum, item) => sum + item.count, 0)
      },
      revenue: {
        data: revenueStats[0] || { totalRevenue: 0, averageAmount: 0, count: 0 },
        trend: bookings.map(item => ({
          date: item._id,
          revenue: item.revenue
        }))
      },
      reviews: {
        data: reviewStats[0] || { averageRating: 0, totalReviews: 0, ratingDistribution: [] },
        distribution: reviewStats[0]?.ratingDistribution.reduce((acc: any, rating: number) => {
          acc[rating] = (acc[rating] || 0) + 1
          return acc
        }, {}) || {}
      },
      categories: categoryPerformance,
      clients: clientStats[0] || { uniqueClients: 0, averageBookingsPerClient: 0, averageSpentPerClient: 0 }
    }

    return NextResponse.json({ analytics })

  } catch (error) {
    console.error("Error fetching vendor analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
} 