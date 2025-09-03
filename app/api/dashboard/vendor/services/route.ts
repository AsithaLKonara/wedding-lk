import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { Service } from "@/lib/models/service"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = { vendor: vendorId }
    if (category) query.category = category

    // Get services with pagination
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Service.countDocuments(query)

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const body = await request.json()
    const { name, description, category, price, priceType, duration, isActive } = body

    if (!name || !description || !category || !price) {
      return NextResponse.json(
        { error: "Name, description, category, and price are required" },
        { status: 400 }
      )
    }

    // Create new service
    const service = await Service.create({
      vendor: vendorId,
      name,
      description,
      category,
      price,
      priceType: priceType || 'fixed',
      duration,
      isActive: isActive !== undefined ? isActive : true
    })

    return NextResponse.json({ service }, { status: 201 })

  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const body = await request.json()
    const { serviceId, updates } = body

    if (!serviceId || !updates) {
      return NextResponse.json(
        { error: "Service ID and updates are required" },
        { status: 400 }
      )
    }

    // Verify service belongs to vendor
    const service = await Service.findOne({ _id: serviceId, vendor: vendorId })
    if (!service) {
      return NextResponse.json(
        { error: "Service not found or access denied" },
        { status: 404 }
      )
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { $set: updates },
      { new: true, runValidators: true }
    )

    return NextResponse.json({ service: updatedService })

  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get vendor ID from user's vendor profile
    const vendor = await Vendor.findOne({ owner: session.user.id })
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }
    const vendorId = vendor._id

    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      )
    }

    // Verify service belongs to vendor
    const service = await Service.findOne({ _id: serviceId, vendor: vendorId })
    if (!service) {
      return NextResponse.json(
        { error: "Service not found or access denied" },
        { status: 404 }
      )
    }

    // Soft delete - mark as inactive
    await Service.findByIdAndUpdate(serviceId, { isActive: false })

    return NextResponse.json({ message: "Service deactivated successfully" })

  } catch (error) {
    console.error("Error deactivating service:", error)
    return NextResponse.json(
      { error: "Failed to deactivate service" },
      { status: 500 }
    )
  }
} 