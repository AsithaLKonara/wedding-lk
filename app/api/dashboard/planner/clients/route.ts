import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Booking, Payment, Task } from '@/lib/models';

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

    console.log('📊 Fetching planner clients from MongoDB Atlas...');

    // Get clients (users) that have tasks assigned by this planner
    const tasks = await Task.find({ createdBy: user._id });
    const clientIds = [...new Set(tasks.map(task => task.assignedTo.toString()))];
    
    const clients = await User.find({ 
      _id: { $in: clientIds },
      role: 'user' 
    }).lean();

    // Format clients with task statistics
    const plannerClients = await Promise.all(clients.map(async (client) => {
      const clientTasks = tasks.filter(task => 
        task.assignedTo.toString() === String(client._id)
      );
      
      const tasksCompleted = clientTasks.filter(task => 
        task.status === 'completed'
      ).length;

      // Get client's bookings for wedding date and budget info
      const bookings = await Booking.find({ client: client._id });
      const weddingDate = bookings.length > 0 ? bookings[0].date : null;
      
      // Calculate total spent from payments
      const payments = await Payment.find({ userId: client._id });
      const budget = payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        id: String(client._id),
        name: client.name,
        email: client.email,
        phone: client.phone || 'Not provided',
        weddingDate: weddingDate || 'Not set',
        budget: budget,
        location: client.location?.city || 'Not specified',
        status: clientTasks.length > 0 ? 'active' : 'inactive',
        tasksCompleted,
        totalTasks: clientTasks.length,
        lastContact: client.updatedAt || client.createdAt,
        rating: 4.5 // Default rating - could be calculated from reviews
      };
    }));

    console.log('✅ Planner clients fetched successfully');

    return NextResponse.json({
      success: true,
      clients: plannerClients
    });

  } catch (error) {
    console.error('❌ Error fetching planner clients:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner clients',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
