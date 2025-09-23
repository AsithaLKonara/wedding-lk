import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")
    const email = searchParams.get("email")

    let query = {}

    if (userId) {
      const user = await (User as any).findById(userId)
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: user })
    }

    if (userType) {
      query = { userType }
    }

    if (email) {
      query = { email }
    }

    const users = await (User as any).find(query)
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
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
    const { firstName, lastName, email, password, userType, phone } = body

    if (!firstName || !lastName || !email || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["firstName", "lastName", "email", "password", "userType"],
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await (User as any).findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists with this email",
        },
        { status: 409 },
      )
    }

    const user = await (User as any).create({
      firstName,
      lastName,
      email,
      password,
      userType,
      phone: phone || "",
      isActive: true,
      isVerified: false,
    })

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.resetPasswordToken
    delete userResponse.resetPasswordExpiry

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
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
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const body = await request.json()
    
    // Remove password from update if present
    if (body.password) {
      delete body.password
    }

    const user = await (User as any).findByIdAndUpdate(userId, body, { new: true })
      .select('-password -resetPasswordToken -resetPasswordExpiry')

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user",
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
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const user = await (User as any).findByIdAndUpdate(userId, { isActive: false }, { new: true })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User deactivated successfully" })
  } catch (error) {
    console.error("Error deactivating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to deactivate user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}