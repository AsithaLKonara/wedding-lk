// Cache Demo API for WeddingLK
// Demonstrates enhanced caching capabilities

import { NextRequest, NextResponse } from 'next/server';
import { enhancedCacheManager } from '@/lib/enhanced-cache-manager';
import { loadBalancer } from '@/lib/load-balancer';
import { SecurityMiddleware } from '@/lib/security-middleware';

export async function GET(request: NextRequest) {
  try {
    // Security validation
    const security = SecurityMiddleware.getInstance();
    const rateLimit = security.checkRateLimit(request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown');
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'demo';
    const key = searchParams.get('key') || 'demo-key';
    const ttl = parseInt(searchParams.get('ttl') || '300');

    let response: any;

    switch (action) {
      case 'get':
        response = await handleGet(key);
        break;
      case 'set':
        const value = searchParams.get('value') || 'demo-value';
        response = await handleSet(key, value, ttl);
        break;
      case 'stats':
        response = await handleStats();
        break;
      case 'health':
        response = await handleHealth();
        break;
      case 'load-balancer':
        response = await handleLoadBalancer();
        break;
      case 'security':
        response = await handleSecurity();
        break;
      default:
        response = await handleDemo();
    }

    const nextResponse = NextResponse.json(response);
    
    // Add security headers
    security.setSecurityHeaders(nextResponse);
    
    // Add rate limit headers
    nextResponse.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    nextResponse.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

    return nextResponse;

  } catch (error) {
    console.error('Cache demo API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const security = SecurityMiddleware.getInstance();
    const rateLimit = security.checkRateLimit(request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown');
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, key, value, ttl = 300, tags = [] } = body;

    let response: any;

    switch (action) {
      case 'set':
        response = await handleSet(key, value, ttl, tags);
        break;
      case 'invalidate':
        response = await handleInvalidate(tags);
        break;
      case 'warm':
        response = await handleWarmCache(key, value);
        break;
      default:
        response = { error: 'Invalid action' };
    }

    const nextResponse = NextResponse.json(response);
    security.setSecurityHeaders(nextResponse);
    
    return nextResponse;

  } catch (error) {
    console.error('Cache demo POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET operations
async function handleGet(key: string) {
  const startTime = Date.now();
  const data = await enhancedCacheManager.get(key);
  const responseTime = Date.now() - startTime;

  return {
    success: true,
    data,
    responseTime,
    timestamp: new Date().toISOString()
  };
}

// Handle SET operations
async function handleSet(key: string, value: any, ttl: number, tags: string[] = []) {
  const startTime = Date.now();
  await enhancedCacheManager.set(key, value, { ttl, tags });
  const responseTime = Date.now() - startTime;

  return {
    success: true,
    message: 'Data cached successfully',
    key,
    ttl,
    tags,
    responseTime,
    timestamp: new Date().toISOString()
  };
}

// Handle cache statistics
async function handleStats() {
  const stats = enhancedCacheManager.getStats();
  const health = await enhancedCacheManager.healthCheck();

  return {
    success: true,
    stats,
    health,
    timestamp: new Date().toISOString()
  };
}

// Handle health check
async function handleHealth() {
  const cacheHealth = await enhancedCacheManager.healthCheck();
  const loadBalancerHealth = loadBalancer.getHealthStatus();
  const securityHealth = await SecurityMiddleware.getInstance().securityHealthCheck();

  return {
    success: true,
    cache: cacheHealth,
    loadBalancer: {
      stats: loadBalancer.getStats(),
      health: loadBalancerHealth
    },
    security: securityHealth,
    timestamp: new Date().toISOString()
  };
}

// Handle load balancer demo
async function handleLoadBalancer() {
  const stats = loadBalancer.getStats();
  const health = loadBalancer.getHealthStatus();
  const nextInstance = loadBalancer.getNextInstance();

  return {
    success: true,
    stats,
    health,
    nextInstance,
    timestamp: new Date().toISOString()
  };
}

// Handle security demo
async function handleSecurity() {
  const security = SecurityMiddleware.getInstance();
  const health = await security.securityHealthCheck();
  const config = security.getConfig();

  return {
    success: true,
    health,
    config: {
      csrf: config.csrf.enabled,
      secureCookies: config.cookies.secure,
      rateLimit: config.rateLimit.enabled,
      securityHeaders: config.headers.hsts
    },
    timestamp: new Date().toISOString()
  };
}

// Handle cache invalidation
async function handleInvalidate(tags: string[]) {
  const startTime = Date.now();
  await enhancedCacheManager.invalidateByTags(tags);
  const responseTime = Date.now() - startTime;

  return {
    success: true,
    message: 'Cache invalidated successfully',
    tags,
    responseTime,
    timestamp: new Date().toISOString()
  };
}

// Handle cache warming
async function handleWarmCache(key: string, value: any) {
  const startTime = Date.now();
  const data = await enhancedCacheManager.warmCache(
    key,
    () => Promise.resolve(value),
    { ttl: 3600, tags: ['warmed'] }
  );
  const responseTime = Date.now() - startTime;

  return {
    success: true,
    message: 'Cache warmed successfully',
    key,
    data,
    responseTime,
    timestamp: new Date().toISOString()
  };
}

// Handle demo
async function handleDemo() {
  // Simulate some expensive operation
  const expensiveData = {
    venues: await simulateVenueData(),
    vendors: await simulateVendorData(),
    users: await simulateUserData(),
    timestamp: new Date().toISOString()
  };

  // Cache the expensive data
  await enhancedCacheManager.set('demo-data', expensiveData, {
    ttl: 300,
    tags: ['demo', 'expensive-data']
  });

  return {
    success: true,
    message: 'Demo data generated and cached',
    data: expensiveData,
    cacheInfo: {
      key: 'demo-data',
      ttl: 300,
      tags: ['demo', 'expensive-data']
    },
    timestamp: new Date().toISOString()
  };
}

// Simulate expensive data operations
async function simulateVenueData() {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    { id: 1, name: 'Grand Ballroom', capacity: 500, price: 50000 },
    { id: 2, name: 'Garden Pavilion', capacity: 300, price: 35000 },
    { id: 3, name: 'Beach Resort', capacity: 200, price: 25000 }
  ];
}

async function simulateVendorData() {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return [
    { id: 1, name: 'Elegant Photography', category: 'photography', rating: 4.8 },
    { id: 2, name: 'Royal Catering', category: 'catering', rating: 4.9 },
    { id: 3, name: 'Dream Decorations', category: 'decoration', rating: 4.7 }
  ];
}

async function simulateUserData() {
  await new Promise(resolve => setTimeout(resolve, 80));
  
  return [
    { id: 1, name: 'John Doe', role: 'planner', active: true },
    { id: 2, name: 'Jane Smith', role: 'vendor', active: true },
    { id: 3, name: 'Admin User', role: 'admin', active: true }
  ];
}
