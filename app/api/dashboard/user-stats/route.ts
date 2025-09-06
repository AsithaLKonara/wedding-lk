import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { Booking } from "@/lib/models/booking"
import { Payment } from "@/lib/models"
import { Review } from "@/lib/models/review"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const userId = session.user.id

    // Get user's basic stats
    const user = await User.findById(userId).select('name email role createdAt')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's bookings
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).limit(10)
    const totalBookings = await Booking.countDocuments({ userId })
    const confirmedBookings = await Booking.countDocuments({ userId, status: 'confirmed' })
    const pendingBookings = await Booking.countDocuments({ userId, status: 'pending' })

    // Get user's payments
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(10)
    const totalPayments = await Payment.countDocuments({ userId })
    const totalSpent = await Payment.aggregate([
      { $match: { userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // Get user's reviews
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 }).limit(10)
    const totalReviews = await Review.countDocuments({ userId })

    // Calculate monthly stats for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyBookings = await Booking.aggregate([
      { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const monthlyPayments = await Payment.aggregate([
      { $match: { userId, status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Get recent activity
    const recentActivity = await Promise.all([
      ...bookings.map(booking => ({
        type: 'booking',
        action: `Booked ${booking.serviceType}`,
        date: booking.createdAt,
        status: booking.status,
        amount: booking.amount
      })),
      ...payments.map(payment => ({
        type: 'payment',
        action: `Payment ${payment.status}`,
        date: payment.createdAt,
        status: payment.status,
        amount: payment.amount
      })),
      ...reviews.map(review => ({
        type: 'review',
        action: `Reviewed ${review.vendorName || 'service'}`,
        date: review.createdAt,
        rating: review.rating
      }))
    ])

    // Sort recent activity by date
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const stats = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        memberSince: user.createdAt
      },
      overview: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        totalPayments,
        totalSpent: totalSpent[0]?.total || 0,
        totalReviews
      },
      recentBookings: bookings.slice(0, 5),
      recentPayments: payments.slice(0, 5),
      recentReviews: reviews.slice(0, 5),
      monthlyStats: {
        bookings: monthlyBookings,
        payments: monthlyPayments
      },
      recentActivity: recentActivity.slice(0, 10)
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    )
  }
} 