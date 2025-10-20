#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'

console.log('🚀 Starting API Optimization...\n')

// 1. Create Redis caching layer
console.log('📦 Creating Redis caching layer...')
const redisCache = `// Redis caching layer for API optimization
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export class CacheService {
  private static instance: CacheService
  private redis: Redis
  
  constructor() {
    this.redis = redis
  }
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }
  
  // Cache key generators
  static getVenuesKey(filters?: any): string {
    return \`venues:\${JSON.stringify(filters || {})}\`
  }
  
  static getVendorsKey(filters?: any): string {
    return \`vendors:\${JSON.stringify(filters || {})}\`
  }
  
  static getPackagesKey(filters?: any): string {
    return \`packages:\${JSON.stringify(filters || {})}\`
  }
}

export default CacheService
`

fs.writeFileSync('lib/cache.ts', redisCache)
console.log('✅ Redis caching layer created\n')

// 2. Create database connection pool
console.log('🗄️  Creating database connection pool...')
const dbPool = `// Database connection pool for better performance
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

// Connection pool configuration
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Skip database connection during build if no URI is provided
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not provided, skipping database connection")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongoose) => {
      console.log('Database connected with connection pool')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.warn("Database connection failed:", e)
    return null
  }

  return cached.conn
}

// Query optimization helpers
export class QueryOptimizer {
  static optimizeVenueQuery(filters: any = {}) {
    const query: any = {}
    
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' }
    }
    
    if (filters.capacity) {
      query.capacity = { $gte: filters.capacity }
    }
    
    if (filters.priceRange) {
      query.price = {
        $gte: filters.priceRange.min || 0,
        $lte: filters.priceRange.max || Infinity
      }
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $in: filters.amenities }
    }
    
    return query
  }
}

export default connectDB
`

fs.writeFileSync('lib/db-optimized.ts', dbPool)
console.log('✅ Database connection pool created\n')

// 3. Create API response compression
console.log('🗜️  Creating API response compression...')
const compression = `// API response compression and optimization
import { NextRequest, NextResponse } from 'next/server'
import { gzip, brotliCompress } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

export class ResponseOptimizer {
  static async compressResponse(data: any, request: NextRequest): Promise<NextResponse> {
    const jsonString = JSON.stringify(data)
    const acceptEncoding = request.headers.get('accept-encoding') || ''
    
    let compressedData: Buffer
    let encoding: string
    
    if (acceptEncoding.includes('br')) {
      compressedData = await brotliAsync(Buffer.from(jsonString))
      encoding = 'br'
    } else if (acceptEncoding.includes('gzip')) {
      compressedData = await gzipAsync(Buffer.from(jsonString))
      encoding = 'gzip'
    } else {
      return NextResponse.json(data)
    }
    
    const response = new NextResponse(compressedData)
    response.headers.set('Content-Encoding', encoding)
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
    
    return response
  }
  
  static addCacheHeaders(response: NextResponse, ttl: number = 300): NextResponse {
    response.headers.set('Cache-Control', \`public, max-age=\${ttl}, s-maxage=\${ttl}\`)
    response.headers.set('ETag', \`"\${Date.now()}"\`)
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  }
}

export default ResponseOptimizer
`

fs.writeFileSync('lib/api-optimizer.ts', compression)
console.log('✅ API response compression created\n')

// 4. Create performance monitoring middleware
console.log('📊 Creating performance monitoring middleware...')
const performanceMiddleware = `// Performance monitoring middleware
import { NextRequest, NextResponse } from 'next/server'

export function withPerformanceMonitoring(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const startTime = performance.now()
    const startMemory = process.memoryUsage()
    
    try {
      const response = await handler(request, ...args)
      
      const endTime = performance.now()
      const endMemory = process.memoryUsage()
      
      const duration = endTime - startTime
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed
      
      // Log performance metrics
      console.log(\`API Performance: \${request.nextUrl.pathname}\`, {
        duration: \`\${duration.toFixed(2)}ms\`,
        memoryUsed: \`\${(memoryUsed / 1024 / 1024).toFixed(2)}MB\`,
        status: response.status,
        timestamp: new Date().toISOString()
      })
      
      // Add performance headers
      response.headers.set('X-Response-Time', \`\${duration.toFixed(2)}ms\`)
      response.headers.set('X-Memory-Used', \`\${(memoryUsed / 1024 / 1024).toFixed(2)}MB\`)
      
      return response
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.error(\`API Error: \${request.nextUrl.pathname}\`, {
        duration: \`\${duration.toFixed(2)}ms\`,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      throw error
    }
  }
}

export default withPerformanceMonitoring
`

fs.writeFileSync('lib/performance-middleware.ts', performanceMiddleware)
console.log('✅ Performance monitoring middleware created\n')

// 5. Install required dependencies
console.log('📦 Installing optimization dependencies...')
try {
  execSync('npm install ioredis @types/ioredis', { stdio: 'inherit' })
  console.log('✅ Dependencies installed\n')
} catch (error) {
  console.log('⚠️  Some dependencies may already be installed\n')
}

console.log('🎉 API optimization completed!')
console.log('📊 Next steps:')
console.log('1. Set up Redis server')
console.log('2. Update environment variables')
console.log('3. Test API performance')
console.log('4. Monitor response times')
