import Header from '@/components/organisms/header'
import AISearchSection from '@/components/organisms/ai-search-section'
import FeaturesSection from '@/components/organisms/features-section'
import WeddingPackagesSection from '@/components/organisms/wedding-packages-section'
import VendorCategoriesSection from '@/components/organisms/vendor-categories-section'
import StatsSection from '@/components/organisms/stats-section'
import RealFeaturedVendors from '@/components/organisms/real-featured-vendors'
import RealFeaturedVenues from '@/components/organisms/real-featured-venues'
import RealTestimonials from '@/components/organisms/real-testimonials'
import CTASection from '@/components/organisms/cta-section'
import Footer from '@/components/organisms/footer'
import { ErrorSafetyWrapper } from '@/components/error-safety-wrapper'

export default function HomePage() {
  return (
    <ErrorSafetyWrapper>
      <Header />
      <main className="min-h-screen">
        <ErrorSafetyWrapper>
          <AISearchSection />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <FeaturesSection />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <WeddingPackagesSection />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <VendorCategoriesSection />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <StatsSection />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <RealFeaturedVendors />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <RealFeaturedVenues />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <RealTestimonials />
        </ErrorSafetyWrapper>
        <ErrorSafetyWrapper>
          <CTASection />
        </ErrorSafetyWrapper>
        <Footer />
      </main>
    </ErrorSafetyWrapper>
  )
}

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'
