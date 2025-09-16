import { NextRequest, NextResponse } from 'next/server';
import { createSimpleSeedData } from '@/lib/simple-seed-data';

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

    console.log('🚀 Starting simple database seeding...');
    
    // Run the simple database seeding
    const users = await createSimpleSeedData();
    
    return NextResponse.json({
      success: true,
      message: 'Simple database seeding completed successfully!',
      data: {
        users: users.length,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('❌ Simple database seeding failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Simple database seeding failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Simple database seeding endpoint',
    usage: 'POST /api/admin/simple-seed?adminKey=weddinglk-admin-2024',
    warning: 'This will create simple seed data'
  });
}
