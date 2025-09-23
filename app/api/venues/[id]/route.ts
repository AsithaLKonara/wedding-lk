import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const venue = await Venue.findById(id)
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json({ venue })
  } catch (error) {
    console.error("Get venue error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const update = await request.json()
    const venue = await Venue.findByIdAndUpdate(id, update, { new: true })

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json({ venue })
  } catch (error) {
    console.error("Update venue error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const result = await Venue.findByIdAndDelete(id)
    if (!result) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete venue error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
