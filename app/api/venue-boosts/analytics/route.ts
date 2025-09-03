import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import VenueBoost from "@/lib/models/venueBoost"
import { getServerSession } from '@/lib/auth-utils';

// GET /api/venue-boosts/analytics - Get boost analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const boostId = searchParams.get('boostId')
    const venueId = searchParams.get('venueId')
    const period = searchParams.get('period') || '7d' // 1d, 7d, 30d, 90d, 1y

    if (!boostId && !venueId) {
      return NextResponse.json({
        error: 'Either boostId or venueId is required'
      }, { status: 400 })
    }

    // Build query
    const query: any = { isActive: true }
    
    if (boostId) {
      query._id = boostId
    }
    
    if (venueId) {
      query.venue = venueId
    }

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get boost campaigns
    const boosts = await VenueBoost.find({
      ...query,
      'schedule.startDate': { $lte: now },
      'schedule.endDate': { $gte: startDate }
    }).populate('venue', 'name location')

    if (boosts.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalBoosts: 0,
            activeBoosts: 0,
            totalBudget: 0,
            totalSpent: 0,
            totalImpressions: 0,
            totalClicks: 0,
            totalViews: 0,
            totalInquiries: 0,
            totalBookings: 0
          },
          performance: {
            ctr: 0,
            cpc: 0,
            cpm: 0,
            roi: 0
          },
          trends: [],
          topPerforming: []
        }
      })
    }

    // Calculate overview metrics
    const overview = {
      totalBoosts: boosts.length,
      activeBoosts: boosts.filter((b: any) => b.status === 'active').length,
      totalBudget: boosts.reduce((sum: number, b: any) => sum + b.budget.amount, 0),
      totalSpent: boosts.reduce((sum: number, b: any) => sum + b.budget.spent, 0),
      totalImpressions: boosts.reduce((sum: number, b: any) => sum + b.performance.impressions, 0),
      totalClicks: boosts.reduce((sum: number, b: any) => sum + b.performance.clicks, 0),
      totalViews: boosts.reduce((sum: number, b: any) => sum + b.performance.views, 0),
      totalInquiries: boosts.reduce((sum: number, b: any) => sum + b.performance.inquiries, 0),
      totalBookings: boosts.reduce((sum: number, b: any) => sum + b.performance.bookings, 0)
    }

    // Calculate performance metrics
    const performance = {
      ctr: overview.totalImpressions > 0 ? (overview.totalClicks / overview.totalImpressions) * 100 : 0,
      cpc: overview.totalClicks > 0 ? overview.totalSpent / overview.totalClicks : 0,
      cpm: overview.totalImpressions > 0 ? (overview.totalSpent / overview.totalImpressions) * 1000 : 0,
      roi: overview.totalSpent > 0 ? ((overview.totalBookings * 50000 - overview.totalSpent) / overview.totalSpent) * 100 : 0
    }

    // Generate daily trends for the period
    const trends = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0]
      
      // Filter boosts active on this date
      const activeBoosts = boosts.filter(boost => {
        const boostStart = new Date(boost.schedule.startDate)
        const boostEnd = new Date(boost.schedule.endDate)
        return currentDate >= boostStart && currentDate <= boostEnd
      })

      const dailyMetrics = {
        date: dateStr,
        impressions: activeBoosts.reduce((sum: number, b: any) => sum + Math.floor(b.performance.impressions / b.schedule.duration), 0),
        clicks: activeBoosts.reduce((sum: number, b: any) => sum + Math.floor(b.performance.clicks / b.schedule.duration), 0),
        views: activeBoosts.reduce((sum: number, b: any) => sum + Math.floor(b.performance.views / b.schedule.duration), 0),
        spent: activeBoosts.reduce((sum: number, b: any) => sum + (b.budget.spent / b.schedule.duration), 0)
      }

      trends.push(dailyMetrics)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Get top performing boosts
    const topPerforming = boosts
      .map(boost => ({
        id: boost._id,
        venueName: boost.venue.name,
        boostType: boost.boostType,
        status: boost.status,
        budget: boost.budget.amount,
        spent: boost.budget.spent,
        impressions: boost.performance.impressions,
        clicks: boost.performance.clicks,
        ctr: boost.performance.ctr,
        cpc: boost.performance.cpc
      }))
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        overview,
        performance,
        trends,
        topPerforming
      }
    })

  } catch (error) {
    console.error('Boost analytics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch boost analytics',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// POST /api/venue-boosts/analytics - Track boost interaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { boostId, interactionType, metadata } = body

    if (!boostId || !interactionType) {
      return NextResponse.json({
        error: 'Boost ID and interaction type are required'
      }, { status: 400 })
    }

    await connectDB()

    // Find the boost
    const boost = await VenueBoost.findById(boostId)
    if (!boost || !boost.isBoostActive()) {
      return NextResponse.json({
        error: 'Boost not found or inactive'
      }, { status: 404 })
    }

    // Update performance metrics based on interaction type
    const updateData: any = {}
    
    switch (interactionType) {
      case 'impression':
        updateData['performance.impressions'] = boost.performance.impressions + 1
        break
      case 'click':
        updateData['performance.clicks'] = boost.performance.clicks + 1
        updateData['performance.impressions'] = boost.performance.impressions + 1
        break
      case 'view':
        updateData['performance.views'] = boost.performance.views + 1
        break
      case 'inquiry':
        updateData['performance.inquiries'] = boost.performance.inquiries + 1
        break
      case 'booking':
        updateData['performance.bookings'] = boost.performance.bookings + 1
        break
      default:
        return NextResponse.json({
          error: 'Invalid interaction type'
        }, { status: 400 })
    }

    // Calculate new metrics
    const newImpressions = updateData['performance.impressions'] || boost.performance.impressions
    const newClicks = updateData['performance.clicks'] || boost.performance.clicks
    
    if (newImpressions > 0) {
      updateData['performance.ctr'] = (newClicks / newImpressions) * 100
    }
    
    if (newClicks > 0) {
      updateData['performance.cpc'] = boost.budget.spent / newClicks
    }
    
    if (newImpressions > 0) {
      updateData['performance.cpm'] = (boost.budget.spent / newImpressions) * 1000
    }

    // Update boost
    await VenueBoost.findByIdAndUpdate(boostId, updateData)

    return NextResponse.json({
      success: true,
      message: 'Interaction tracked successfully'
    })

  } catch (error) {
    console.error('Interaction tracking error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track interaction',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 