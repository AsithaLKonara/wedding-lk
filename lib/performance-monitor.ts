import { connectDB } from './db'
import { performance } from 'perf_hooks'

interface PerformanceMetrics {
  timestamp: Date
  type: 'api' | 'page' | 'database' | 'external'
  name: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  metadata?: any
}

interface SystemMetrics {
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
    load: number
  }
  database: {
    connections: number
    responseTime: number
    health: 'healthy' | 'warning' | 'error'
  }
  api: {
    requestsPerMinute: number
    averageResponseTime: number
    errorRate: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private startTime = Date.now()
  private requestCount = 0
  private errorCount = 0

  // Track API performance
  async trackAPIPerformance(name: string, fn: () => Promise<any>): Promise<any> {
    const start = performance.now()
    const startTime = new Date()

    try {
      const result = await fn()
      const duration = performance.now() - start

      this.recordMetric({
        timestamp: startTime,
        type: 'api',
        name,
        duration,
        status: 'success'
      })

      return result

    } catch (error) {
      const duration = performance.now() - start
      this.errorCount++

      this.recordMetric({
        timestamp: startTime,
        type: 'api',
        name,
        duration,
        status: 'error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      })

      throw error
    } finally {
      this.requestCount++
    }
  }

  // Track database performance
  async trackDatabasePerformance(operation: string, fn: () => Promise<any>): Promise<any> {
    const start = performance.now()
    const startTime = new Date()

    try {
      const result = await fn()
      const duration = performance.now() - start

      this.recordMetric({
        timestamp: startTime,
        type: 'database',
        name: operation,
        duration,
        status: 'success'
      })

      return result

    } catch (error) {
      const duration = performance.now() - start

      this.recordMetric({
        timestamp: startTime,
        type: 'database',
        name: operation,
        duration,
        status: 'error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      })

      throw error
    }
  }

  // Track page load performance
  trackPagePerformance(pageName: string, loadTime: number, status: 'success' | 'error' = 'success') {
    this.recordMetric({
      timestamp: new Date(),
      type: 'page',
      name: pageName,
      duration: loadTime,
      status
    })
  }

  // Get system metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    const memoryUsage = process.memoryUsage()
    const uptime = process.uptime()

    // Calculate memory metrics
    const memory = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
    }

    // Calculate CPU metrics (simplified)
    const cpu = {
      usage: Math.round((process.cpuUsage().user + process.cpuUsage().system) / 1000000), // seconds
      load: Math.round(uptime / 60) // minutes
    }

    // Database metrics
    const database = await this.getDatabaseMetrics()

    // API metrics
    const api = this.getAPIMetrics()

    return {
      memory,
      cpu,
      database,
      api
    }
  }

  // Get performance analytics
  async getPerformanceAnalytics(timeRange: '1h' | '24h' | '7d' = '24h') {
    const now = new Date()
    let startTime: Date

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    const filteredMetrics = this.metrics.filter(m => m.timestamp >= startTime)

    // API performance analysis
    const apiMetrics = filteredMetrics.filter(m => m.type === 'api')
    const apiPerformance = {
      totalRequests: apiMetrics.length,
      averageResponseTime: apiMetrics.length > 0 
        ? apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length 
        : 0,
      errorRate: apiMetrics.length > 0 
        ? (apiMetrics.filter(m => m.status === 'error').length / apiMetrics.length) * 100 
        : 0,
      slowestEndpoints: this.getSlowestEndpoints(apiMetrics),
      mostErrorProne: this.getMostErrorProne(apiMetrics)
    }

    // Database performance analysis
    const dbMetrics = filteredMetrics.filter(m => m.type === 'database')
    const dbPerformance = {
      totalOperations: dbMetrics.length,
      averageResponseTime: dbMetrics.length > 0 
        ? dbMetrics.reduce((sum, m) => sum + m.duration, 0) / dbMetrics.length 
        : 0,
      errorRate: dbMetrics.length > 0 
        ? (dbMetrics.filter(m => m.status === 'error').length / dbMetrics.length) * 100 
        : 0,
      slowestOperations: this.getSlowestEndpoints(dbMetrics)
    }

    // Page performance analysis
    const pageMetrics = filteredMetrics.filter(m => m.type === 'page')
    const pagePerformance = {
      totalPages: pageMetrics.length,
      averageLoadTime: pageMetrics.length > 0 
        ? pageMetrics.reduce((sum, m) => sum + m.duration, 0) / pageMetrics.length 
        : 0,
      slowestPages: this.getSlowestEndpoints(pageMetrics)
    }

    return {
      timeRange,
      apiPerformance,
      dbPerformance,
      pagePerformance,
      summary: {
        totalMetrics: filteredMetrics.length,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    }
  }

  // Get alerts for performance issues
  async getPerformanceAlerts() {
    const alerts = []
    const systemMetrics = await this.getSystemMetrics()
    const analytics = await this.getPerformanceAnalytics('1h')

    // Memory alerts
    if (systemMetrics.memory.percentage > 80) {
      alerts.push({
        type: 'memory',
        severity: 'high',
        message: `High memory usage: ${systemMetrics.memory.percentage}%`,
        timestamp: new Date()
      })
    }

    // API error rate alerts
    if (analytics.apiPerformance.errorRate > 5) {
      alerts.push({
        type: 'api',
        severity: 'medium',
        message: `High API error rate: ${analytics.apiPerformance.errorRate.toFixed(2)}%`,
        timestamp: new Date()
      })
    }

    // Database alerts
    if (systemMetrics.database.health === 'error') {
      alerts.push({
        type: 'database',
        severity: 'high',
        message: 'Database health check failed',
        timestamp: new Date()
      })
    }

    // Response time alerts
    if (analytics.apiPerformance.averageResponseTime > 1000) {
      alerts.push({
        type: 'performance',
        severity: 'medium',
        message: `Slow API response time: ${analytics.apiPerformance.averageResponseTime.toFixed(2)}ms`,
        timestamp: new Date()
      })
    }

    return alerts
  }

  // Record a performance metric
  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  // Get database metrics
  private async getDatabaseMetrics() {
    try {
      await connectDB()
      
      const start = performance.now()
      await require('mongoose').connection.db.admin().ping()
      const responseTime = performance.now() - start

      let health: 'healthy' | 'warning' | 'error'
      if (responseTime < 100) {
        health = 'healthy'
      } else if (responseTime < 500) {
        health = 'warning'
      } else {
        health = 'error'
      }

      return {
        connections: require('mongoose').connection.readyState === 1 ? 1 : 0,
        responseTime,
        health
      }
    } catch (error) {
      return {
        connections: 0,
        responseTime: 0,
        health: 'error' as const
      }
    }
  }

  // Get API metrics
  private getAPIMetrics() {
    const now = Date.now()
    const oneMinuteAgo = now - 60 * 1000
    
    const recentRequests = this.metrics.filter(m => 
      m.type === 'api' && m.timestamp.getTime() > oneMinuteAgo
    )

    const requestsPerMinute = recentRequests.length
    const averageResponseTime = recentRequests.length > 0 
      ? recentRequests.reduce((sum, m) => sum + m.duration, 0) / recentRequests.length 
      : 0
    const errorRate = recentRequests.length > 0 
      ? (recentRequests.filter(m => m.status === 'error').length / recentRequests.length) * 100 
      : 0

    return {
      requestsPerMinute,
      averageResponseTime,
      errorRate
    }
  }

  // Get slowest endpoints
  private getSlowestEndpoints(metrics: PerformanceMetrics[]) {
    return metrics
      .reduce((acc, metric) => {
        const existing = acc.find(item => item.name === metric.name)
        if (existing) {
          existing.count++
          existing.totalDuration += metric.duration
          existing.averageDuration = existing.totalDuration / existing.count
        } else {
          acc.push({
            name: metric.name,
            count: 1,
            totalDuration: metric.duration,
            averageDuration: metric.duration
          })
        }
        return acc
      }, [] as Array<{ name: string; count: number; totalDuration: number; averageDuration: number }>)
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 5)
  }

  // Get most error-prone endpoints
  private getMostErrorProne(metrics: PerformanceMetrics[]) {
    return metrics
      .reduce((acc, metric) => {
        const existing = acc.find(item => item.name === metric.name)
        if (existing) {
          existing.total++
          if (metric.status === 'error') existing.errors++
          existing.errorRate = (existing.errors / existing.total) * 100
        } else {
          acc.push({
            name: metric.name,
            total: 1,
            errors: metric.status === 'error' ? 1 : 0,
            errorRate: metric.status === 'error' ? 100 : 0
          })
        }
        return acc
      }, [] as Array<{ name: string; total: number; errors: number; errorRate: number }>)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5)
  }

  // Clear old metrics
  clearOldMetrics(olderThanHours: number = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000)
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff)
  }
}

export default new PerformanceMonitor() 