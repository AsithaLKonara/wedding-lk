import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import VenueBoost from "@/lib/models/venueBoost"
import { Venue } from "@/lib/models/venue"
import { User } from "@/lib/models/user"
import { getServerSession } from '@/lib/auth-utils';

// POST /api/venue-boosts - Create new boost campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is a venue owner
    if (user.role !== 'vendor' && user.role !== 'admin') {
      return NextResponse.json({ error: "Only venue owners can create boost campaigns" }, { status: 403 })
    }

    const body = await request.json()
    const {
      venueId,
      boostType,
      budget,
      targeting,
      schedule,
      settings
    } = body

    if (!venueId || !boostType || !budget || !targeting || !schedule) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate venue ownership
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    if (venue.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'You can only boost your own venues' }, { status: 403 })
    }

    // Check if venue is already boosted
    const existingBoost = await VenueBoost.findOne({
      venue: venueId,
      status: { $in: ['pending', 'active', 'paused'] }
    })

    if (existingBoost) {
      return NextResponse.json({
        error: 'This venue already has an active boost campaign'
      }, { status: 409 })
    }

    // Validate budget
    if (budget.amount < 1000) {
      return NextResponse.json({
        error: 'Minimum boost budget is 1000 LKR'
      }, { status: 400 })
    }

    // Validate schedule
    const startDate = new Date(schedule.startDate)
    const endDate = new Date(schedule.endDate)
    const now = new Date()

    if (startDate < now) {
      return NextResponse.json({
        error: 'Start date cannot be in the past'
      }, { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json({
        error: 'End date must be after start date'
      }, { status: 400 })
    }

    // Calculate duration
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Create boost campaign
    const boost = new VenueBoost({
      venue: venueId,
      owner: user._id,
      boostType,
      budget: {
        ...budget,
        remaining: budget.amount
      },
      targeting,
      schedule: {
        ...schedule,
        duration
      },
      settings: {
        autoRenew: false,
        maxDailyBudget: budget.amount / duration,
        bidAmount: settings?.bidAmount || 50,
        priority: settings?.priority || 'medium',
        ...settings
      }
    })

    await boost.save()

    // Populate related data
    await boost.populate('venue', 'name location images')
    await boost.populate('owner', 'name email')

    return NextResponse.json({
      success: true,
      data: boost,
      message: 'Boost campaign created successfully'
    })

  } catch (error) {
    console.error('Boost creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create boost campaign',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/venue-boosts - Get boost campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const status = searchParams.get('status')
    const boostType = searchParams.get('boostType')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query based on user role
    const query: any = { isActive: true }
    
    if (user.role === 'admin') {
      // Admin can see all boosts
    } else {
      // Users can only see their own boosts
      query.owner = user._id
    }

    if (venueId) {
      query.venue = venueId
    }

    if (status) {
      query.status = status
    }

    if (boostType) {
      query.boostType = boostType
    }

    // Get boosts with pagination
    const boosts = await VenueBoost.find(query)
      .populate('venue', 'name location images rating')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)

    // Get total count
    const total = await VenueBoost.countDocuments(query)

    // Get status counts
    const statusCounts = await VenueBoost.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusSummary = statusCounts.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id] = item.count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: boosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      summary: {
        status: statusSummary
      }
    })

  } catch (error) {
    console.error('Boosts fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch boost campaigns',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/venue-boosts - Update boost campaign
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { boostId, budget, targeting, schedule, settings, status } = body

    if (!boostId) {
      return NextResponse.json({ error: 'Boost ID is required' }, { status: 400 })
    }

    // Find boost and check permissions
    const boost = await VenueBoost.findById(boostId)
    if (!boost) {
      return NextResponse.json({ error: 'Boost campaign not found' }, { status: 404 })
    }

    // Check if user has permission to update this boost
    if (user.role !== 'admin' && boost.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to update this boost' }, { status: 403 })
    }

    // Update boost fields
    const updateData: any = {}
    
    if (budget) {
      updateData.budget = {
        ...boost.budget,
        ...budget,
        remaining: (budget.amount || boost.budget.amount) - boost.budget.spent
      }
    }

    if (targeting) {
      updateData.targeting = { ...boost.targeting, ...targeting }
    }

    if (schedule) {
      const startDate = new Date(schedule.startDate || boost.schedule.startDate)
      const endDate = new Date(schedule.endDate || boost.schedule.endDate)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      updateData.schedule = {
        ...boost.schedule,
        ...schedule,
        duration
      }
    }

    if (settings) {
      updateData.settings = { ...boost.settings, ...settings }
    }

    if (status) {
      updateData.status = status
      
      // Set timestamps based on status
      if (status === 'active' && boost.status !== 'active') {
        updateData.activatedAt = new Date()
      } else if (status === 'paused' && boost.status !== 'paused') {
        updateData.pausedAt = new Date()
      } else if (status === 'completed' && boost.status !== 'completed') {
        updateData.completedAt = new Date()
      }
    }

    const updatedBoost = await VenueBoost.findByIdAndUpdate(
      boostId,
      updateData,
      { new: true }
    ).populate('venue owner')

    return NextResponse.json({
      success: true,
      data: updatedBoost,
      message: 'Boost campaign updated successfully'
    })

  } catch (error) {
    console.error('Boost update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update boost campaign',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/venue-boosts - Delete boost campaign
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const boostId = searchParams.get('id')

    if (!boostId) {
      return NextResponse.json({ error: 'Boost ID is required' }, { status: 400 })
    }

    // Find boost and check permissions
    const boost = await VenueBoost.findById(boostId)
    if (!boost) {
      return NextResponse.json({ error: 'Boost campaign not found' }, { status: 404 })
    }

    // Check if user has permission to delete this boost
    if (user.role !== 'admin' && boost.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this boost' }, { status: 403 })
    }

    // Soft delete boost
    await VenueBoost.findByIdAndUpdate(boostId, {
      isActive: false,
      status: 'cancelled'
    })

    return NextResponse.json({
      success: true,
      message: 'Boost campaign deleted successfully'
    })

  } catch (error) {
    console.error('Boost deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete boost campaign',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 