import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Vendor } from '@/lib/models'

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

    // Get vendor portfolio items
    const portfolio = vendor.portfolio || []

    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('Error fetching vendor portfolio:', error)
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

    const { imageUrl, title, description, category } = await request.json()

    const newPortfolioItem = {
      imageUrl,
      title,
      description,
      category,
      createdAt: new Date()
    }

    if (!vendor.portfolio) {
      vendor.portfolio = []
    }
    vendor.portfolio.push(newPortfolioItem)
    await vendor.save()

    return NextResponse.json(
      { success: true, portfolioItem: newPortfolioItem },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding portfolio item:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

