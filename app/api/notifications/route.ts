import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Notification } from "@/lib/models/notification"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const isRead = searchParams.get("isRead")
    const limit = parseInt(searchParams.get("limit") || "20")

    let query: any = {}

    if (userId) {
      query.user = userId
    }

    if (type) {
      query.type = type
    }

    if (category) {
      query.category = category
    }

    if (isRead !== null && isRead !== undefined) {
      query.isRead = isRead === "true"
    }

    const notifications = await (Notification as any).find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)

    const unreadCount = await (Notification as any).countDocuments({
      ...query,
      isRead: false,
    })

    const response = NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
      unreadCount,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
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
    const { user, title, message, type, category, priority, data, expiresAt } = body

    if (!user || !title || !message || !type || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["user", "title", "message", "type", "category"],
        },
        { status: 400 },
      )
    }

    const notification = await (Notification as any).create({
      user,
      title,
      message,
      type,
      category,
      priority: priority || "medium",
      data: data || {},
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, data: notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create notification",
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
    const notificationId = searchParams.get("notificationId")
    const action = searchParams.get("action") // "read", "unread", "mark_sent"

    if (!notificationId || !action) {
      return NextResponse.json({ success: false, error: "Notification ID and action are required" }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case "read":
        updateData = { isRead: true, readAt: new Date() }
        break
      case "unread":
        updateData = { isRead: false, readAt: null }
        break
      case "mark_sent":
        updateData = { isSent: true, sentAt: new Date() }
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    const notification = await (Notification as any).findByIdAndUpdate(notificationId, updateData, { new: true })

    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notification",
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
    const notificationId = searchParams.get("notificationId")

    if (!notificationId) {
      return NextResponse.json({ success: false, error: "Notification ID is required" }, { status: 400 })
    }

    const notification = await (Notification as any).findByIdAndDelete(notificationId)

    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete notification",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
