import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import mongoose from "mongoose"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vendor ID format" }, { status: 400 })
    }
    
    await connectDB()

    const vendor = await Vendor.findById(id)
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Get vendor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vendor ID format" }, { status: 400 })
    }
    
    await connectDB()

    const update = await request.json()
    const vendor = await Vendor.findByIdAndUpdate(id, update, { new: true })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Update vendor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vendor ID format" }, { status: 400 })
    }
    
    await connectDB()

    const result = await Vendor.findByIdAndDelete(id)
    if (!result) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete vendor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 