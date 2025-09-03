import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import { Task } from "@/lib/models/task"
import { User } from "@/lib/models/user"
import { getServerSession } from '@/lib/auth-utils';

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, dueDate, priority, category, assignedTo } = body

    if (!title || !dueDate) {
      return NextResponse.json({
        error: 'Title and due date are required'
      }, { status: 400 })
    }

    // Validate assigned user if provided
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo)
      if (!assignedUser) {
        return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 })
      }
    }

    // Create new task
    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: new Date(dueDate),
      priority: priority || 'medium',
      status: 'pending',
      category: category || 'general',
      assignedTo: assignedTo || user._id,
      createdBy: user._id,
      isActive: true
    })

    await task.save()

    // Populate related data
    await task.populate('assignedTo', 'name email')
    await task.populate('createdBy', 'name email')

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task created successfully'
    })

  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Task creation failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/tasks - Get tasks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const assignedTo = searchParams.get('assignedTo')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query based on user role
    const query: any = { isActive: true }
    
    if (user.role === 'admin') {
      // Admin can see all tasks
    } else if (user.role === 'vendor') {
      // Vendor can see tasks assigned to them or created by them
      query.$or = [
        { assignedTo: user._id },
        { createdBy: user._id }
      ]
    } else {
      // Regular user can see tasks assigned to them or created by them
      query.$or = [
        { assignedTo: user._id },
        { createdBy: user._id }
      ]
    }

    if (status) {
      query.status = status
    }

    if (priority) {
      query.priority = priority
    }

    if (category) {
      query.category = category
    }

    if (assignedTo) {
      query.assignedTo = assignedTo
    }

    // Get tasks with pagination
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, priority: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)

    // Get total count
    const total = await Task.countDocuments(query)

    // Get status counts
    const statusCounts = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusSummary = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {} as Record<string, number>)

    // Get priority counts
    const priorityCounts = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])

    const prioritySummary = priorityCounts.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {} as Record<string, number>)

    // Get overdue tasks count
    const overdueCount = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] }
    })

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      summary: {
        status: statusSummary,
        priority: prioritySummary,
        overdue: overdueCount
      }
    })

  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tasks',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/tasks - Update task
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { taskId, title, description, dueDate, priority, status, category, assignedTo } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Find task and check permissions
    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has permission to update this task
    if (user.role !== 'admin' && 
        task.createdBy.toString() !== user._id.toString() &&
        task.assignedTo.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to update this task' }, { status: 403 })
    }

    // Validate assigned user if provided
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo)
      if (!assignedUser) {
        return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 })
      }
    }

    // Update task fields
    const updateData: any = {}
    if (title) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (priority) updateData.priority = priority
    if (status) updateData.status = status
    if (category) updateData.category = category
    if (assignedTo) updateData.assignedTo = assignedTo

    // Set completed date if status is completed
    if (status === 'completed' && task.status !== 'completed') {
      updateData.completedAt = new Date()
    }

    // Set status change timestamp
    if (status && status !== task.status) {
      updateData.statusChangedAt = new Date()
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    ).populate('assignedTo createdBy')

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    })

  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update task',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Find task and check permissions
    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has permission to delete this task
    if (user.role !== 'admin' && task.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this task' }, { status: 403 })
    }

    // Soft delete task
    await Task.findByIdAndUpdate(taskId, {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: user._id
    })

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })

  } catch (error) {
    console.error('Task deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete task',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 