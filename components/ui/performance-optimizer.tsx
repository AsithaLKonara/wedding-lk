"use client"

import { useEffect, useRef, useState } from 'react'

interface PerformanceOptimizerProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function PerformanceOptimizer({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
}: PerformanceOptimizerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth loading
      const timer = setTimeout(() => setIsLoaded(true), 50)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isVisible])

  return (
    <div ref={ref} className={className}>
      {isLoaded ? children : (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />
      )}
    </div>
  )
}

// Preload component for critical resources
export function PreloadResources() {
  useEffect(() => {
    // Preload critical fonts
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = '/fonts/inter-var.woff2'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)

    // Preload critical images
    const criticalImages = [
      '/placeholder-logo.svg',
      '/placeholder-user.jpg',
    ]

    criticalImages.forEach(src => {
      const imgLink = document.createElement('link')
      imgLink.rel = 'preload'
      imgLink.href = src
      imgLink.as = 'image'
      document.head.appendChild(imgLink)
    })
  }, [])

  return null
}

// Debounced hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttled hook for performance
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef<number>(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}
