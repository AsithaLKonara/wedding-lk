import { NextRequest, NextResponse } from 'next/server';
import { resetAndSeedDatabase } from '@/lib/database-cleanup-and-seed';
import { Middleware } from '@/lib/rbac';

async function handler(request: NextRequest) {
  try {
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

export const POST = Middleware.requireAdmin(handler);

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Database reset endpoint',
    usage: 'POST /api/admin/reset-database',
    warning: 'This will clear ALL data and create new seed data'
  });
}
