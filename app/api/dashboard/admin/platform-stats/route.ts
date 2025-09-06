import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from '@/lib/auth-utils';
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { Vendor } from "@/lib/models/vendor"
import { Venue } from "@/lib/models/venue"
import { Booking } from "@/lib/models/booking"
import { Payment } from "@/lib/models"
import { Review } from "@/lib/models/review"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalVendors = await Vendor.countDocuments()
    const totalVenues = await Venue.countDocuments()
    const totalBookings = await Booking.countDocuments()
    const totalReviews = await Review.countDocuments()

    // Get pending approvals
    const pendingVendors = await Vendor.countDocuments({ isVerified: false })
    const pendingVenues = await Venue.countDocuments({ isVerified: false })

    // Get revenue data
    const payments = await Payment.find({ status: 'completed' })
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    
    // Monthly revenue
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt) >= thisMonth)
      .reduce((sum, p) => sum + p.amount, 0)

    // Growth calculations
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    const lastMonthRevenue = payments
      .filter(p => new Date(p.createdAt) >= lastMonth && new Date(p.createdAt) < thisMonth)
      .reduce((sum, p) => sum + p.amount, 0)

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

    // User growth
    const thisMonthUsers = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $gte: thisMonth } 
    })
    const lastMonthUsers = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $gte: lastMonth, $lt: thisMonth } 
    })

    const userGrowth = lastMonthUsers > 0 
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : 0

    // Vendor growth
    const thisMonthVendors = await Vendor.countDocuments({ createdAt: { $gte: thisMonth } })
    const lastMonthVendors = await Vendor.countDocuments({ 
      createdAt: { $gte: lastMonth, $lt: thisMonth } 
    })

    const vendorGrowth = lastMonthVendors > 0 
      ? ((thisMonthVendors - lastMonthVendors) / lastMonthVendors) * 100
      : 0

    // Get top categories
    const vendorCategories = await Vendor.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Get recent activity
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('vendor', 'name businessName')
      .populate('venue', 'name')

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt')

    const platformStats = {
      overview: {
        totalUsers,
        totalVendors,
        totalVenues,
        totalBookings,
        totalReviews
      },
      pending: {
        vendors: pendingVendors,
        venues: pendingVenues
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        growth: Math.round(revenueGrowth * 10) / 10
      },
      growth: {
        users: Math.round(userGrowth * 10) / 10,
        vendors: Math.round(vendorGrowth * 10) / 10
      },
      categories: vendorCategories,
      recentActivity: {
        bookings: recentBookings,
        users: recentUsers
      }
    }

    return NextResponse.json({ platformStats })

  } catch (error) {
    console.error("Error fetching platform stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch platform stats" },
      { status: 500 }
    )
  }
} 