import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get("venueId")
    const location = searchParams.get("location")
    const minCapacity = searchParams.get("minCapacity")
    const maxCapacity = searchParams.get("maxCapacity")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let query: Record<string, any> = { isActive: true }

    if (venueId) {
      const venue = await Venue.findById(venueId)
      if (!venue) {
        return NextResponse.json({ success: false, error: "Venue not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: venue })
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minCapacity || maxCapacity) {
      query.capacity = {}
      if (minCapacity) query.capacity.$gte = Number(minCapacity)
      if (maxCapacity) query.capacity.$lte = Number(maxCapacity)
    }

    if (minPrice || maxPrice) {
      query.pricing = {}
      if (minPrice) query.pricing.$gte = Number(minPrice)
      if (maxPrice) query.pricing.$lte = Number(maxPrice)
    }

    const venues = await Venue.find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: venues,
      count: venues.length,
      filters: { location, minCapacity, maxCapacity, minPrice, maxPrice },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching venues:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch venues",
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

    // Validate required fields
    if (!body.name || !body.location || !body.capacity || !body.pricing) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "location", "capacity", "pricing"],
        },
        { status: 400 },
      )
    }

    const newVenue = await Venue.create({
      name: body.name,
      description: body.description || "",
      location: body.location,
      capacity: Number(body.capacity),
      pricing: body.pricing,
      amenities: body.amenities || [],
      images: body.images || [],
      contact: body.contact || {},
      rating: { average: 0, count: 0 },
      isActive: true,
      isVerified: false,
      featured: false,
    })

    const response = NextResponse.json(
      {
        success: true,
        data: newVenue,
        message: "Venue created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating venue:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create venue",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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
