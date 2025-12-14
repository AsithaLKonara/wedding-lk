import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ services: [] })
    }

    // Dynamically import auth-related modules
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    // Dynamically import the Service model
    const { Service } = await import("@/lib/models/service")
    
    const vendorId = request.nextUrl.searchParams.get("vendorId") || session.user.id
    const services = await Service.find({ vendorId }).sort({ createdAt: -1 })
    return NextResponse.json({ services })
  } catch (error) {
    console.error("Services GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Service unavailable during build" }, { status: 503 })
    }

    // Dynamically import auth-related modules
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    // Dynamically import the Service model
    const { Service } = await import("@/lib/models/service")
    
    const body = await request.json()
    const { name, price, description } = body
    if (!name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const service = await Service.create({
      vendorId: session.user.id,
      name,
      price,
      description,
    })
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error("Services POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Service unavailable during build" }, { status: 503 })
    }

    // Dynamically import auth-related modules
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    // Dynamically import the Service model
    const { Service } = await import("@/lib/models/service")
    
    const body = await request.json()
    const { id, name, price, description } = body
    if (!id) {
      return NextResponse.json({ error: "Missing service id" }, { status: 400 })
    }
    const service = await Service.findOneAndUpdate(
      { _id: id, vendorId: session.user.id },
      { name, price, description },
      { new: true }
    )
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error("Services PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Service unavailable during build" }, { status: 503 })
    }

    // Dynamically import auth-related modules
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    // Dynamically import the Service model
    const { Service } = await import("@/lib/models/service")
    
    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: "Missing service id" }, { status: 400 })
    }
    const result = await Service.deleteOne({ _id: id, vendorId: session.user.id })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Services DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 