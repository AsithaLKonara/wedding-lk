import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      collections: collections.map(col => col.name),
      count: collections.length
    });
  } catch (error) {
    console.error('Debug DB error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database info' },
      { status: 500 }
    );
  }
}

