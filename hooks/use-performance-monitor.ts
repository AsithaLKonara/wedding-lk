"use client"

import { useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

export function usePerformanceMonitor() {
  const measurePageLoad = useCallback(() => {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
      
      // Send to analytics
      if (pageLoadTime > 3000) {
        console.warn('Slow page load detected:', pageLoadTime)
        // You can send this to your analytics service
        // analytics.track('slow_page_load', { loadTime: pageLoadTime, url: window.location.href })
      }
    }
  }, [])

  const measureWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime
          console.log('FCP:', fcp)
          // Track FCP
        }
      })
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'largest-contentful-paint') {
          const lcp = entry.startTime
          console.log('LCP:', lcp)
          // Track LCP
        }
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
      console.log('CLS:', cls)
      // Track CLS
    }).observe({ entryTypes: ['layout-shift'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        if (entry.processingStart) {
          const fid = entry.processingStart - entry.startTime
          console.log('FID:', fid)
          // Track FID
        }
      })
    }).observe({ entryTypes: ['first-input'] })
  }, [])

  const measureUserInteractions = useCallback(() => {
    if (typeof window === 'undefined') return

    let interactionCount = 0
    let lastInteractionTime = Date.now()

    const trackInteraction = () => {
      interactionCount++
      lastInteractionTime = Date.now()
    }

    // Track various user interactions
    const events = ['click', 'scroll', 'input', 'submit', 'focus']
    events.forEach(event => {
      document.addEventListener(event, trackInteraction, { passive: true })
    })

    // Track scroll depth
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent)
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackInteraction)
      })
      window.removeEventListener('scroll', trackScrollDepth)
    }
  }, [])

  const measureResourceLoading = useCallback(() => {
    if (typeof window === 'undefined') return

    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        if (entry.initiatorType === 'img' || entry.initiatorType === 'script' || entry.initiatorType === 'css') {
          const loadTime = entry.responseEnd - entry.fetchStart
          
          if (loadTime > 2000) {
            console.warn('Slow resource load:', entry.name, loadTime)
            // Track slow resources
          }
        }
      })
    }).observe({ entryTypes: ['resource'] })
  }, [])

  useEffect(() => {
    measurePageLoad()
    measureWebVitals()
    measureResourceLoading()
    
    const cleanup = measureUserInteractions()

    return cleanup
  }, [measurePageLoad, measureWebVitals, measureResourceLoading, measureUserInteractions])

  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    if (typeof window === 'undefined') {
      return {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
      }
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      firstContentfulPaint: 0, // Would need to be tracked separately
      largestContentfulPaint: 0, // Would need to be tracked separately
      cumulativeLayoutShift: 0, // Would need to be tracked separately
      firstInputDelay: 0 // Would need to be tracked separately
    }
  }, [])

  return {
    getPerformanceMetrics,
    measurePageLoad,
    measureWebVitals
  }
} 