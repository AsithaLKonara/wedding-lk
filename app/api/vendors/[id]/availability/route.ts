import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Vendor, Booking } from '@/lib/models'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    await connectDB()

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Build query for bookings
    const query: any = { vendorId }
    
    if (date) {
      query.eventDate = new Date(date)
    } else if (startDate && endDate) {
      query.eventDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    // Get bookings to determine availability
    const bookings = await Booking.find(query).lean()
    
    // Calculate availability (simplified - assumes vendor is available if no booking)
    const availability = {
      vendorId,
      available: bookings.length === 0,
      bookings: bookings.length,
      dates: bookings.map((b: any) => b.eventDate)
    }

    return NextResponse.json({ success: true, availability })
  } catch (error) {
    console.error('Error fetching vendor availability:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request, ['vendor', 'admin'])
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: vendorId } = await params
    await connectDB()

    // Verify vendor exists and user owns it
    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    if (vendor.userId?.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { available, dates, notes } = await request.json()

    // Update vendor availability settings
    if (!vendor.availability) {
      vendor.availability = {}
    }
    
    vendor.availability.available = available
    vendor.availability.dates = dates
    vendor.availability.notes = notes
    vendor.availability.updatedAt = new Date()

    await vendor.save()

    return NextResponse.json(
      { success: true, availability: vendor.availability }
    )
  } catch (error) {
    console.error('Error updating vendor availability:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

