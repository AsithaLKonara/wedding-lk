import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Service } from "@/lib/models/service"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")
    const vendorId = searchParams.get("vendorId")

    let query = {}

    if (serviceId) {
      const service = await (Service as any).findById(serviceId).populate('vendorId', 'name businessName')
      if (!service) {
        return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: service })
    }

    if (vendorId) {
      query = { vendorId }
    }

    const services = await (Service as any).find(query)
      .populate('vendorId', 'name businessName')
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, description, price, duration, category, vendorId } = body

    if (!name || !description || !price || !vendorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "description", "price", "vendorId"],
        },
        { status: 400 },
      )
    }

    const service = await (Service as any).create({
      name,
      description,
      price: Number(price),
      duration: duration || "Full day",
      category: category || "General",
      vendorId,
      isActive: true,
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create service",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")
    
    if (!serviceId) {
      return NextResponse.json({ success: false, error: "Service ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const service = await (Service as any).findByIdAndUpdate(serviceId, body, { new: true })

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update service",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")
    
    if (!serviceId) {
      return NextResponse.json({ success: false, error: "Service ID is required" }, { status: 400 })
    }

    const service = await (Service as any).findByIdAndUpdate(serviceId, { isActive: false }, { new: true })

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete service",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}