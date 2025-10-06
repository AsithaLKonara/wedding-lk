import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'
import { Booking } from '@/lib/models/booking'
import { Vendor } from '@/lib/models/vendor'
import { Venue } from '@/lib/models/venue'
import { Review } from '@/lib/models/review'
import { Package } from '@/lib/models/package'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('range') || '30d'
    const startDate = getStartDate(timeRange)
    const endDate = new Date()

    // Calculate date range
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // 1. Revenue Analytics
    const revenueData = await getRevenueAnalytics(startDate, endDate)
    
    // 2. User Growth Analytics
    const userGrowthData = await getUserGrowthAnalytics(startDate, endDate)
    
    // 3. Booking Analytics
    const bookingAnalytics = await getBookingAnalytics(startDate, endDate)
    
    // 4. Vendor Performance Analytics
    const vendorAnalytics = await getVendorAnalytics(startDate, endDate)
    
    // 5. Geographic Analytics
    const geographicData = await getGeographicAnalytics()
    
    // 6. Conversion Funnel Analytics
    const conversionData = await getConversionAnalytics(startDate, endDate)
    
    // 7. Customer Lifetime Value
    const clvData = await getCustomerLifetimeValue()
    
    // 8. Churn Analysis
    const churnData = await getChurnAnalysis(startDate, endDate)
    
    // 9. Seasonal Trends
    const seasonalData = await getSeasonalTrends()
    
    // 10. Predictive Analytics
    const predictiveData = await getPredictiveAnalytics()

    return NextResponse.json({
      timeRange,
      period: {
        startDate,
        endDate,
        days: daysDiff
      },
      revenue: revenueData,
      userGrowth: userGrowthData,
      bookings: bookingAnalytics,
      vendors: vendorAnalytics,
      geographic: geographicData,
      conversion: conversionData,
      customerLifetimeValue: clvData,
      churn: churnData,
      seasonal: seasonalData,
      predictive: predictiveData
    })
  } catch (error) {
    console.error('Error fetching advanced analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getStartDate(range: string): Date {
  const now = new Date()
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

async function getRevenueAnalytics(startDate: Date, endDate: Date) {
  const bookings = await Booking.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['confirmed', 'completed'] }
  })

  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
  const averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

  // Revenue by day
  const revenueByDay = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Revenue by category
  const revenueByCategory = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor'
      }
    },
    {
      $unwind: '$vendor'
    },
    {
      $group: {
        _id: '$vendor.category',
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 }
      }
    }
  ])

  return {
    totalRevenue,
    averageOrderValue,
    revenueByDay,
    revenueByCategory,
    growthRate: await calculateGrowthRate('revenue', startDate, endDate)
  }
}

async function getUserGrowthAnalytics(startDate: Date, endDate: Date) {
  const totalUsers = await User.countDocuments()
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  })

  const usersByType = await User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$userType', count: { $sum: 1 } } }
  ])

  const userGrowthByDay = await User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return {
    totalUsers,
    newUsers,
    usersByType,
    userGrowthByDay,
    growthRate: await calculateGrowthRate('users', startDate, endDate)
  }
}

async function getBookingAnalytics(startDate: Date, endDate: Date) {
  const totalBookings = await Booking.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  })

  const bookingsByStatus = await Booking.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  const bookingsByDay = await Booking.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return {
    totalBookings,
    bookingsByStatus,
    bookingsByDay,
    conversionRate: await calculateConversionRate(startDate, endDate)
  }
}

async function getVendorAnalytics(startDate: Date, endDate: Date) {
  const topVendors = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor'
      }
    },
    {
      $unwind: '$vendor'
    },
    {
      $group: {
        _id: '$vendorId',
        vendorName: { $first: '$vendor.name' },
        category: { $first: '$vendor.category' },
        totalRevenue: { $sum: '$totalAmount' },
        bookingCount: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 }
  ])

  const vendorPerformance = await Vendor.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'vendorId',
        as: 'bookings'
      }
    },
    {
      $addFields: {
        totalBookings: { $size: '$bookings' },
        totalRevenue: {
          $sum: {
            $map: {
              input: '$bookings',
              as: 'booking',
              in: { $ifNull: ['$$booking.totalAmount', 0] }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: '$category',
        vendorCount: { $sum: 1 },
        totalBookings: { $sum: '$totalBookings' },
        totalRevenue: { $sum: '$totalRevenue' },
        averageRating: { $avg: '$rating.average' }
      }
    }
  ])

  return {
    topVendors,
    vendorPerformance,
    totalVendors: await Vendor.countDocuments(),
    activeVendors: await Vendor.countDocuments({ isActive: true })
  }
}

