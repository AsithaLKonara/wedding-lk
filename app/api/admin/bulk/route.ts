import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Vendor, Venue, Booking, Payment, Review, Message, Favorite } from '@/lib/models';
import { withAuth, requireAdmin } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// POST - Bulk operations for admin management
async function bulkOperations(request: NextRequest) {
  try {

    await connectDB();

    const body = await request.json();
    const { operation, entity, ids, data } = body;

    if (!operation || !entity || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Operation, entity, and ids array are required' },
        { status: 400 }
      );
    }

    let result;
    let model;

    // Determine the model based on entity
    switch (entity) {
      case 'users':
        model = User;
        break;
      case 'vendors':
        model = Vendor;
        break;
      case 'venues':
        model = Venue;
        break;
      case 'bookings':
        model = Booking;
        break;
      case 'payments':
        model = Payment;
        break;
      case 'reviews':
        model = Review;
        break;
      case 'messages':
        model = Message;
        break;
      case 'favorites':
        model = Favorite;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid entity type' },
          { status: 400 }
        );
    }

    // Perform bulk operation
    switch (operation) {
      case 'delete':
        result = await bulkDelete(model, ids);
        break;
      case 'update':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for update operation' },
            { status: 400 }
          );
        }
        result = await bulkUpdate(model, ids, data);
        break;
      case 'activate':
        result = await bulkActivate(model, ids);
        break;
      case 'deactivate':
        result = await bulkDeactivate(model, ids);
        break;
      case 'verify':
        result = await bulkVerify(model, ids);
        break;
      case 'unverify':
        result = await bulkUnverify(model, ids);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${operation} operation completed`,
      result
    });

  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(
  rateLimitConfigs.sensitive,
  withAuth(bulkOperations, requireAdmin())
);

// Helper functions for bulk operations
async function bulkDelete(model: any, ids: string[]) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      isActive: false,
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

async function bulkUpdate(model: any, ids: string[], data: any) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      ...data,
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

async function bulkActivate(model: any, ids: string[]) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      isActive: true,
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

async function bulkDeactivate(model: any, ids: string[]) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      isActive: false,
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

async function bulkVerify(model: any, ids: string[]) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      isVerified: true,
      verifiedAt: new Date(),
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

async function bulkUnverify(model: any, ids: string[]) {
  const result = await model.updateMany(
    { _id: { $in: ids } },
    { 
      isVerified: false,
      verifiedAt: null,
      updatedAt: new Date()
    }
  );
  return { modifiedCount: result.modifiedCount };
}

// GET - Get bulk operation statistics
async function getBulkStats(request: NextRequest) {
  try {

    await connectDB();

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');

    let stats = {};

    if (!entity) {
      // Get overall statistics
      stats = {
        users: {
          total: await User.countDocuments(),
          active: await User.countDocuments({ isActive: true }),
          verified: await User.countDocuments({ isVerified: true }),
          vendors: await User.countDocuments({ role: 'vendor' }),
          planners: await User.countDocuments({ role: 'wedding_planner' }),
          admins: await User.countDocuments({ role: 'admin' })
        },
        vendors: {
          total: await Vendor.countDocuments(),
          active: await Vendor.countDocuments({ isActive: true }),
          verified: await Vendor.countDocuments({ isVerified: true })
        },
        venues: {
          total: await Venue.countDocuments(),
          active: await Venue.countDocuments({ isActive: true })
        },
        bookings: {
          total: await Booking.countDocuments(),
          pending: await Booking.countDocuments({ status: 'pending' }),
          confirmed: await Booking.countDocuments({ status: 'confirmed' }),
          completed: await Booking.countDocuments({ status: 'completed' })
        },
        payments: {
          total: await Payment.countDocuments(),
          pending: await Payment.countDocuments({ status: 'pending' }),
          completed: await Payment.countDocuments({ status: 'completed' })
        },
        reviews: {
          total: await Review.countDocuments(),
          verified: await Review.countDocuments({ isVerified: true })
        },
        messages: {
          total: await Message.countDocuments(),
          unread: await Message.countDocuments({ isRead: false })
        }
      };
    } else {
      // Get specific entity statistics
      switch (entity) {
        case 'users':
          stats = {
            total: await User.countDocuments(),
            active: await User.countDocuments({ isActive: true }),
            verified: await User.countDocuments({ isVerified: true }),
            vendors: await User.countDocuments({ role: 'vendor' }),
            planners: await User.countDocuments({ role: 'wedding_planner' }),
            admins: await User.countDocuments({ role: 'admin' })
          };
          break;
        case 'vendors':
          stats = {
            total: await Vendor.countDocuments(),
            active: await Vendor.countDocuments({ isActive: true }),
            verified: await Vendor.countDocuments({ isVerified: true })
          };
          break;
        case 'venues':
          stats = {
            total: await Venue.countDocuments(),
            active: await Venue.countDocuments({ isActive: true })
          };
          break;
        case 'bookings':
          stats = {
            total: await Booking.countDocuments(),
            pending: await Booking.countDocuments({ status: 'pending' }),
            confirmed: await Booking.countDocuments({ status: 'confirmed' }),
            completed: await Booking.countDocuments({ status: 'completed' })
          };
          break;
        case 'payments':
          stats = {
            total: await Payment.countDocuments(),
            pending: await Payment.countDocuments({ status: 'pending' }),
            completed: await Payment.countDocuments({ status: 'completed' })
          };
          break;
        case 'reviews':
          stats = {
            total: await Review.countDocuments(),
            verified: await Review.countDocuments({ isVerified: true })
          };
          break;
        case 'messages':
          stats = {
            total: await Message.countDocuments(),
            unread: await Message.countDocuments({ isRead: false })
          };
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid entity type' },
            { status: 400 }
          );
      }
    }

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching bulk statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.api,
  withAuth(getBulkStats, requireAdmin())
);
