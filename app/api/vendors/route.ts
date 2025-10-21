import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models';
import { vendorSchemas } from '@/lib/validations/api-validators';
import { handleApiError, createSuccessResponse, createPaginatedResponse } from '@/lib/utils/error-handler';

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
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        vendors: [
          {
            _id: 'mock-vendor-1',
            businessName: 'Elegant Photography Studio',
            description: 'Professional wedding photography services',
            category: 'photography',
            location: {
              address: '456 Photography Lane, Colombo',
              city: 'Colombo',
              coordinates: { lat: 6.9271, lng: 79.8612 }
            },
            contact: {
              phone: '+94771234567',
              email: 'info@elegantphotography.com',
              website: 'https://elegantphotography.com'
            },
            services: ['Wedding Photography', 'Engagement Shoots', 'Pre-wedding'],
            rating: { average: 4.8, count: 45 },
            isActive: true,
            isVerified: true
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    }
    
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

    // Validate input data
    const validation = vendorSchemas.create.safeParse(vendorData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: validatedData.email });
    if (existingVendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor with this email already exists'
      }, { status: 409 });
    }

    // Create vendor
    const newVendor = new Vendor({
      ...validatedData,
      isVerified: false,
      isActive: true,
      rating: {
        average: 0,
        count: 0
      },
      services: validatedData.services || [],
      images: [],
      socialMedia: validatedData.contact.socialMedia || {}
    });

    await newVendor.save();

    console.log('✅ Vendor created successfully:', newVendor.businessName);

    return createSuccessResponse(newVendor, 'Vendor created successfully', 201);

  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    return handleApiError(error, '/api/vendors');
  }
}

// PUT - Update vendor
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('id');
    const vendorData = await request.json();

    if (!vendorId) {
      return NextResponse.json({
        success: false,
        error: 'Vendor ID is required'
      }, { status: 400 });
    }

    console.log('📝 Updating vendor:', vendorId);

    // Validate input data
    const validation = vendorSchemas.update.safeParse(vendorData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found'
      }, { status: 404 });
    }

    // Update vendor
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Vendor updated successfully:', updatedVendor.businessName);

    return createSuccessResponse(updatedVendor, 'Vendor updated successfully');

  } catch (error) {
    console.error('❌ Error updating vendor:', error);
    return handleApiError(error, '/api/vendors');
  }
}

// DELETE - Delete vendor (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('id');

    if (!vendorId) {
      return NextResponse.json({
        success: false,
        error: 'Vendor ID is required'
      }, { status: 400 });
    }

    console.log('📝 Deleting vendor:', vendorId);

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found'
      }, { status: 404 });
    }

    // Soft delete - set isActive to false
    await Vendor.findByIdAndUpdate(vendorId, {
      isActive: false,
      updatedAt: new Date()
    });

    console.log('✅ Vendor deleted successfully:', vendor.businessName);

    return createSuccessResponse(null, 'Vendor deleted successfully');

  } catch (error) {
    console.error('❌ Error deleting vendor:', error);
    return handleApiError(error, '/api/vendors');
  }
}