import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();

    const subscription = await request.json();
    const userId = token.userId || token.sub;

    // Store push subscription in database
    // You might want to create a PushSubscription model for this
    const subscriptionData = {
      userId,
      subscription,
      createdAt: new Date(),
      isActive: true
    };

    // For now, we'll store it in a simple collection
    const db = require('mongoose').connection.db;
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
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Push subscription endpoint',
    status: 'active'
  });
}
