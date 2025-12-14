import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Booking, Task } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Wedding planner access required" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Wedding planner access required" }, { status: 403 });
    }

    console.log('📊 Fetching planner timeline from MongoDB Atlas...');

    // Get planner's tasks and bookings to create timeline
    const tasks = await Task.find({ createdBy: user._id })
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .lean();

    const bookings = await Booking.find({})
      .populate('client', 'name email')
      .populate('vendor', 'businessName')
      .sort({ date: 1 })
      .lean();

    // Format timeline events from tasks and bookings
    const timelineEvents: Array<{
      id: string;
      clientId: string;
      clientName: string;
      event: string;
      date: Date | string;
      time: string;
      status: string;
      category: string;
      notes?: string;
    }> = [];

    // Add task events
    tasks.forEach(task => {
      timelineEvents.push({
        id: `task-${task._id}`,
        clientId: task.assignedTo?._id?.toString() || '',
        clientName: task.assignedTo?.name || 'Unknown Client',
        event: task.title,
        date: task.dueDate,
        time: task.dueDate ? new Date(task.dueDate).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'TBD',
        status: task.status === 'completed' ? 'completed' : 
                task.status === 'in_progress' ? 'in_progress' : 'upcoming',
        category: task.category || 'general',
        notes: task.description
      });
    });

    // Add booking events
    bookings.forEach(booking => {
      timelineEvents.push({
        id: `booking-${booking._id}`,
        clientId: booking.client?._id?.toString() || '',
        clientName: booking.client?.name || 'Unknown Client',
        event: `${booking.service?.name || 'Service'} - ${booking.vendor?.businessName || 'Vendor'}`,
        date: booking.date,
        time: booking.date ? new Date(booking.date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'TBD',
        status: booking.status === 'completed' ? 'completed' : 
                booking.status === 'confirmed' ? 'upcoming' : 'pending',
        category: 'booking',
        notes: booking.notes
      });
    });

    // Sort timeline by date
    const plannerTimeline = timelineEvents
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20); // Limit to 20 most recent events

    console.log('✅ Planner timeline fetched successfully');

    return NextResponse.json({
      success: true,
      timeline: plannerTimeline
    });

  } catch (error) {
    console.error('❌ Error fetching planner timeline:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner timeline',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
