// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(name: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    for (const [name] of this.metrics) {
      result[name] = this.getAverageMetric(name)
    }
    return result
  }

  clearMetrics(): void {
    this.metrics.clear()
  }
}

// Web Vitals monitoring
export function measureWebVitals(): void {
  if (typeof window !== 'undefined') {
    // Measure Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Measure First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Measure Cumulative Layout Shift (CLS)
    new PerformanceObserver((entryList) => {
      let cls = 0
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
      console.log('CLS:', cls)
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Memory usage monitoring
export function getMemoryUsage(): Record<string, number> {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    }
  }
  return {}
}

// Network performance monitoring
export function measureNetworkPerformance(): void {
  if (typeof window !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection) {
      console.log('Network Type:', connection.effectiveType)
      console.log('Downlink:', connection.downlink)
      console.log('RTT:', connection.rtt)
    }
  }
} 