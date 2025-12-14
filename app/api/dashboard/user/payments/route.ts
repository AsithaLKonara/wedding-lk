import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Payment } from "@/lib/models"
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { MongoQuery } from '@/lib/types/mongodb-queries';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user ID
    const userId = user.id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: MongoQuery<{ user: string; status?: string }> = { user: userId }
    if (status) query.status = status

    // Get payments with pagination
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Payment.countDocuments(query)

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching user payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch user payments" },
      { status: 500 }
    )
  }
} 