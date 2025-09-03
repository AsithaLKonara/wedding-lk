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

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <AISearchSection />
        <FeaturesSection />
        <WeddingPackagesSection />
        <VendorCategoriesSection />
        <StatsSection />
        <RealFeaturedVendors />
        <RealFeaturedVenues />
        <RealTestimonials />
        <CTASection />
        <Footer />
      </main>
    </>
  )
}
