import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();

    const subscription = await request.json();
    const userId = user.id;

    // Store push subscription in database
    // You might want to create a PushSubscription model for this
    const subscriptionData = {
      userId,
      subscription,
      createdAt: new Date(),
      isActive: true
    };

    // For now, we'll store it in a simple collection
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'Database not connected'
      }, { status: 500 });
    }
    await db.collection('push_subscriptions').insertOne(subscriptionData);

    console.log('Push subscription stored for user:', userId);

    return NextResponse.json({
      success: true,
      message: 'Push subscription stored successfully'
    });

  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to store push subscription',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Push subscription endpoint',
    status: 'active'
  });
}
