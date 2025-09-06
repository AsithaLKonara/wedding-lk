import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999');
    const search = searchParams.get('search');

    console.log('📊 Fetching packages from MongoDB Atlas...');

    // Build query
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    if (minPrice > 0) {
      query.price = { $gte: minPrice };
    }

    if (maxPrice < 999999999) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [packages, total] = await Promise.all([
      // For now, we'll create packages dynamically from venues and vendors
      // In a real implementation, you'd have a Package model
      createDynamicPackages(query, skip, limit),
      Promise.resolve(50) // Mock total count
    ]);

    console.log(`✅ Found ${packages.length} packages`);

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
    console.error('❌ Error fetching packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || !['vendor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: "Vendor or Admin access required" }, { status: 403 });
    }

    const packageData = await request.json();
    
    console.log('📝 Creating new package...');

    // Validate required fields
    if (!packageData.name || !packageData.price || !packageData.category) {
      return NextResponse.json({
        success: false,
        error: 'Name, price, and category are required'
      }, { status: 400 });
    }

    // Create package (storing in a generic way for now)
    const newPackage = {
      _id: `pkg_${Date.now()}`,
      name: packageData.name,
      description: packageData.description || '',
      price: packageData.price,
      originalPrice: packageData.originalPrice || packageData.price,
      category: packageData.category,
      features: packageData.features || [],
      includes: packageData.includes || [],
      venues: packageData.venues || [],
      vendors: packageData.vendors || [],
      rating: { average: 0, count: 0 },
      isActive: true,
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real implementation, you'd save to a Package collection
    // For now, we'll store in a generic way
    console.log('✅ Package created successfully:', newPackage._id);

    return NextResponse.json({
      success: true,
      package: newPackage,
      message: 'Package created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to create dynamic packages from venues and vendors
async function createDynamicPackages(query: any, skip: number, limit: number) {
  try {
    // Fetch venues and vendors to create packages
    const [venues, vendors] = await Promise.all([
      Venue.find({ isActive: true }).limit(10).lean(),
      Vendor.find({ isActive: true }).limit(10).lean()
    ]);

    const packages = [];

    // Create packages based on venues
    venues.slice(skip, skip + limit).forEach((venue, index) => {
      const packagePrice = venue.pricing?.basePrice || 100000;
      const originalPrice = Math.round(packagePrice * 1.3);
      
      packages.push({
        _id: `pkg_venue_${venue._id}`,
        name: `${venue.name} Wedding Package`,
        description: `Complete wedding package at ${venue.name} featuring premium services`,
        price: packagePrice,
        originalPrice: originalPrice,
        category: 'venue',
        features: [
          'Venue rental for ceremony & reception',
          'Basic decoration included',
          'Sound system & lighting',
          'Bridal suite access',
          'Parking for guests',
          'Wedding coordinator'
        ],
        includes: [
          'Venue rental',
          'Basic decoration',
          'Sound system',
          'Lighting setup'
        ],
        venues: [{
          _id: venue._id,
          name: venue.name,
          rating: venue.rating?.average || 4.5,
          image: venue.images?.[0] || '/placeholder.svg'
        }],
        vendors: [],
        rating: venue.rating || { average: 4.5, count: 0 },
        isActive: true,
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt
      });
    });

    // Create packages based on vendors
    vendors.slice(0, Math.min(5, limit - packages.length)).forEach((vendor, index) => {
      const packagePrice = vendor.pricing?.startingPrice || 50000;
      const originalPrice = Math.round(packagePrice * 1.2);
      
      packages.push({
        _id: `pkg_vendor_${vendor._id}`,
        name: `${vendor.businessName} Service Package`,
        description: `Professional ${vendor.category} services by ${vendor.businessName}`,
        price: packagePrice,
        originalPrice: originalPrice,
        category: vendor.category,
        features: [
          `Professional ${vendor.category} services`,
          'High-quality equipment',
          'Experienced team',
          'Flexible timing',
          'Setup and cleanup',
          'Insurance coverage'
        ],
        includes: [
          'Service delivery',
          'Equipment setup',
          'Professional team',
          'Cleanup service'
        ],
        venues: [],
        vendors: [{
          _id: vendor._id,
          name: vendor.businessName,
          category: vendor.category,
          rating: vendor.rating?.average || 4.5
        }],
        rating: vendor.rating || { average: 4.5, count: 0 },
        isActive: true,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt
      });
    });

    return packages.slice(0, limit);
  } catch (error) {
    console.error('Error creating dynamic packages:', error);
    return [];
  }
}
