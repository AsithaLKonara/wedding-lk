"use client"

import { Suspense, useEffect, useState } from "react"
import { PreloadResources } from "@/components/ui/performance-optimizer"
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
      <PreloadResources />
      
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
      
    </>
  )
}

