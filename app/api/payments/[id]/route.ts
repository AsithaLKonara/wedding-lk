import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching payment by ID:', id);

    const payment = LocalDatabase.readById('payments', id);

    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    console.log('✅ Payment found:', payment.id);

    return NextResponse.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating payment:', id);

    const updatedPayment = LocalDatabase.update('payments', id, updates);

    if (!updatedPayment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Payment updated successfully:', updatedPayment.id);

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Payment updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting payment:', id);

    const deleted = LocalDatabase.delete('payments', id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found or deletion failed'
      }, { status: 404 });
    }

    console.log('✅ Payment deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Payment deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
