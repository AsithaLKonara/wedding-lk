import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthenticatedUser, requireAuth, requireAdmin, requireVendor, requireWeddingPlanner } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching review by ID:', id);

    await connectDB();
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    console.log('✅ Review found:', review.id);

    return NextResponse.json({
      success: true,
      review
    });

    } catch (error) {
    console.error('❌ Error fetching review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating review:', id);

    const updatedReview = await Review.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedReview) {
      return NextResponse.json({
        success: false,
        error: 'Review not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Review updated successfully:', updatedReview.id);

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: 'Review updated successfully'
    });

    } catch (error) {
    console.error('❌ Error updating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting review:', id);

    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Review not found or deletion failed'
      }, { status: 404 });
    }

    console.log('✅ Review deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

    } catch (error) {
    console.error('❌ Error deleting review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
