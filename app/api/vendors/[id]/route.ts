import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthenticatedUser, requireAuth, requireAdmin, requireVendor, requireWeddingPlanner } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching vendor by ID:', id);

    await connectDB();
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found'
      }, { status: 404 });
    }

    console.log('✅ Vendor found:', vendor.businessName);

    return NextResponse.json({
      success: true,
      vendor
    });

    } catch (error) {
    console.error('❌ Error fetching vendor:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating vendor:', id);

    const updatedVendor = await Vendor.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedVendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Vendor updated successfully:', updatedVendor.businessName);

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      message: 'Vendor updated successfully'
    });

    } catch (error) {
    console.error('❌ Error updating vendor:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update vendor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting vendor:', id);

    const deleted = await Vendor.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found or deletion failed'
      }, { status: 404 });
    }

    console.log('✅ Vendor deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully'
    });

    } catch (error) {
    console.error('❌ Error deleting vendor:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete vendor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}