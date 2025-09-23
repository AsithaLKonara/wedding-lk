"use client"
import { Suspense } from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { PerformanceOptimizer } from "@/components/ui/performance-optimizer"
import { SkeletonLoader } from "@/components/ui/loading-spinner"
import dynamic from "next/dynamic"

// Lazy load components with better loading states
const AISearchSection = dynamic(() => import("@/components/organisms/ai-search-section"))

const WeddingPackagesSection = dynamic(() => import("@/components/organisms/wedding-packages-section"))

const ServicesSection = dynamic(() => import("@/components/organisms/services-section"))

const VendorCategoriesSection = dynamic(() => import("@/components/organisms/vendor-categories-section"))

const VenueSocialFeed = dynamic(() => import("@/components/organisms/venue-social-feed"))

const TestimonialsSection = dynamic(() => import("@/components/organisms/testimonials-section"))

const CTASection = dynamic(() => import("@/components/organisms/cta-section"))

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="h-96" />}>
            <AISearchSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <WeddingPackagesSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <ServicesSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <VendorCategoriesSection />
          </Suspense>
        </PerformanceOptimizer>

        <div className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PerformanceOptimizer>
              <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
                <VenueSocialFeed venueId="all" />
              </Suspense>
            </PerformanceOptimizer>
          </div>
        </div>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <TestimonialsSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <CTASection />
          </Suspense>
        </PerformanceOptimizer>
      </div>
    </MainLayout>
  )
}
