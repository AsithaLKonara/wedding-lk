import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    
    // Test direct database queries
    const reviewsCount = await db.collection('reviews').countDocuments({ status: 'approved' });
    const notificationsCount = await db.collection('notifications').countDocuments();
    const bookingsCount = await db.collection('bookings').countDocuments();
    const vendorsCount = await db.collection('vendors').countDocuments();
    
    // Get sample data
    const sampleReview = await db.collection('reviews').findOne({ status: 'approved' });
    const sampleNotification = await db.collection('notifications').findOne();
    const sampleBooking = await db.collection('bookings').findOne();
    
    return NextResponse.json({
      success: true,
      counts: {
        reviews: reviewsCount,
        notifications: notificationsCount,
        bookings: bookingsCount,
        vendors: vendorsCount
      },
      samples: {
        review: sampleReview ? {
          id: sampleReview._id,
          status: sampleReview.status,
          title: sampleReview.title,
          overallRating: sampleReview.overallRating
        } : null,
        notification: sampleNotification ? {
          id: sampleNotification._id,
          type: sampleNotification.type,
          title: sampleNotification.title
        } : null,
        booking: sampleBooking ? {
          id: sampleBooking._id,
          status: sampleBooking.status,
          date: sampleBooking.date
        } : null
      },
      connection: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
