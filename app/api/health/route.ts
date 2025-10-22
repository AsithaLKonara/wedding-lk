import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { testRedisConnection } from '@/lib/redis';
import { testCloudinaryConnection } from '@/lib/cloudinary';
import { testEmailConnection } from '@/lib/email';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    };
    redis?: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    };
    external_apis: {
      status: 'healthy' | 'unhealthy';
      services: {
        [key: string]: {
          status: 'healthy' | 'unhealthy';
          responseTime: number;
          error?: string;
        };
      };
    };
  };
  metrics: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    requests: {
      total: number;
      errors: number;
      errorRate: number;
    };
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthCheck: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    checks: {
      database: {
        status: 'unhealthy',
        responseTime: 0,
      },
      external_apis: {
        status: 'healthy',
        services: {},
      },
    },
    metrics: {
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
      requests: {
        total: 0,
        errors: 0,
        errorRate: 0,
      },
    },
  };

  try {
    // Check database connection
    const dbStartTime = Date.now();
    try {
      const db = await connectDB();
      // Use proper mongoose ping method
      await db.connection.db.admin().ping();
      healthCheck.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStartTime,
      };
    } catch (dbError) {
      healthCheck.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStartTime,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
      };
      healthCheck.status = 'degraded';
    }

    // Check Redis connection
    const redisStartTime = Date.now();
    try {
      const redisResult = await testRedisConnection();
      healthCheck.checks.redis = {
        status: redisResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - redisStartTime,
        error: redisResult.error
      };
      if (!redisResult.success) {
        healthCheck.status = 'degraded';
      }
    } catch (redisError) {
      healthCheck.checks.redis = {
        status: 'unhealthy',
        responseTime: Date.now() - redisStartTime,
        error: redisError instanceof Error ? redisError.message : 'Unknown Redis error',
      };
      healthCheck.status = 'degraded';
    }

    // Check external APIs
    const externalApis = [
      { 
        name: 'stripe', 
        url: 'https://api.stripe.com/v1/charges',
        headers: process.env.STRIPE_SECRET_KEY ? {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        } : {}
      },
    ];

    for (const api of externalApis) {
      const apiStartTime = Date.now();
      try {
        // Skip API check if no credentials are provided
        if (Object.keys(api.headers).length === 0) {
          healthCheck.checks.external_apis.services[api.name] = {
            status: 'unhealthy',
            responseTime: 0,
            error: 'API credentials not configured',
          };
          continue;
        }

        const response = await fetch(api.url, {
          method: 'HEAD',
          headers: api.headers,
          signal: AbortSignal.timeout(5000),
        });
        
        healthCheck.checks.external_apis.services[api.name] = {
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: Date.now() - apiStartTime,
          error: response.ok ? undefined : `HTTP ${response.status}`,
        };
      } catch (apiError) {
        healthCheck.checks.external_apis.services[api.name] = {
          status: 'unhealthy',
          responseTime: Date.now() - apiStartTime,
          error: apiError instanceof Error ? apiError.message : 'Unknown API error',
        };
      }
    }

    // Check Cloudinary
    const cloudinaryStartTime = Date.now();
    try {
      const cloudinaryResult = await testCloudinaryConnection();
      healthCheck.checks.external_apis.services.cloudinary = {
        status: cloudinaryResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - cloudinaryStartTime,
        error: cloudinaryResult.error
      };
    } catch (cloudinaryError) {
      healthCheck.checks.external_apis.services.cloudinary = {
        status: 'unhealthy',
        responseTime: Date.now() - cloudinaryStartTime,
        error: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error',
      };
    }

    // Check Email Service
    const emailStartTime = Date.now();
    try {
      const emailResult = await testEmailConnection();
      healthCheck.checks.external_apis.services.email = {
        status: emailResult.success ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - emailStartTime,
        error: emailResult.error
      };
    } catch (emailError) {
      healthCheck.checks.external_apis.services.email = {
        status: 'unhealthy',
        responseTime: Date.now() - emailStartTime,
        error: emailError instanceof Error ? emailError.message : 'Unknown email error',
      };
    }

    // Set external APIs status
    const unhealthyApis = Object.values(healthCheck.checks.external_apis.services)
      .filter(service => service.status === 'unhealthy');
    
    if (unhealthyApis.length > 0) {
      healthCheck.checks.external_apis.status = 'unhealthy';
      if (healthCheck.status === 'healthy') {
        healthCheck.status = 'degraded';
      }
    }

    // Get memory usage
    const memUsage = process.memoryUsage();
    healthCheck.metrics.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    };

    // Get request metrics (simplified)
    healthCheck.metrics.requests = {
      total: 0, // Would need to implement request counting
      errors: 0, // Would need to implement error counting
      errorRate: 0,
    };

    // Determine overall status
    if (healthCheck.checks.database.status === 'unhealthy') {
      healthCheck.status = 'unhealthy';
    }

    const responseTime = Date.now() - startTime;
    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, { 
      status: statusCode,
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'X-Health-Status': healthCheck.status,
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    healthCheck.status = 'unhealthy';
    healthCheck.checks.database = {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(healthCheck, { 
      status: 503,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-Health-Status': 'unhealthy',
      },
    });
  }
}