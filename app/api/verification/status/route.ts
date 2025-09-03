import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';

// Mock verification status data
const mockVerificationStatus = {
  userId: 'user123',
  status: 'pending',
  documents: [
    {
      id: 'doc1',
      type: 'id_proof',
      status: 'pending',
      uploadedAt: new Date()
    }
  ],
  lastUpdated: new Date()
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || session.user.id;

    // Check if user is admin or requesting their own status
    if (targetUserId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // In real app, this would query the database
    // For now, return mock data
    const status = {
      ...mockVerificationStatus,
      userId: targetUserId
    };

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve verification status' },
      { status: 500 }
    );
  }
} 