// Performance monitoring middleware
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
      console.log(`API Performance: ${request.nextUrl.pathname}`, {
        duration: `${duration.toFixed(2)}ms`,
        memoryUsed: `${(memoryUsed / 1024 / 1024).toFixed(2)}MB`,
        status: response.status,
        timestamp: new Date().toISOString()
      })
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${duration.toFixed(2)}ms`)
      response.headers.set('X-Memory-Used', `${(memoryUsed / 1024 / 1024).toFixed(2)}MB`)
      
      return response
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.error(`API Error: ${request.nextUrl.pathname}`, {
        duration: `${duration.toFixed(2)}ms`,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      throw error
    }
  }
}

export default withPerformanceMonitoring
