import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Quick test without database connections
    const results = {
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasRedisUrl: !!process.env.REDIS_URL,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasMongoUri: !!process.env.MONGODB_URI,
      },
      services: {
        redis: process.env.REDIS_URL ? 'configured' : 'missing',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
        cloudinary: process.env.CLOUDINARY_API_KEY ? 'configured' : 'missing',
        email: process.env.SMTP_USER ? 'configured' : 'missing',
        database: process.env.MONGODB_URI ? 'configured' : 'missing',
      },
      status: 'healthy'
    };

    return NextResponse.json({
      success: true,
      message: 'Quick test completed',
      ...results
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Quick test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime
    }, { status: 500 });
  }
}
