import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock authentication response
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: 'test-user-id',
        email: body.email,
        name: 'Test User'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auth endpoint is working'
  });
}
