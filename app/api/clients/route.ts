import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Client } from "@/lib/models/client"

export async function GET(request: NextRequest) {
  try {

    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const plannerId = searchParams.get("plannerId")

    let query: any = {}

    if (clientId) {
      const client = await (Client as any).findById(clientId).populate('plannerId', 'firstName lastName email')
      if (!client) {
        return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: client })
    }

    if (plannerId) {
      query.plannerId = plannerId
    }

    const clients = await (Client as any).find(query)
      .populate('plannerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100)

    const response = NextResponse.json({
      success: true,
      data: clients,
      count: clients.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch clients",
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
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name"],
        },
        { status: 400 },
      )
    }

    const client = await (Client as any).create({
      ...body,
      plannerId: body.plannerId || "temp-planner-id"
    })

    const response = NextResponse.json(
      {
        success: true,
        data: client,
        message: "Client created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create client",
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
    const clientId = searchParams.get("clientId")
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    const body = await request.json()
    
    // Only the planner who created the client can update it
    const client = await (Client as any).findOneAndUpdate(
      { _id: clientId, plannerId: body.plannerId || "temp-planner-id" },
      body,
      { new: true }
    )

    if (!client) {
      return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: client })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {

    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    // Only the planner who created the client can delete it
    const client = await (Client as any).findOneAndDelete({
      _id: clientId,
      plannerId: body.plannerId || "temp-planner-id"
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Client deleted successfully" })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
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