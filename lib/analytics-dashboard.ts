import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import { Booking } from "@/lib/models/booking"
import { Payment } from "@/lib/models/Payment"
import { Message } from "@/lib/models/message"
import { Notification } from "@/lib/models/notification"

interface AnalyticsMetrics {
  users: {
    total: number
    active: number
    newThisMonth: number
    growth: number
  }
  revenue: {
    total: number
    thisMonth: number
    growth: number
    averageBooking: number
  }
  bookings: {
    total: number
    thisMonth: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  venues: {
    total: number
    active: number
    averageRating: number
    topRated: any[]
  }
  vendors: {
    total: number
    active: number
    byCategory: Record<string, number>
    topPerforming: any[]
  }
  engagement: {
    messagesSent: number
    notificationsSent: number
    averageResponseTime: number
  }
  performance: {
    pageViews: number
    uniqueVisitors: number
    conversionRate: number
    averageSessionDuration: number
  }
}

interface ChartData {
  revenue: Array<{ date: string; amount: number }>
  bookings: Array<{ date: string; count: number }>
  users: Array<{ date: string; count: number }>
  categories: Array<{ category: string; count: number }>
}

class AnalyticsDashboard {
  // Get comprehensive analytics metrics
  async getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
    try {
      await connectDB()
      
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      // User metrics
      const totalUsers = await User.countDocuments()
      const activeUsers = await User.countDocuments({ isActive: true })
      const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: thisMonth }
      })
      const newUsersLastMonth = await User.countDocuments({
        createdAt: { $gte: lastMonth, $lt: thisMonth }
      })
      const userGrowth = newUsersLastMonth > 0 ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 : 0

      // Revenue metrics
      const totalRevenue = await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      
      const thisMonthRevenue = await Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: thisMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])

      const lastMonthRevenue = await Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: lastMonth, $lt: thisMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])

      const revenueGrowth = lastMonthRevenue[0]?.total > 0 
        ? ((thisMonthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100 
        : 0

      const averageBooking = await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, average: { $avg: '$amount' } } }
      ])

      // Booking metrics
      const totalBookings = await Booking.countDocuments()
      const bookingsThisMonth = await Booking.countDocuments({
        createdAt: { $gte: thisMonth }
      })
      const pendingBookings = await Booking.countDocuments({ status: 'pending' })
      const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' })
      const completedBookings = await Booking.countDocuments({ status: 'completed' })
      const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' })

      // Venue metrics
      const totalVenues = await Venue.countDocuments()
      const activeVenues = await Venue.countDocuments({ isActive: true })
      const averageVenueRating = await Venue.aggregate([
        { $group: { _id: null, average: { $avg: '$rating' } } }
      ])
      const topRatedVenues = await Venue.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(5)
        .select('name rating location price')

      // Vendor metrics
      const totalVendors = await Vendor.countDocuments()
      const activeVendors = await Vendor.countDocuments({ isActive: true })
      const vendorsByCategory = await Vendor.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
      const topPerformingVendors = await Vendor.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(5)
        .select('name category rating price')

      // Engagement metrics
      const messagesSent = await Message.countDocuments()
      const notificationsSent = await Notification.countDocuments()
      const averageResponseTime = await this.calculateAverageResponseTime()

      // Performance metrics (mock data for now)
      const performance = {
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 2000) + 1000,
        conversionRate: Math.random() * 10 + 2,
        averageSessionDuration: Math.floor(Math.random() * 300) + 120
      }

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          growth: userGrowth
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: thisMonthRevenue[0]?.total || 0,
          growth: revenueGrowth,
          averageBooking: averageBooking[0]?.average || 0
        },
        bookings: {
          total: totalBookings,
          thisMonth: bookingsThisMonth,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        venues: {
          total: totalVenues,
          active: activeVenues,
          averageRating: averageVenueRating[0]?.average || 0,
          topRated: topRatedVenues
        },
        vendors: {
          total: totalVendors,
          active: activeVendors,
          byCategory: vendorsByCategory.reduce((acc: Record<string, number>, item: any) => {
            acc[item._id] = item.count
            return acc
          }, {} as Record<string, number>),
          topPerforming: topPerformingVendors
        },
        engagement: {
          messagesSent,
          notificationsSent,
          averageResponseTime
        },
        performance
      }

    } catch (error) {
      // Log error without console.log in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics metrics error:', error)
      }
      return this.getDefaultMetrics()
    }
  }

  // Get chart data for visualizations
  async getChartData(days: number = 30): Promise<ChartData> {
    try {
      await connectDB()
      
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))

      // Revenue chart data
      const revenueData = await Payment.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ])

      // Bookings chart data
      const bookingsData = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])

      // Users chart data
      const usersData = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])

      // Categories chart data
      const categoriesData = await Vendor.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])

      return {
        revenue: revenueData.map((item: any) => ({ date: item._id, amount: item.amount })),
        bookings: bookingsData.map((item: any) => ({ date: item._id, count: item.count })),
        users: usersData.map((item: any) => ({ date: item._id, count: item.count })),
        categories: categoriesData.map((item: any) => ({ category: item._id, count: item.count }))
      }

    } catch (error) {
      // Log error without console.log in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Chart data error:', error)
      }
      return {
        revenue: [],
        bookings: [],
        users: [],
        categories: []
      }
    }
  }

  // Get real-time dashboard data
  async getRealTimeData() {
    try {
      await connectDB()
      
      const now = new Date()
      const lastHour = new Date(now.getTime() - (60 * 60 * 1000))
      const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000))

      const recentBookings = await Booking.find({
        createdAt: { $gte: last24Hours }
      }).populate('userId', 'name email')

      const recentPayments = await Payment.find({
        createdAt: { $gte: last24Hours }
      }).populate('userId', 'name email')

      const recentMessages = await Message.find({
        createdAt: { $gte: lastHour }
      }).populate('senderId', 'name email')

      const unreadNotifications = await Notification.countDocuments({
        isRead: false,
        createdAt: { $gte: last24Hours }
      })

      return {
        recentBookings,
        recentPayments,
        recentMessages,
        unreadNotifications,
        lastUpdated: now
      }

    } catch (error) {
      // Log error without console.log in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Real-time data error:', error)
      }
      return {
        recentBookings: [],
        recentPayments: [],
        recentMessages: [],
        unreadNotifications: 0,
        lastUpdated: new Date()
      }
    }
  }

  private async calculateAverageResponseTime(): Promise<number> {
    try {
      const messages = await Message.find({
        type: 'text',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ createdAt: 1 })

      let totalResponseTime = 0
      let responseCount = 0

      for (let i = 1; i < messages.length; i++) {
        const currentMessage = messages[i]
        const previousMessage = messages[i - 1]

        if (currentMessage.senderId.toString() !== previousMessage.senderId.toString()) {
          const responseTime = currentMessage.createdAt.getTime() - previousMessage.createdAt.getTime()
          totalResponseTime += responseTime
          responseCount++
        }
      }

      return responseCount > 0 ? totalResponseTime / responseCount / 1000 : 0 // Return in seconds

    } catch (error) {
      // Log error without console.log in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Response time calculation error:', error)
      }
      return 0
    }
  }

  private getDefaultMetrics(): AnalyticsMetrics {
    return {
      users: { total: 0, active: 0, newThisMonth: 0, growth: 0 },
      revenue: { total: 0, thisMonth: 0, growth: 0, averageBooking: 0 },
      bookings: { total: 0, thisMonth: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
      venues: { total: 0, active: 0, averageRating: 0, topRated: [] },
      vendors: { total: 0, active: 0, byCategory: {}, topPerforming: [] },
      engagement: { messagesSent: 0, notificationsSent: 0, averageResponseTime: 0 },
      performance: { pageViews: 0, uniqueVisitors: 0, conversionRate: 0, averageSessionDuration: 0 }
    }
  }
}

export default new AnalyticsDashboard() 