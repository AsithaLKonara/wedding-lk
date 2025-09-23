import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Review } from "@/lib/models/review"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")
    const vendorId = searchParams.get("vendorId")
    const userId = searchParams.get("userId")

    let query = {}

    if (reviewId) {
      const review = await (Review as any).findById(reviewId)
      if (!review) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: review })
    }

    if (vendorId) {
      query = { vendorId }
    }

    if (userId) {
      query = { userId }
    }

    const reviews = await (Review as any).find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
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
    const { vendorId, userId, rating, comment, title } = body

    if (!vendorId || !userId || !rating) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["vendorId", "userId", "rating"],
        },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Rating must be between 1 and 5",
        },
        { status: 400 },
      )
    }

    const review = await (Review as any).create({
      vendorId,
      userId,
      rating: Number(rating),
      comment: comment || "",
      title: title || "",
      isVerified: false,
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create review",
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
    const reviewId = searchParams.get("reviewId")
    
    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const review = await (Review as any).findByIdAndUpdate(reviewId, body, { new: true })

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update review",
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
    const reviewId = searchParams.get("reviewId")
    
    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 })
    }

    const review = await (Review as any).findByIdAndDelete(reviewId)

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete review",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}