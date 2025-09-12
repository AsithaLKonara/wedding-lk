import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    console.log('Session API called');
    
    // Return a simple session response
    const session = {
      user: null,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    console.log('Session response:', session);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { 
        error: 'Session error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