async function getGeographicAnalytics() {
  const bookingsByLocation = await Booking.aggregate([
    {
      $lookup: {
        from: 'venues',
        localField: 'venueId',
        foreignField: '_id',
        as: 'venue'
      }
    },
    {
      $unwind: '$venue'
    },
    {
      $group: {
        _id: '$venue.location.city',
        bookingCount: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { bookingCount: -1 } }
  ])

  return {
    bookingsByLocation,
    topCities: bookingsByLocation.slice(0, 10)
  }
}

async function getConversionAnalytics(startDate: Date, endDate: Date) {
  const totalVisitors = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  })

  const totalBookings = await Booking.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  })

  const conversionRate = totalVisitors > 0 ? (totalBookings / totalVisitors) * 100 : 0

  return {
    totalVisitors,
    totalBookings,
    conversionRate,
    funnel: {
      visitors: totalVisitors,
      registered: await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
        isVerified: true
      }),
      bookings: totalBookings,
      completed: await Booking.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      })
    }
  }
}

async function getCustomerLifetimeValue() {
  const clvData = await Booking.aggregate([
    {
      $group: {
        _id: '$userId',
        totalSpent: { $sum: '$totalAmount' },
        bookingCount: { $sum: 1 },
        firstBooking: { $min: '$createdAt' },
        lastBooking: { $max: '$createdAt' }
      }
    },
    {
      $addFields: {
        averageOrderValue: { $divide: ['$totalSpent', '$bookingCount'] },
        customerLifespan: {
          $divide: [
            { $subtract: ['$lastBooking', '$firstBooking'] },
            1000 * 60 * 60 * 24 * 30 // Convert to months
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        averageCLV: { $avg: '$totalSpent' },
        averageOrderValue: { $avg: '$averageOrderValue' },
        averageLifespan: { $avg: '$customerLifespan' }
      }
    }
  ])

  return clvData[0] || { averageCLV: 0, averageOrderValue: 0, averageLifespan: 0 }
}

async function getChurnAnalysis(startDate: Date, endDate: Date) {
  const previousPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()))
  
  const activeUsersPrevious = await User.countDocuments({
    createdAt: { $gte: previousPeriodStart, $lt: startDate }
  })

  const activeUsersCurrent = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  })

  const churnRate = activeUsersPrevious > 0 ? 
    ((activeUsersPrevious - activeUsersCurrent) / activeUsersPrevious) * 100 : 0

  return {
    churnRate,
    activeUsersPrevious,
    activeUsersCurrent,
    retentionRate: 100 - churnRate
  }
}

async function getSeasonalTrends() {
  const monthlyData = await Booking.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        bookingCount: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return {
    monthlyTrends: monthlyData,
    peakMonth: monthlyData.reduce((max, month) => 
      month.bookingCount > max.bookingCount ? month : max, monthlyData[0] || {})
  }
}

async function getPredictiveAnalytics() {
  // Simple predictive model based on historical data
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  
  const currentMonthBookings = await Booking.countDocuments({
    createdAt: { $gte: lastMonth }
  })

  const previousMonth = new Date()
  previousMonth.setMonth(previousMonth.getMonth() - 2)
  previousMonth.setMonth(previousMonth.getMonth() - 1)

  const previousMonthBookings = await Booking.countDocuments({
    createdAt: { $gte: previousMonth, $lt: lastMonth }
  })

  const growthRate = previousMonthBookings > 0 ? 
    ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100 : 0

  const predictedNextMonth = Math.round(currentMonthBookings * (1 + growthRate / 100))

  return {
    currentMonthBookings,
    previousMonthBookings,
    growthRate,
    predictedNextMonth,
    confidence: Math.min(95, Math.max(60, 100 - Math.abs(growthRate)))
  }
}

async function calculateGrowthRate(metric: string, startDate: Date, endDate: Date) {
  const periodLength = endDate.getTime() - startDate.getTime()
  const previousStart = new Date(startDate.getTime() - periodLength)
  const previousEnd = new Date(startDate)

  let currentValue, previousValue

  switch (metric) {
    case 'revenue':
      currentValue = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
      previousValue = await Booking.aggregate([
        { $match: { createdAt: { $gte: previousStart, $lte: previousEnd } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
      break
    case 'users':
      currentValue = [{ total: await User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }) }]
      previousValue = [{ total: await User.countDocuments({ createdAt: { $gte: previousStart, $lte: previousEnd } }) }]
      break
    default:
      return 0
  }

  const current = currentValue[0]?.total || 0
  const previous = previousValue[0]?.total || 0

  return previous > 0 ? ((current - previous) / previous) * 100 : 0
}

async function calculateConversionRate(startDate: Date, endDate: Date) {
  const totalUsers = await User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
  const totalBookings = await Booking.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
  
  return totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0
}



