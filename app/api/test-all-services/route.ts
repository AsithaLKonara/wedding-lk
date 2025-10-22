import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { testRedisConnection } from '@/lib/redis';
import { testCloudinaryConnection } from '@/lib/cloudinary';
import { testEmailConnection } from '@/lib/email';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const results: any = {
    timestamp: new Date().toISOString(),
    responseTime: 0,
    services: {},
    overallStatus: 'unknown'
  };

  try {
    // Test Database
    const dbStartTime = Date.now();
    try {
      const db = await connectDB();
      await db.connection.db.admin().ping();
      results.services.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStartTime,
        message: 'Database connected successfully'
      };
    } catch (dbError) {
      results.services.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStartTime,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      };
    }

    // Test Redis
    const redisStartTime = Date.now();
    try {
      const redisResult = await testRedisConnection();
      results.services.redis = {
        status: redisResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - redisStartTime,
        message: redisResult.success ? 'Redis connected successfully' : redisResult.error
      };
    } catch (redisError) {
      results.services.redis = {
        status: 'unhealthy',
        responseTime: Date.now() - redisStartTime,
        error: redisError instanceof Error ? redisError.message : 'Unknown Redis error'
      };
    }

    // Test Cloudinary
    const cloudinaryStartTime = Date.now();
    try {
      const cloudinaryResult = await testCloudinaryConnection();
      results.services.cloudinary = {
        status: cloudinaryResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - cloudinaryStartTime,
        message: cloudinaryResult.success ? 'Cloudinary connected successfully' : cloudinaryResult.error
      };
    } catch (cloudinaryError) {
      results.services.cloudinary = {
        status: 'unhealthy',
        responseTime: Date.now() - cloudinaryStartTime,
        error: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error'
      };
    }

    // Test Email
    const emailStartTime = Date.now();
    try {
      const emailResult = await testEmailConnection();
      results.services.email = {
        status: emailResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - emailStartTime,
        message: emailResult.success ? 'Email service connected successfully' : emailResult.error
      };
    } catch (emailError) {
      results.services.email = {
        status: 'unhealthy',
        responseTime: Date.now() - emailStartTime,
        error: emailError instanceof Error ? emailError.message : 'Unknown email error'
      };
    }

    // Test Stripe
    const stripeStartTime = Date.now();
    try {
      const stripeResponse = await fetch('https://api.stripe.com/v1/charges', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      });
      results.services.stripe = {
        status: stripeResponse.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - stripeStartTime,
        message: stripeResponse.ok ? 'Stripe API connected successfully' : `HTTP ${stripeResponse.status}`
      };
    } catch (stripeError) {
      results.services.stripe = {
        status: 'unhealthy',
        responseTime: Date.now() - stripeStartTime,
        error: stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'
      };
    }

    // Calculate overall status
    const healthyServices = Object.values(results.services).filter((service: any) => service.status === 'healthy').length;
    const totalServices = Object.keys(results.services).length;
    
    if (healthyServices === totalServices) {
      results.overallStatus = 'healthy';
    } else if (healthyServices > 0) {
      results.overallStatus = 'degraded';
    } else {
      results.overallStatus = 'unhealthy';
    }

    results.responseTime = Date.now() - startTime;
    results.summary = {
      totalServices,
      healthyServices,
      unhealthyServices: totalServices - healthyServices,
      healthPercentage: Math.round((healthyServices / totalServices) * 100)
    };

    return NextResponse.json({
      success: true,
      message: 'All services tested successfully',
      ...results
    });

  } catch (error) {
    results.responseTime = Date.now() - startTime;
    results.overallStatus = 'unhealthy';
    results.error = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      message: 'Service testing failed',
      ...results
    }, { status: 500 });
  }
}
