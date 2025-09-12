import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Dispute } from '@/lib/models/dispute';
import { User } from '@/lib/models/user';
import { Booking } from '@/lib/models/booking';
import { withAuth, requireUser, requireAdmin } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get disputes (user or admin)
async function getDisputes(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const isAdmin = user.role === 'admin';

    await connectDB();

    // Build query based on user role
    const query: any = {};
    
    if (isAdmin) {
      // Admin can see all disputes or filter by assigned admin
      if (searchParams.get('assignedToMe') === 'true') {
        query.assignedAdminId = user.id;
      }
    } else {
      // Regular users can only see their own disputes
      query.$or = [
        { complainantId: user.id },
        { respondentId: user.id }
      ];
    }
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const disputes = await Dispute.find(query)
      .populate('complainantId', 'name email avatar')
      .populate('respondentId', 'name email avatar')
      .populate('assignedAdminId', 'name email')
      .populate('bookingId', 'bookingDate amount status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Dispute.countDocuments(query);

    // Get statistics for admin dashboard
    let statistics = null;
    if (isAdmin) {
      const stats = await Dispute.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
            escalated: { $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] } },
            overdue: { $sum: { $cond: ['$isOverdue', 1, 0] } },
            avgResolutionTime: {
              $avg: {
                $cond: [
                  { $ne: ['$closedAt', null] },
                  { $subtract: ['$closedAt', '$createdAt'] },
                  null
                ]
              }
            }
          }
        }
      ]);
      
      statistics = stats[0] || {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        escalated: 0,
        overdue: 0,
        avgResolutionTime: 0
      };
    }

    return NextResponse.json({
      success: true,
      disputes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics
    });

  } catch (error) {
    console.error('Error fetching disputes:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch disputes'
    }, { status: 500 });
  }
}

// POST - Create a new dispute
async function createDispute(request: NextRequest) {
  try {
    const user = (request as any).user;
    const {
      respondentId,
      type,
      title,
      description,
      category,
      requestedResolution,
      requestedAmount,
      currency = 'LKR',
      bookingId,
      paymentId,
      vendorId,
      evidence
    } = await request.json();

    // Validate required fields
    if (!respondentId || !type || !title || !description || !category || !requestedResolution) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectDB();

    // Verify respondent exists
    const respondent = await User.findById(respondentId);
    if (!respondent) {
      return NextResponse.json({
        success: false,
        error: 'Respondent not found'
      }, { status: 404 });
    }

    // Check if user has already disputed this respondent for the same booking
    if (bookingId) {
      const existingDispute = await Dispute.findOne({
        complainantId: user.id,
        respondentId,
        bookingId,
        status: { $in: ['open', 'in_progress', 'escalated'] }
      });

      if (existingDispute) {
        return NextResponse.json({
          success: false,
          error: 'You have already filed a dispute for this booking'
        }, { status: 400 });
      }
    }

    // Create dispute
    const dispute = await Dispute.createDispute(
      user.id,
      respondentId,
      {
        type,
        title,
        description,
        category,
        requestedResolution,
        requestedAmount,
        currency,
        bookingId,
        paymentId,
        vendorId,
        evidence: evidence || []
      }
    );

    // Send notification to respondent
    // await NotificationService.createNotification(
    //   respondentId,
    //   'dispute',
    //   'New Dispute Filed',
    //   `A dispute has been filed against you: ${title}`,
    //   {
    //     actionUrl: `/disputes/${dispute._id}`,
    //     data: { disputeId: dispute._id }
    //   }
    // );

    return NextResponse.json({
      success: true,
      dispute: {
        id: dispute._id,
        disputeId: dispute.disputeId,
        title: dispute.title,
        status: dispute.status,
        priority: dispute.priority,
        createdAt: dispute.createdAt,
        resolutionDeadline: dispute.resolutionDeadline
      },
      message: 'Dispute created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating dispute:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create dispute'
    }, { status: 500 });
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.api,
  withAuth(getDisputes, requireUser())
);

export const POST = withRateLimit(
  rateLimitConfigs.api,
  withAuth(createDispute, requireUser())
);

