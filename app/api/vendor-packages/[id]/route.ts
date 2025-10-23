import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VendorPackage } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packageId = params.id;

    console.log('📊 Fetching vendor package:', packageId);

    const packageData = await VendorPackage.findById(packageId)
      .populate('vendor', 'businessName email phone rating location')
      .populate('services.service', 'name description')
      .lean();

    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found'
      }, { status: 404 });
    }

    console.log('✅ Vendor package fetched successfully');

    return NextResponse.json({
      success: true,
      package: packageData
    });

  } catch (error) {
    console.error('❌ Error fetching vendor package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const packageId = params.id;
    const updateData = await request.json();

    console.log('📝 Updating vendor package:', packageId);

    // Find package
    const packageData = await VendorPackage.findById(packageId);
    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found'
      }, { status: 404 });
    }

    // Check permissions
    const canEdit = packageData.vendor.toString() === session.user.id || 
                   session.user.role === 'admin';

    if (!canEdit) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to edit this package'
      }, { status: 403 });
    }

    // Update package
    const updatedPackage = await VendorPackage.findByIdAndUpdate(
      packageId,
      {
        name: updateData.name,
        description: updateData.description,
        category: updateData.category,
        subcategory: updateData.subcategory,
        services: updateData.services,
        pricing: updateData.pricing,
        availability: updateData.availability,
        requirements: updateData.requirements,
        media: updateData.media,
        features: updateData.features,
        tags: updateData.tags,
        isFeatured: updateData.isFeatured,
        isPopular: updateData.isPopular,
        sortOrder: updateData.sortOrder,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('vendor', 'businessName email phone rating location')
      .populate('services.service', 'name description')
      .lean();

    console.log('✅ Vendor package updated successfully');

    return NextResponse.json({
      success: true,
      package: updatedPackage,
      message: 'Package updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating vendor package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const packageId = params.id;

    console.log('📝 Deleting vendor package:', packageId);

    // Find package
    const packageData = await VendorPackage.findById(packageId);
    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found'
      }, { status: 404 });
    }

    // Check permissions
    const canDelete = packageData.vendor.toString() === session.user.id || 
                     session.user.role === 'admin';

    if (!canDelete) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions to delete this package'
      }, { status: 403 });
    }

    // Soft delete package
    await VendorPackage.findByIdAndUpdate(packageId, {
      isActive: false,
      updatedAt: new Date()
    });

    console.log('✅ Vendor package deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting vendor package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
