import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { getServerSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (status) {
      query.status = status
    }

    if (category) {
      query.category = category
    }

    const vendors = await Vendor.find(query)
      .select('name businessName email category status isActive isVerified createdAt')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Vendor.countDocuments(query)

    return NextResponse.json({
      vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: body.email })
    if (existingVendor) {
      return NextResponse.json(
        { error: "Vendor with this email already exists" },
        { status: 400 }
      )
    }

    const vendor = new Vendor({
      ...body,
      isActive: body.isActive ?? true,
      isVerified: body.isVerified ?? false,
      status: body.status ?? 'pending'
    })

    await vendor.save()

    return NextResponse.json({ vendor }, { status: 201 })

  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      )
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ vendor })

  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      )
    }

    const vendor = await Vendor.findByIdAndDelete(id)

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Vendor deleted successfully" })

  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json(
      { error: "Failed to delete vendor" },
      { status: 500 }
    )
  }
} 