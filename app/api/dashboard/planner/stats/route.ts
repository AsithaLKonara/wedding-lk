import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/lib/models/task"
import { User } from "@/lib/models/user"
import { Booking } from "@/lib/models/booking"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get planner stats
    const totalTasks = await Task.countDocuments({ type: 'wedding_planning' })
    const completedTasks = await Task.countDocuments({ 
      type: 'wedding_planning', 
      status: 'completed' 
    })
    const activeClients = await User.countDocuments({ 
      role: 'user', 
      isActive: true 
    })
    
    // Get upcoming events (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const upcomingEvents = await Booking.countDocuments({
      date: { $gte: new Date(), $lte: thirtyDaysFromNow },
      status: { $in: ['confirmed', 'pending'] }
    })

    const stats = {
      totalTasks,
      completedTasks,
      activeClients,
      upcomingEvents
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching planner stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch planner stats" },
      { status: 500 }
    )
  }
} 