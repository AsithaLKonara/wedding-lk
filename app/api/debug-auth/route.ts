import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Auth - Environment Check');
    
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? 'Set' : 'Missing',
      FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? 'Set' : 'Missing',
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };

    console.log('📋 Environment Variables:', envCheck);

    // Test database connection
    let dbStatus = 'Not tested';
    try {
      const { connectDB } = await import('@/lib/db');
      const dbConnection = await connectDB();
      dbStatus = dbConnection ? 'Connected' : 'Failed';
    } catch (error) {
      dbStatus = `Error: ${error.message}`;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      message: 'Debug information collected'
    });

  } catch (error) {
    console.error('❌ Debug Auth Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
