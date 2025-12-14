"use client"

import React from "react"
import { useState, useEffect, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface PerformanceOptimizerProps {
  children: ReactNode
  fallback?: ReactNode
  loading?: boolean
  error?: Error | null
  retry?: () => void
  className?: string
}

interface LoadingSkeletonProps {
  type: 'table' | 'card' | 'list' | 'chart' | 'form'
  rows?: number
  className?: string
}

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  placeholder?: ReactNode
  className?: string
}

// Loading Skeleton Component
export function LoadingSkeleton({ type, rows = 3, className = "" }: LoadingSkeletonProps) {
  const renderTableSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )

  const renderCardSkeleton = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )

  const renderChartSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className="h-6 w-1/3" />
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <LoadingSpinner />
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      </div>
    </div>
  )

  const renderFormSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )

  switch (type) {
    case 'table':
      return renderTableSkeleton()
    case 'card':
      return renderCardSkeleton()
    case 'list':
      return renderListSkeleton()
    case 'chart':
      return renderChartSkeleton()
    case 'form':
      return renderFormSkeleton()
    default:
      return renderCardSkeleton()
  }
}

// Lazy Load Component
export function LazyLoad({ 
  children,
  threshold = 0.1,
  placeholder = <LoadingSkeleton type="card" />,
  className = "" 
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    const element = document.querySelector(`.${className}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [threshold, className])

  if (!isVisible) {
    return <div className={className}>{placeholder}</div>
  }

  if (!isLoaded) {
    // Simulate loading time for better UX
    setTimeout(() => setIsLoaded(true), 100)
    return <div className={className}>{placeholder}</div>
  }

  return <div className={className}>{children}</div>
}

// Performance Optimizer Component
export function PerformanceOptimizer({ 
  children, 
  fallback = <LoadingSkeleton type="card" />,
  loading = false,
  error = null,
  retry,
  className = ""
}: PerformanceOptimizerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle loading state
  if (loading) {
    return <div className={className}>{fallback}</div>
  }

  // Handle error state
  if (error) {
  return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
      )}
    </div>
  )
}

  // Handle SSR hydration
  if (!isClient) {
    return <div className={className}>{fallback}</div>
  }

  return <div className={className}>{children}</div>
}

// Performance Monitor Hook
export function usePerformanceMonitor(componentName: string) {
  const [renderTime, setRenderTime] = useState<number>(0)
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      setRenderTime(duration)
      
      // Flag slow renders (>100ms)
      if (duration > 100) {
        setIsSlow(true)
        console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  return { renderTime, isSlow }
}

// Virtual Scroller Component (for large lists)
interface VirtualScrollerProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => ReactNode
  className?: string
}

export function VirtualScroller({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  className = "" 
}: VirtualScrollerProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length)

  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Debounced Search Hook
export function useDebouncedSearch<T>(
  items: T[],
  searchTerm: string,
  searchKeys: (keyof T)[],
  delay: number = 300
) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchTerm, delay])

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setFilteredItems(items)
      return
    }

    const filtered = items.filter(item =>
      searchKeys.some(key => {
        const value = item[key]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedTerm.toLowerCase())
        }
        return false
      })
    )

    setFilteredItems(filtered)
  }, [items, debouncedTerm, searchKeys])

  return filteredItems
}

// Memory Usage Monitor
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null)

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo((performance as any).memory)
      }
      
      updateMemoryInfo()
      const interval = setInterval(updateMemoryInfo, 5000)
      
      return () => clearInterval(interval)
    }
  }, [])

  return memoryInfo
}


export default LoadingSkeleton
