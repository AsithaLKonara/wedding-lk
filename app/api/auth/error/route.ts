import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  console.log('🚨 AUTH ERROR API CALLED');
  console.log('📋 Error details:', { error, url: request.url });
  
  // Return a simple error response
  return NextResponse.json({
    error: error || 'Unknown authentication error',
    message: 'Authentication failed',
    timestamp: new Date().toISOString()
  }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  console.log('🚨 AUTH ERROR POST API CALLED');
  console.log('📋 Error details:', body);
  
  return NextResponse.json({
    error: body.error || 'Unknown authentication error',
    message: 'Authentication failed',
    timestamp: new Date().toISOString()
  }, { status: 400 });
}
