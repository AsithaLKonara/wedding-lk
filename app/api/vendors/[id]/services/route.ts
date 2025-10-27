import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Vendor, Service } from '@/lib/models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendorId = params.id
    await connectDB()

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get vendor services
    const services = vendor.services || []

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error('Error fetching vendor services:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vendorId = params.id
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

    const { name, description, price, duration, category } = await request.json()

    const newService = {
      name,
      description,
      price,
      duration,
      category
    }

    if (!vendor.services) {
      vendor.services = []
    }
    vendor.services.push(newService)
    await vendor.save()

    return NextResponse.json(
      { success: true, service: newService },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding service:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

