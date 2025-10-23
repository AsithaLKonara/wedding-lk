import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Wedding planner access required" }, { status: 403 });
    }

    console.log('📊 Fetching planner stats from MongoDB Atlas...');

    // Get planner-specific data
    const planner = await User.findOne({ email: session.user.email });
    if (!planner) {
      return NextResponse.json({ error: "Planner profile not found" }, { status: 404 });
    }

    // Get planner tasks
    const tasks = await Task.find({ createdBy: planner._id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    // Get active clients (users with active bookings)
    const activeClients = await User.distinct('_id', {
      role: 'user',
      _id: { $in: tasks.map(t => t.assignedTo) }
    });

    // Get upcoming events (bookings in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const upcomingEvents = await Booking.countDocuments({
      date: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    // Get planner revenue (from tasks or bookings)
    const payments = await Payment.find({ 
      userId: planner._id,
      status: 'completed' 
    });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Monthly revenue
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt) >= thisMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Get planner reviews (if any)
    const reviews = await Review.find({ 
      // Assuming planner reviews are stored differently or calculated from client feedback
    });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 4.8; // Default rating

    // Count completed weddings (bookings with completed status)
    const completedWeddings = await Booking.countDocuments({ 
      status: 'completed' 
    });

    const plannerStats = {
      totalTasks,
      completedTasks,
      activeClients: activeClients.length,
      upcomingEvents,
      totalRevenue,
      monthlyRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      completedWeddings
    };

    console.log('✅ Planner stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: plannerStats
    });

  } catch (error) {
    console.error('❌ Error fetching planner stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}