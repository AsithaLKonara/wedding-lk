#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Create a simple lazy loading component that handles both named and default exports
const lazyLoadingContent = `"use client"

import { Suspense, lazy, ComponentType } from "react"
import { Loader2 } from "lucide-react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  [key: string]: any
}

export function LazyComponent({ component, fallback, ...props }: LazyComponentProps) {
  const LazyComponent = lazy(component)
  
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}

// Helper function to create lazy components that handle both named and default exports
function createLazyComponent(importPath, componentName) {
  return lazy(() => 
    import(importPath).then(module => ({
      default: module[componentName] || module.default || module
    }))
  )
}

// Lazy loading for main page components
export const LazyAISearchSection = createLazyComponent("@/components/organisms/ai-search-section", "AISearchSection")
export const LazyWeddingPackagesSection = createLazyComponent("@/components/organisms/wedding-packages-section", "WeddingPackagesSection")
export const LazyServicesSection = createLazyComponent("@/components/organisms/services-section", "ServicesSection")
export const LazyVendorCategoriesSection = createLazyComponent("@/components/organisms/vendor-categories-section", "VendorCategoriesSection")
export const LazyVenueSocialFeed = createLazyComponent("@/components/organisms/venue-social-feed", "VenueSocialFeed")
export const LazyTestimonialsSection = createLazyComponent("@/components/organisms/testimonials-section", "TestimonialsSection")
export const LazyCTASection = createLazyComponent("@/components/organisms/cta-section", "CTASection")

// Lazy loading for about page components
export const LazyAboutHero = createLazyComponent("@/components/organisms/about-hero", "AboutHero")
export const LazyAboutStory = createLazyComponent("@/components/organisms/about-story", "AboutStory")
export const LazyTeamSection = createLazyComponent("@/components/organisms/team-section", "TeamSection")
export const LazyStatsSection = createLazyComponent("@/components/organisms/stats-section", "StatsSection")

// Lazy loading for contact page components
export const LazyContactForm = createLazyComponent("@/components/organisms/contact-form", "ContactForm")
export const LazyContactInfo = createLazyComponent("@/components/organisms/contact-info", "ContactInfo")

// Lazy loading for venue components
export const LazyVenueHero = createLazyComponent("@/components/organisms/venue-hero", "VenueHero")
export const LazyVenueDetails = createLazyComponent("@/components/organisms/venue-details", "VenueDetails")
export const LazyVenueGallery = createLazyComponent("@/components/organisms/venue-gallery", "VenueGallery")
export const LazyVenueReviews = createLazyComponent("@/components/organisms/venue-reviews", "VenueReviews")
export const LazyVenueBooking = createLazyComponent("@/components/organisms/venue-booking", "VenueBooking")
export const LazySimilarVenues = createLazyComponent("@/components/organisms/similar-venues", "SimilarVenues")
export const LazyVenueGrid = createLazyComponent("@/components/organisms/venue-grid", "VenueGrid")
export const LazyVenueFilters = createLazyComponent("@/components/organisms/venue-filters", "VenueFilters")

// Lazy loading for vendor components
export const LazyVendorGrid = createLazyComponent("@/components/organisms/vendor-grid", "VendorGrid")
export const LazyVendorProfile = createLazyComponent("@/components/organisms/vendor-profile", "VendorProfile")
export const LazyVendorPortfolio = createLazyComponent("@/components/organisms/vendor-portfolio", "VendorPortfolio")
export const LazyVendorReviews = createLazyComponent("@/components/organisms/vendor-reviews", "VendorReviews")
export const LazyVendorContact = createLazyComponent("@/components/organisms/vendor-contact", "VendorContact")
export const LazyVendorCategories = createLazyComponent("@/components/organisms/vendor-categories", "VendorCategories")
export const LazyVendorFilters = createLazyComponent("@/components/organisms/vendor-filters", "VendorFilters")

// Lazy loading for dashboard components
export const LazyDashboardHeader = createLazyComponent("@/components/organisms/dashboard-header", "DashboardHeader")
export const LazyQuickActions = createLazyComponent("@/components/organisms/quick-actions", "QuickActions")
export const LazyRecentActivity = createLazyComponent("@/components/organisms/recent-activity", "RecentActivity")
export const LazyUpcomingTasks = createLazyComponent("@/components/organisms/upcoming-tasks", "UpcomingTasks")
export const LazyWeddingProgress = createLazyComponent("@/components/organisms/wedding-progress", "WeddingProgress")
export const LazyWeddingTimeline = createLazyComponent("@/components/organisms/wedding-timeline", "WeddingTimeline")
export const LazyWeddingChecklist = createLazyComponent("@/components/organisms/wedding-checklist", "WeddingChecklist")
export const LazyWeddingDetails = createLazyComponent("@/components/organisms/wedding-details", "WeddingDetails")
export const LazyGuestList = createLazyComponent("@/components/organisms/guest-list", "GuestList")
export const LazyBudgetTracker = createLazyComponent("@/components/organisms/budget-tracker", "BudgetTracker")

// Lazy loading for payment and subscription components
export const LazyPaymentForm = createLazyComponent("@/components/organisms/payment-form", "PaymentForm")
export const LazySubscriptionPlans = createLazyComponent("@/components/organisms/subscription-plans", "SubscriptionPlans")

// Lazy loading for settings components
export const LazyAccountSettings = createLazyComponent("@/components/organisms/account-settings", "AccountSettings")
export const LazyNotificationSettings = createLazyComponent("@/components/organisms/notification-settings", "NotificationSettings")
export const LazyPersonalInfo = createLazyComponent("@/components/organisms/personal-info", "PersonalInfo")

// Lazy loading for feed components
export const LazyFeedPosts = createLazyComponent("@/components/organisms/feed-posts", "FeedPosts")
export const LazyFeedSidebar = createLazyComponent("@/components/organisms/feed-sidebar", "FeedSidebar")
export const LazyFeedStories = createLazyComponent("@/components/organisms/feed-stories", "FeedStories")

// Lazy loading for AI and search components
export const LazyAISearchResults = createLazyComponent("@/components/molecules/ai-search-results", "AISearchResults")
export const LazyCulturalWeddingTools = createLazyComponent("@/components/organisms/cultural-wedding-tools", "CulturalWeddingTools")
export const LazyPremiumCoupleFeatures = createLazyComponent("@/components/organisms/premium-couple-features", "PremiumCoupleFeatures")
export const LazyCommissionTracker = createLazyComponent("@/components/organisms/commission-tracker", "CommissionTracker")

// Lazy loading for favorites components
export const LazyFavoriteVendors = createLazyComponent("@/components/organisms/favorite-vendors", "FavoriteVendors")
export const LazyFavoriteVenues = createLazyComponent("@/components/organisms/favorite-venues", "FavoriteVenues")
export const LazyFavoritesTabs = createLazyComponent("@/components/organisms/favorites-tabs", "FavoritesTabs")
export const LazySavedVenues = createLazyComponent("@/components/organisms/saved-venues", "SavedVenues")

// Lazy loading for card components
export const LazyTestimonialCard = createLazyComponent("@/components/molecules/testimonial-card", "TestimonialCard")
export const LazyServiceCard = createLazyComponent("@/components/molecules/service-card", "ServiceCard")
export const LazyWeddingPackageCard = createLazyComponent("@/components/molecules/wedding-package-card", "WeddingPackageCard")
export const LazyVendorCard = createLazyComponent("@/components/molecules/vendor-card", "VendorCard")
export const LazyVenueCard = createLazyComponent("@/components/molecules/venue-card", "VenueCard")
export const LazyVendorCategoryCard = createLazyComponent("@/components/molecules/vendor-category-card", "VendorCategoryCard")

// Lazy loading for feature components
export const LazyFeaturesSection = createLazyComponent("@/components/organisms/features-section", "FeaturesSection")
export const LazyFeatureCard = createLazyComponent("@/components/molecules/feature-card", "FeatureCard")

// Lazy loading for planning components
export const LazyPlanningTabs = createLazyComponent("@/components/organisms/planning-tabs", "PlanningTabs")
export const LazyPlatformStatus = createLazyComponent("@/components/organisms/platform-status", "PlatformStatus")
export const LazyNavigationDebug = createLazyComponent("@/components/organisms/navigation-debug", "NavigationDebug")

// Lazy loading for booking components
export const LazyBookingConfirmation = createLazyComponent("@/components/organisms/booking-confirmation", "BookingConfirmation")
export const LazySearchHeader = createLazyComponent("@/components/organisms/search-header", "SearchHeader")

// Lazy loading for UI components
export const LazyLocationDropdown = createLazyComponent("@/components/molecules/location-dropdown", "LocationDropdown")
export const LazyMobileMenu = createLazyComponent("@/components/molecules/mobile-menu", "MobileMenu")
export const LazyNavigationMenu = createLazyComponent("@/components/molecules/navigation-menu", "NavigationMenu")
export const LazySocialLinks = createLazyComponent("@/components/molecules/social-links", "SocialLinks")
export const LazyThemeToggle = createLazyComponent("@/components/molecules/theme-toggle", "ThemeToggle")

// Lazy loading for atom components
export const LazyAnimatedBackground = createLazyComponent("@/components/atoms/animated-background", "AnimatedBackground")
export const LazyLogo = createLazyComponent("@/components/atoms/logo", "Logo")

// Lazy loading for layout components
export const LazyErrorBoundary = createLazyComponent("@/components/organisms/error-boundary", "ErrorBoundary")
export const LazyHeader = createLazyComponent("@/components/organisms/header", "Header")
export const LazyFooter = createLazyComponent("@/components/organisms/footer", "Footer")
export const LazyMainLayout = createLazyComponent("@/components/templates/main-layout", "MainLayout")
export const LazyThemeProvider = createLazyComponent("@/components/providers/theme-provider", "ThemeProvider")
`;

// Write the fixed lazy loading component
fs.writeFileSync(path.join(process.cwd(), 'components/ui/lazy-loading.tsx'), lazyLoadingContent);

console.log('✅ Fixed lazy loading component with proper TypeScript support');
console.log('📝 All lazy imports now handle both named and default exports');
