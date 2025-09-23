import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/lib/models/task"

export async function GET(request: NextRequest) {
  try {

    await connectDB()
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")
    const plannerId = searchParams.get("plannerId")
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")

    let query: any = {}

    if (taskId) {
      const task = await (Task as any).findById(taskId).populate('plannerId', 'firstName lastName').populate('clientId', 'name email')
      if (!task) {
        return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: task })
    }

    if (plannerId) {
      query.plannerId = plannerId
    }

    if (clientId) {
      query.clientId = clientId
    }

    if (status) {
      query.status = status
    }

    const tasks = await (Task as any).find(query)
      .populate('plannerId', 'firstName lastName')
      .populate('clientId', 'name email')
      .sort({ date: 1 })
      .limit(100)

    const response = NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tasks",
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
    if (!body.task || !body.date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["task", "date"],
        },
        { status: 400 },
      )
    }

    const task = await (Task as any).create({
      ...body,
      plannerId: body.plannerId || "temp-planner-id"
    })

    const response = NextResponse.json(
      {
        success: true,
        data: task,
        message: "Task created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create task",
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
    const taskId = searchParams.get("taskId")
    
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    const body = await request.json()
    
    // Only the planner who created the task can update it
    const task = await (Task as any).findOneAndUpdate(
      { _id: taskId, plannerId: body.plannerId || "temp-planner-id" },
      body,
      { new: true }
    )

    if (!task) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {

    await connectDB()
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")
    
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    // Only the planner who created the task can delete it
    const task = await (Task as any).findOneAndDelete({
      _id: taskId,
      plannerId: body.plannerId || "temp-planner-id"
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
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