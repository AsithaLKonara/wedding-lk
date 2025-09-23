import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Package } from "@/lib/models/package"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get("packageId")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const capacity = searchParams.get("capacity")

    let query: any = { isActive: true }

    if (packageId) {
      const packageData = await (Package as any).findById(packageId).populate('vendor', 'name businessName')
      if (!packageData) {
        return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: packageData })
    }

    if (category) {
      query.category = category
    }

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" }
    }

    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) }
    }

    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) }
    }

    if (capacity) {
      query["capacity.min"] = { $lte: Number(capacity) }
      query["capacity.max"] = { $gte: Number(capacity) }
    }

    const packages = await (Package as any).find(query)
      .populate('vendor', 'name businessName rating')
      .sort({ rating: -1, createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: packages,
      count: packages.length,
      filters: { category, location, minPrice, maxPrice, capacity },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch packages",
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
    const { name, description, price, originalPrice, category, features, capacity, location, vendor } = body

    if (!name || !description || !price || !category || !vendor) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "description", "price", "category", "vendor"],
        },
        { status: 400 },
      )
    }

    const newPackage = await (Package as any).create({
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      category,
      features: features || [],
      capacity: capacity || { min: 50, max: 500 },
      location: location || { city: "Colombo", district: "Western" },
      vendor,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, data: newPackage }, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create package",
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
    const packageId = searchParams.get("packageId")
    if (!packageId) {
      return NextResponse.json({ success: false, error: "Package ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const packageData = await (Package as any).findByIdAndUpdate(packageId, body, { new: true })

    if (!packageData) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: packageData })
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update package",
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
    const packageId = searchParams.get("packageId")
    if (!packageId) {
      return NextResponse.json({ success: false, error: "Package ID is required" }, { status: 400 })
    }

    const packageData = await (Package as any).findByIdAndUpdate(packageId, { isActive: false }, { new: true })

    if (!packageData) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Package deleted successfully" })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete package",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
