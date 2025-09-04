import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    console.log('📊 Fetching vendors from local database...');

    let vendors = LocalDatabase.read('vendors');

    // Filter by category if provided
    if (category) {
      vendors = vendors.filter((vendor: any) => vendor.category === category);
    }

    // Search functionality
    if (search) {
      vendors = LocalDatabase.search('vendors', search, ['businessName', 'description', 'category']);
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('vendors', page, limit);

    console.log(`✅ Found ${vendors.length} vendors`);

    return NextResponse.json({
      success: true,
      vendors: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
      }
    });

  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendors',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json();
    
    console.log('📝 Creating new vendor...');

    // Validate required fields
    if (!vendorData.businessName || !vendorData.ownerName || !vendorData.email || !vendorData.category) {
      return NextResponse.json({
        success: false,
        error: 'Business name, owner name, email, and category are required'
      }, { status: 400 });
    }

    // Check if vendor already exists
    const existingVendors = LocalDatabase.readByField('vendors', 'email', vendorData.email);
    if (existingVendors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Vendor with this email already exists'
      }, { status: 400 });
    }

    // Create vendor
    const newVendor = LocalDatabase.create('vendors', {
      ...vendorData,
      isVerified: false,
      isActive: true,
      rating: {
        average: 0,
        count: 0
      },
      services: vendorData.services || [],
      images: vendorData.images || [],
      socialMedia: vendorData.socialMedia || {}
    });

    if (!newVendor) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create vendor'
      }, { status: 500 });
    }

    console.log('✅ Vendor created successfully:', newVendor.businessName);

    return NextResponse.json({
      success: true,
      vendor: newVendor,
      message: 'Vendor created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create vendor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}