import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    console.log('📊 Fetching vendors from MongoDB...');

    // Build query
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vendor.countDocuments(query)
    ]);

    console.log(`✅ Found ${vendors.length} vendors`);

    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
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
    await connectDB();

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
    const existingVendor = await Vendor.findOne({ email: vendorData.email });
    if (existingVendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor with this email already exists'
      }, { status: 400 });
    }

    // Create vendor
    const newVendor = new Vendor({
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

    await newVendor.save();

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