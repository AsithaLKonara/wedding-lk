import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching booking by ID:', id);

    const booking = LocalDatabase.readById('bookings', id);

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating booking:', id);

    const updatedBooking = LocalDatabase.update('bookings', id, updates);

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting booking:', id);

    const deleted = LocalDatabase.delete('bookings', id);

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
