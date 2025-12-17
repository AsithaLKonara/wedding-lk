import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Vendor, Review } from '@/lib/models'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await params
    await connectDB()

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get reviews for this vendor
    const reviews = await Review.find({ vendorId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ success: true, reviews })
  } catch (error) {
    console.error('Error fetching vendor reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: vendorId } = await params
    await connectDB()

    // Verify vendor exists
    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const { rating, comment, bookingId } = await request.json()

    // Create review
    const review = new Review({
      vendorId,
      userId: authResult.user.id,
      rating,
      comment,
      bookingId,
      createdAt: new Date()
    })

    await review.save()

    return NextResponse.json(
      { success: true, review },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

