"use client"

import React, { Suspense, useEffect, useState } from "react"
import { PageLoader } from "@/components/ui/loading-spinner"

// Import components directly since they have named exports
import { Header } from "@/components/organisms/header"
import { Footer } from "@/components/organisms/footer"

interface MainLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) {
  return (
    <>
      {/* Preload critical resources */}
      
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {showHeader && (
          <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />}>
            <Header />
          </Suspense>
        )}
        
        <main className="flex-1">
          <Suspense fallback={<PageLoader text="Loading content..." />}>
            {children}
          </Suspense>
        </main>
        
        {showFooter && (
          <Suspense fallback={<div className="h-64 bg-gray-50 dark:bg-gray-800 animate-pulse" />}>
            <Footer />
          </Suspense>
        )}
      </div>
      
      {/* Performance monitoring - only on client */}
      <PerformanceMonitor />
    </>
  )
}

// Performance monitoring component
function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return null
}


export default MainLayout
