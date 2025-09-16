import { NextRequest, NextResponse } from 'next/server';
import { resetAndSeedDatabase } from '@/lib/database-cleanup-and-seed';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (you can add proper authentication here)
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    
    // Simple admin key check (replace with proper authentication)
    if (adminKey !== 'weddinglk-admin-2024') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin key required.' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting database reset and seeding...');
    
    // Run the database reset and seeding
    await resetAndSeedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset and seeding completed successfully!',
      data: {
        users: 5,
        vendors: 5,
        weddingPlanners: 5,
        admins: 5,
        totalCollections: 48,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Database reset failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Database reset endpoint',
    usage: 'POST /api/admin/reset-database?adminKey=weddinglk-admin-2024',
    warning: 'This will clear ALL data and create new seed data'
  });
}
