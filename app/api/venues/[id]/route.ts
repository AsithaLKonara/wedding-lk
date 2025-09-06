import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthenticatedUser, requireAuth, requireAdmin, requireVendor, requireWeddingPlanner } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching venue by ID:', id);

    await connectDB();
    const venue = await Venue.findById(id);

    if (!venue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found'
      }, { status: 404 });
    }

    console.log('✅ Venue found:', venue.name);

    return NextResponse.json({
      success: true,
      venue
    });

    } catch (error) {
    console.error('❌ Error fetching venue:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch venue',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating venue:', id);

    const updatedVenue = await Venue.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedVenue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Venue updated successfully:', updatedVenue.name);

    return NextResponse.json({
      success: true,
      venue: updatedVenue,
      message: 'Venue updated successfully'
    });

    } catch (error) {
    console.error('❌ Error updating venue:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update venue',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting venue:', id);

    const deleted = await Venue.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found or deletion failed'
      }, { status: 404 });
    }

    console.log('✅ Venue deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Venue deleted successfully'
    });

    } catch (error) {
    console.error('❌ Error deleting venue:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete venue',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}