import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'NextAuth is no longer used - this endpoint is deprecated. Use custom auth instead.'
    });
  } catch (error) {
    console.error('Test NextAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

