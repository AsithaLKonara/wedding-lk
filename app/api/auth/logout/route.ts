import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-config';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    // In NextAuth, logout is handled client-side
    // This endpoint is mainly for server-side cleanup if needed
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error: unknown) {
    console.error('❌ Logout error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
