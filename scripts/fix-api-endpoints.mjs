#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const API_DIR = './app/api';

// Fix venues API to use database
const venuesApiContent = `import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get("venueId")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minCapacity = searchParams.get("minCapacity")
    const maxCapacity = searchParams.get("maxCapacity")

    let query = { isActive: true }

    if (venueId) {
      const venue = await Venue.findById(venueId).populate('owner', 'firstName lastName email')
      if (!venue) {
        return NextResponse.json({ success: false, error: "Venue not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: venue })
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {}
      if (minPrice) query['pricing.basePrice'].$gte = Number(minPrice)
      if (maxPrice) query['pricing.basePrice'].$lte = Number(maxPrice)
    }

    if (minCapacity || maxCapacity) {
      query['capacity.max'] = {}
      if (minCapacity) query['capacity.max'].$gte = Number(minCapacity)
      if (maxCapacity) query['capacity.max'].$lte = Number(maxCapacity)
    }

    const venues = await Venue.find(query)
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: venues,
      count: venues.length,
      filters: { category, location, minPrice, maxPrice, minCapacity, maxCapacity }
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.location || !body.capacity || !body.pricing) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "description", "location", "capacity", "pricing"],
        },
        { status: 400 },
      )
    }

    const venue = await Venue.create({
      ...body,
      owner: session.user.id
    })

    const response = NextResponse.json(
      {
        success: true,
        data: venue,
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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get("venueId")
    
    if (!venueId) {
      return NextResponse.json({ error: "Venue ID required" }, { status: 400 })
    }

    const body = await request.json()
    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, owner: session.user.id },
      body,
      { new: true }
    )

    if (!venue) {
      return NextResponse.json({ error: "Venue not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: venue })
  } catch (error) {
    console.error("Error updating venue:", error)
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 })
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
    const venueId = searchParams.get("venueId")
    
    if (!venueId) {
      return NextResponse.json({ error: "Venue ID required" }, { status: 400 })
    }

    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, owner: session.user.id },
      { isActive: false },
      { new: true }
    )

    if (!venue) {
      return NextResponse.json({ error: "Venue not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Venue deactivated successfully" })
  } catch (error) {
    console.error("Error deleting venue:", error)
    return NextResponse.json({ error: "Failed to delete venue" }, { status: 500 })
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
}`;

// Fix users API to use database
const usersApiContent = `import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")

    let query = {}
    if (userId) {
      query._id = userId
    }
    if (userType) {
      query.userType = userType
    }

    const users = await User.find(query)
      .select('-password -twoFactorSecret -verificationToken')
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
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

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.password || !body.userType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["firstName", "lastName", "email", "password", "userType"],
        },
        { status: 400 },
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    const user = await User.create({
      ...body,
      password: hashedPassword
    })

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }

    const response = NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: "User created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || session.user.id
    const body = await request.json()

    // Remove sensitive fields that shouldn't be updated via API
    delete body.password
    delete body.twoFactorSecret
    delete body.verificationToken

    const user = await User.findByIdAndUpdate(
      userId,
      body,
      { new: true }
    ).select('-password -twoFactorSecret -verificationToken')

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
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
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Only allow users to delete their own account or admin to delete any
    if (userId !== session.user.id && session.user.userType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await User.findByIdAndDelete(userId)

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
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
}`;

// Write the fixed API files
fs.writeFileSync(path.join(API_DIR, 'venues', 'route.ts'), venuesApiContent);
fs.writeFileSync(path.join(API_DIR, 'users', 'route.ts'), usersApiContent);

console.log('✅ Fixed venues and users API endpoints to use database integration');
console.log('📝 Next: Run the comprehensive test to verify all endpoints work correctly');
