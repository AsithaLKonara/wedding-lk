// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  startTiming(name: string): void {
    this.metrics.set(`${name}_start`, performance.now())
  }
  
  endTiming(name: string): number {
    const startTime = this.metrics.get(`${name}_start`)
    if (!startTime) return 0
    
    const duration = performance.now() - startTime
    this.metrics.set(name, duration)
    this.metrics.delete(`${name}_start`)
    
    return duration
  }
  
  getMetric(name: string): number | undefined {
    return this.metrics.get(name)
  }
  
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    this.metrics.forEach((value, key) => {
      if (!key.endsWith('_start')) {
        result[key] = value
      }
    })
    return result
  }
  
  clearMetrics(): void {
    this.metrics.clear()
  }
}

// Web Vitals monitoring
export function measureWebVitals() {
  if (typeof window === 'undefined') return
  
  // First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime)
      }
    }
  }).observe({ entryTypes: ['paint'] })
  
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry.startTime)
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })
  
  // First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime)
    }
  }).observe({ entryTypes: ['first-input'] })
  
  // Cumulative Layout Shift
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        console.log('CLS:', (entry as any).value)
      }
    }
  }).observe({ entryTypes: ['layout-shift'] })
}

// Resource timing
export function measureResourceTiming() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource')
    resources.forEach((resource) => {
      console.log(`Resource: ${resource.name}, Duration: ${resource.duration}ms`)
    })
  })
}

// Navigation timing
export function measureNavigationTiming() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    console.log('Navigation timing:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart
    })
  })
}

export default PerformanceMonitor
