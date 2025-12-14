import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models';
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    console.log('📊 Fetching booking by ID:', id);

    await connectDB();
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    console.log('✅ Booking found:', booking.id);

    return NextResponse.json({
      success: true,
      booking
    });

    } catch (error) {
    console.error('❌ Error fetching booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log('📝 Updating booking:', id);

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedBooking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Booking updated successfully:', updatedBooking.id);

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    });

    } catch (error) {
    console.error('❌ Error updating booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Deleting booking:', id);

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found or deletion failed'
      }, { status: 404 });
    }

    console.log('✅ Booking deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

    } catch (error) {
    console.error('❌ Error deleting booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
