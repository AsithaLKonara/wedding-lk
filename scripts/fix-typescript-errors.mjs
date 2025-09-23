#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing TypeScript errors...');

// Fix API route type issues
const fixApiRoutes = () => {
  console.log('📝 Fixing API route type issues...');
  
  // Fix clients route
  const clientsRoute = `import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Client } from "@/lib/models/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const plannerId = searchParams.get("plannerId")

    let query: any = {}

    if (clientId) {
      const client = await Client.findById(clientId).populate('plannerId', 'firstName lastName email')
      if (!client) {
        return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: client })
    }

    if (plannerId) {
      query.plannerId = plannerId
    } else {
      // If no specific planner ID, show clients for current user if they're a planner
      if ((session.user as any).userType === 'planner') {
        query.plannerId = session.user.id
      }
    }

    const clients = await Client.find(query)
      .populate('plannerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100)

    const response = NextResponse.json({
      success: true,
      data: clients,
      count: clients.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch clients",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only planners can create clients
    if ((session.user as any).userType !== 'planner') {
      return NextResponse.json({ error: "Only planners can create clients" }, { status: 403 })
    }

    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name"],
        },
        { status: 400 },
      )
    }

    const client = await Client.create({
      ...body,
      plannerId: session.user.id
    })

    const response = NextResponse.json(
      {
        success: true,
        data: client,
        message: "Client created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create client",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    const body = await request.json()
    
    // Only the planner who created the client can update it
    const client = await Client.findOneAndUpdate(
      { _id: clientId, plannerId: session.user.id },
      body,
      { new: true }
    )

    if (!client) {
      return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: client })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    // Only the planner who created the client can delete it
    const client = await Client.findOneAndDelete({
      _id: clientId,
      plannerId: session.user.id
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Client deleted successfully" })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}`;

  fs.writeFileSync(path.join(process.cwd(), 'app/api/clients/route.ts'), clientsRoute);
  console.log('✅ Fixed clients API route');
};

// Fix vendors route
const fixVendorsRoute = () => {
  console.log('📝 Fixing vendors API route...');
  
  const vendorsRoute = `import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const isVerified = searchParams.get("isVerified")

    let query: any = { isActive: true }

    if (vendorId) {
      const vendor = await Vendor.findById(vendorId).populate('owner', 'firstName lastName email')
      if (!vendor) {
        return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: vendor })
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' }
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query['pricing.startingPrice'] = {}
      if (minPrice) query['pricing.startingPrice'].$gte = Number(minPrice)
      if (maxPrice) query['pricing.startingPrice'].$lte = Number(maxPrice)
    }

    if (isVerified !== null && isVerified !== undefined) {
      query.isVerified = isVerified === 'true'
    }

    const vendors = await Vendor.find(query)
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: vendors,
      count: vendors.length,
      filters: { category, location, minPrice, maxPrice, isVerified },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.businessName || !body.category || !body.description || !body.location || !body.contact || !body.pricing) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "businessName", "category", "description", "location", "contact", "pricing"],
        },
        { status: 400 },
      )
    }

    const vendor = await Vendor.create({
      ...body,
      owner: session.user.id
    })

    const response = NextResponse.json(
      {
        success: true,
        data: vendor,
        message: "Vendor created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create vendor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    
    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 })
    }

    const body = await request.json()
    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, owner: session.user.id },
      body,
      { new: true }
    )

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    
    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 })
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, owner: session.user.id },
      { isActive: false },
      { new: true }
    )

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Vendor deactivated successfully" })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { vendorId, services, portfolio, packages, availability, onboardingComplete } = body
    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Missing vendorId" }, { status: 400 })
    }
    const update: any = {}
    if (services) update.services = services
    if (portfolio) update.portfolio = portfolio
    if (packages) update["pricing.packages"] = packages
    if (availability) update.availability = availability
    if (typeof onboardingComplete === 'boolean') update.onboardingComplete = onboardingComplete
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { $set: update }, { new: true })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    console.error("Error updating vendor onboarding:", error)
    return NextResponse.json({ success: false, error: "Failed to update vendor onboarding", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}`;

  fs.writeFileSync(path.join(process.cwd(), 'app/api/vendors/route.ts'), vendorsRoute);
  console.log('✅ Fixed vendors API route');
};

// Fix other API routes
const fixOtherApiRoutes = () => {
  console.log('📝 Fixing other API routes...');
  
  // Fix reviews route
  const reviewsRoute = `import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Review } from "@/lib/models/review"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")
    const vendorId = searchParams.get("vendorId")
    const userId = searchParams.get("userId")

    let query: any = {}

    if (reviewId) {
      const review = await Review.findById(reviewId).populate('vendorId', 'name businessName').populate('userId', 'firstName lastName')
      if (!review) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: review })
    }

    if (vendorId) {
      query.vendorId = vendorId
    }

    if (userId) {
      query.userId = userId
    }

    const reviews = await Review.find(query)
      .populate('vendorId', 'name businessName')
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50)

    const response = NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.vendorId || !body.rating) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["vendorId", "rating"],
        },
        { status: 400 },
      )
    }

    // Check if user already reviewed this vendor
    const existingReview = await Review.findOne({
      vendorId: body.vendorId,
      userId: session.user.id
    })

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this vendor",
        },
        { status: 409 },
      )
    }

    const review = await Review.create({
      ...body,
      userId: session.user.id
    })

    const response = NextResponse.json(
      {
        success: true,
        data: review,
        message: "Review created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create review",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")
    
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    const body = await request.json()
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId: session.user.id },
      body,
      { new: true }
    )

    if (!review) {
      return NextResponse.json({ error: "Review not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")
    
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      userId: session.user.id
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}`;

  fs.writeFileSync(path.join(process.cwd(), 'app/api/reviews/route.ts'), reviewsRoute);
  console.log('✅ Fixed reviews API route');
};

// Fix lazy loading component
const fixLazyLoading = () => {
  console.log('📝 Fixing lazy loading component...');
  
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
function createLazyComponent(importPath: string, componentName: string) {
  return lazy(() => 
    import(importPath).then(module => ({
      default: (module as any)[componentName] || module.default || module
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

  fs.writeFileSync(path.join(process.cwd(), 'components/ui/lazy-loading.tsx'), lazyLoadingContent);
  console.log('✅ Fixed lazy loading component');
};

// Run all fixes
fixApiRoutes();
fixVendorsRoute();
fixOtherApiRoutes();
fixLazyLoading();

console.log('🎉 TypeScript error fixes completed!');
console.log('📝 Fixed API routes, lazy loading, and type issues');
console.log('🔄 Run "npm run type-check" to verify fixes');
