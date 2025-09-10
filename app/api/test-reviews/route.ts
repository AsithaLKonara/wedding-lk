import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Test 1: Direct database query
    const db = mongoose.connection.db;
    const directReviews = await db.collection('reviews').find({}).limit(5).toArray();
    
    // Test 2: Mongoose model query
    const { Review } = await import('@/lib/models');
    const mongooseReviews = await Review.find({}).limit(5).lean();
    
    return NextResponse.json({
      success: true,
      directDbQuery: {
        count: directReviews.length,
        sample: directReviews[0] || null
      },
      mongooseQuery: {
        count: mongooseReviews.length,
        sample: mongooseReviews[0] || null
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
