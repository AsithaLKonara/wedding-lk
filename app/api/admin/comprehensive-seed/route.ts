import { NextRequest, NextResponse } from 'next/server';
import { resetAndSeedDatabase } from '@/lib/comprehensive-seeder';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    const result = await resetAndSeedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Comprehensive database seeding completed successfully!',
      data: {
        totalUsers: result.users.length,
        vendors: result.vendors.length,
        planners: result.planners.length,
        admins: result.admins.length
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Comprehensive seeding failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Comprehensive database seeding failed',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Comprehensive Database Seeding API',
    description: 'POST to this endpoint to seed the database with comprehensive test data',
    endpoints: {
      'POST /api/admin/comprehensive-seed': 'Seed database with comprehensive data'
    },
    data: {
      users: '5 regular users (couples)',
      vendors: '5 vendors with business profiles',
      planners: '5 wedding planners with professional profiles',
      admins: '2 admin users',
      venues: '3 wedding venues',
      packages: '3 service packages',
      testimonials: '3 testimonials',
      bookings: '3 bookings',
      reviews: '3 reviews'
    }
  });
}
