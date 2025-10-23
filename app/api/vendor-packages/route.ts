import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VendorPackage, Vendor } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const vendorId = searchParams.get('vendorId');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('📊 Fetching vendor packages...');

    // Build query
    let query: any = { isActive: true };

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) {
        query['pricing.basePrice'].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query['pricing.basePrice'].$lte = parseFloat(maxPrice);
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort criteria
    let sortCriteria: any = {};
    if (sortBy === 'price') {
      sortCriteria['pricing.basePrice'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sortCriteria['reviews.averageRating'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'popularity') {
      sortCriteria.isPopular = -1;
      sortCriteria['reviews.totalReviews'] = -1;
    } else {
      sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query with pagination
    const [packages, total] = await Promise.all([
      VendorPackage.find(query)
        .populate('vendor', 'businessName email phone rating location')
        .populate('services.service', 'name description')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .lean(),
      VendorPackage.countDocuments(query)
    ]);

    console.log(`✅ Found ${packages.length} vendor packages`);

    return NextResponse.json({
      success: true,
      packages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching vendor packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!token?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Check if user is a vendor
    if (session.user.role !== 'vendor') {
      return NextResponse.json({
        success: false,
        error: 'Only vendors can create packages'
      }, { status: 403 });
    }

    const packageData = await request.json();
    
    console.log('📝 Creating vendor package...');

    // Validate required fields
    if (!packageData.name || !packageData.description || !packageData.category) {
      return NextResponse.json({
        success: false,
        error: 'Name, description, and category are required'
      }, { status: 400 });
    }

    // Create vendor package
    const newPackage = new VendorPackage({
      vendor: session.user.id,
      name: packageData.name,
      description: packageData.description,
      category: packageData.category,
      subcategory: packageData.subcategory,
      services: packageData.services || [],
      pricing: {
        basePrice: packageData.pricing?.basePrice || 0,
        discountedPrice: packageData.pricing?.discountedPrice,
        discountPercentage: packageData.pricing?.discountPercentage,
        currency: packageData.pricing?.currency || 'LKR',
        isNegotiable: packageData.pricing?.isNegotiable || false,
        paymentTerms: packageData.pricing?.paymentTerms || {
          depositPercentage: 50,
          paymentSchedule: []
        }
      },
      availability: {
        isAvailable: packageData.availability?.isAvailable ?? true,
        availableFrom: packageData.availability?.availableFrom || new Date(),
        availableUntil: packageData.availability?.availableUntil,
        maxBookings: packageData.availability?.maxBookings || 1,
        currentBookings: 0,
        advanceBookingDays: packageData.availability?.advanceBookingDays || 30,
        blackoutDates: packageData.availability?.blackoutDates || []
      },
      requirements: {
        minGuests: packageData.requirements?.minGuests || 1,
        maxGuests: packageData.requirements?.maxGuests || 1000,
        venueRequirements: packageData.requirements?.venueRequirements || [],
        equipmentProvided: packageData.requirements?.equipmentProvided || [],
        equipmentRequired: packageData.requirements?.equipmentRequired || [],
        setupTime: packageData.requirements?.setupTime || 2,
        breakdownTime: packageData.requirements?.breakdownTime || 1
      },
      media: packageData.media || [],
      features: packageData.features || [],
      reviews: {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: {
          five: 0,
          four: 0,
          three: 0,
          two: 0,
          one: 0
        }
      },
      tags: packageData.tags || [],
      isActive: true,
      isFeatured: packageData.isFeatured || false,
      isPopular: packageData.isPopular || false,
      sortOrder: packageData.sortOrder || 0
    });

    await newPackage.save();

    // Populate the response
    const populatedPackage = await VendorPackage.findById(newPackage._id)
      .populate('vendor', 'businessName email phone rating location')
      .populate('services.service', 'name description')
      .lean();

    console.log('✅ Vendor package created successfully:', newPackage._id);

    return NextResponse.json({
      success: true,
      package: populatedPackage,
      message: 'Package created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating vendor package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
