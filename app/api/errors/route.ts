import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ErrorLog } from '@/lib/error-handler';

// Error logging endpoint
export async function POST(request: NextRequest) {
  try {
    const errorData: ErrorLog = await request.json();
    
    // Validate required fields
    if (!errorData.errorId || !errorData.message || !errorData.timestamp) {
      return NextResponse.json(
        { success: false, message: 'Missing required error fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const errorsCollection = db.collection('error_logs');

    // Add additional metadata
    const enrichedErrorData = {
      ...errorData,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
      loggedAt: new Date(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Insert error log
    await errorsCollection.insertOne(enrichedErrorData);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', {
        errorId: errorData.errorId,
        message: errorData.message,
        severity: errorData.severity,
        type: errorData.type,
      });
    }

    // Send to external monitoring service if configured
    if (process.env.SENTRY_DSN) {
      try {
        // Send to Sentry
        await fetch('https://sentry.io/api/0/projects/your-project/store/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${process.env.SENTRY_DSN}`,
          },
          body: JSON.stringify({
            message: errorData.message,
            level: errorData.severity === 'critical' ? 'error' : 'warning',
            tags: {
              errorId: errorData.errorId,
              type: errorData.type,
              sessionId: errorData.sessionId,
            },
            extra: {
              stack: errorData.stack,
              componentStack: errorData.componentStack,
              context: errorData.context,
            },
            user: {
              id: errorData.userId,
              sessionId: errorData.sessionId,
            },
            request: {
              url: errorData.url,
              userAgent: errorData.userAgent,
            },
          }),
        });
      } catch (sentryError) {
        console.error('Failed to send to Sentry:', sentryError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Error logged successfully',
      errorId: errorData.errorId 
    });

  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}

// Get error logs (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (implement your auth logic here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await connectDB();
    const errorsCollection = db.collection('error_logs');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.loggedAt = {};
      if (startDate) query.loggedAt.$gte = new Date(startDate);
      if (endDate) query.loggedAt.$lte = new Date(endDate);
    }

    // Get error logs
    const errors = await errorsCollection
      .find(query)
      .sort({ loggedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await errorsCollection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: errors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Failed to fetch error logs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}