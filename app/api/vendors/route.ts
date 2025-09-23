import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { User } from "@/lib/models/user"

// Mock vendor data
const mockVendors = [
  {
    _id: "1",
    name: "Elegant Photography",
    businessName: "Elegant Photography Studio",
    category: "Photography",
    description: "Professional wedding photography with 10+ years experience",
    location: { city: "Colombo", address: "123 Main Street, Colombo 03" },
    contact: { phone: "+94 77 123 4567", email: "info@elegantphoto.com" },
    services: ["Wedding Photography", "Pre-wedding Shoots", "Engagement Photos"],
    portfolio: ["/placeholder.svg?height=300&width=400"],
    pricing: { startingPrice: 50000, currency: "LKR" },
    rating: 4.8,
    reviewCount: 120,
    isVerified: true,
    isActive: true,
    featured: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    _id: "2",
    name: "Royal Catering",
    businessName: "Royal Catering Services",
    category: "Catering",
    description: "Premium wedding catering with traditional and modern cuisine",
    location: { city: "Kandy", address: "456 Hill Street, Kandy" },
    contact: { phone: "+94 77 234 5678", email: "orders@royalcatering.com" },
    services: ["Wedding Catering", "Buffet Service", "Custom Menus"],
    portfolio: ["/placeholder.svg?height=300&width=400"],
    pricing: { startingPrice: 30000, currency: "LKR" },
    rating: 4.6,
    reviewCount: 85,
    isVerified: true,
    isActive: true,
    featured: false,
    createdAt: "2024-01-02T00:00:00.000Z"
  },
  {
    _id: "3",
    name: "Dream Decorations",
    businessName: "Dream Wedding Decorations",
    category: "Decoration",
    description: "Creative wedding decorations and floral arrangements",
    location: { city: "Galle", address: "789 Fort Road, Galle" },
    contact: { phone: "+94 77 345 6789", email: "hello@dreamdecor.com" },
    services: ["Wedding Decorations", "Floral Arrangements", "Lighting"],
    portfolio: ["/placeholder.svg?height=300&width=400"],
    pricing: { startingPrice: 40000, currency: "LKR" },
    rating: 4.7,
    reviewCount: 95,
    isVerified: true,
    isActive: true,
    featured: true,
    createdAt: "2024-01-03T00:00:00.000Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const isVerified = searchParams.get("isVerified")

    let query: Record<string, any> = { isActive: true }

    if (vendorId) {
      const vendor = await (Vendor as any).findById(vendorId).populate('owner', 'firstName lastName email')
      if (!vendor) {
        return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: vendor })
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' }
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query['pricing.startingPrice'] = {}
      if (minPrice) query['pricing.startingPrice'].$gte = Number(minPrice)
      if (maxPrice) query['pricing.startingPrice'].$lte = Number(maxPrice)
    }

    if (isVerified !== null && isVerified !== undefined) {
      query.isVerified = isVerified === 'true'
    }

    const vendors = await (Vendor as any).find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: vendors,
      count: vendors.length,
      filters: { category, location, minPrice, maxPrice, isVerified },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.businessName || !body.category || !body.description || !body.location || !body.contact || !body.pricing) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "businessName", "category", "description", "location", "contact", "pricing"],
        },
        { status: 400 },
      )
    }

    const vendor = await Vendor.create({
      ...body,
      owner: session.user.id
    })

    const response = NextResponse.json(
      {
        success: true,
        data: vendor,
        message: "Vendor created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create vendor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    
    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 })
    }

    const body = await request.json()
    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, owner: session.user.id },
      body,
      { new: true }
    )

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    
    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 })
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, owner: session.user.id },
      { isActive: false },
      { new: true }
    )

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Vendor deactivated successfully" })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { vendorId, services, portfolio, packages, availability, onboardingComplete } = body
    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Missing vendorId" }, { status: 400 })
    }
    const update: any = {}
    if (services) update.services = services
    if (portfolio) update.portfolio = portfolio
    if (packages) update["pricing.packages"] = packages
    if (availability) update.availability = availability
    if (typeof onboardingComplete === 'boolean') update.onboardingComplete = onboardingComplete
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { $set: update }, { new: true })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    console.error("Error updating vendor onboarding:", error)
    return NextResponse.json({ success: false, error: "Failed to update vendor onboarding", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}