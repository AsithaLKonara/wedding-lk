import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import { Service } from "@/lib/models/service"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { query, location, date, guests } = body

    // Process AI search with real database integration
    const aiResponse = await processAISearch({
      query,
      location,
      date,
      guests,
    })

    return NextResponse.json({
      success: true,
      data: aiResponse,
      message: "AI search completed successfully",
    })
  } catch (error) {
    console.error("AI Search error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "AI search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Enhanced AI processing function with real database integration
async function processAISearch(searchData: any) {
  const { query, location, guests } = searchData
  
  // Extract wedding style and preferences from query
  const weddingStyle = extractWeddingStyle(query)
  const budget = estimateBudget(query)
  const preferences = extractPreferences(query)
  
  // Search real venues from database
  const venueQuery: any = { isActive: true }
  if (location) {
    venueQuery.location = { $regex: location, $options: "i" }
  }
  if (guests) {
    venueQuery.capacity = { $gte: parseInt(guests) }
  }
  
  const venues = await (Venue as any).find(venueQuery)
    .sort({ rating: -1 })
    .limit(5)
  
  // Search real vendors from database
  const vendorQuery: any = { isActive: true, isVerified: true }
  if (location) {
    vendorQuery["location.city"] = { $regex: location, $options: "i" }
  }
  
  const vendors = await (Vendor as any).find(vendorQuery)
    .sort({ rating: -1 })
    .limit(5)
  
  // Search services
  const services = await (Service as any).find({ isActive: true })
    .populate('vendorId', 'name businessName')
    .sort({ createdAt: -1 })
    .limit(5)

  // Generate AI insights based on real data
  const insights = generateInsights(venues, vendors, searchData)
  
  // Calculate match scores for recommendations
  const venueRecommendations = venues.map(venue => ({
    ...venue.toObject(),
    matchScore: calculateVenueMatchScore(venue, searchData),
    reasons: generateVenueReasons(venue, searchData)
  })).sort((a, b) => b.matchScore - a.matchScore)

  const vendorRecommendations = vendors.map(vendor => ({
    ...vendor.toObject(),
    matchScore: calculateVendorMatchScore(vendor, searchData),
    reasons: generateVendorReasons(vendor, searchData)
  })).sort((a, b) => b.matchScore - a.matchScore)

  return {
    interpretation: {
      weddingStyle,
      budget,
      preferences,
    },
    recommendations: {
      venues: venueRecommendations,
      vendors: vendorRecommendations,
      services: services.map(service => service.toObject()),
    },
    insights,
    searchStats: {
      totalVenues: venues.length,
      totalVendors: vendors.length,
      totalServices: services.length,
    }
  }
}

function extractWeddingStyle(query: string) {
  const styles = ["beach", "garden", "traditional", "modern", "luxury", "rustic", "indoor", "outdoor"]
  const lowerQuery = query.toLowerCase()
  return styles.find((style) => lowerQuery.includes(style)) || "modern"
}

function estimateBudget(query: string) {
  if (query.toLowerCase().includes("luxury") || query.toLowerCase().includes("premium")) {
    return { min: 800000, max: 1500000 }
  } else if (query.toLowerCase().includes("budget") || query.toLowerCase().includes("affordable")) {
    return { min: 300000, max: 600000 }
  }
  return { min: 500000, max: 900000 }
}

function extractPreferences(query: string) {
  const preferences = []
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("music") || lowerQuery.includes("band")) {
    preferences.push("Live music")
  }
  if (lowerQuery.includes("photo") || lowerQuery.includes("photography")) {
    preferences.push("Professional photography")
  }
  if (lowerQuery.includes("food") || lowerQuery.includes("cuisine")) {
    preferences.push("Specific cuisine")
  }
  if (lowerQuery.includes("decoration") || lowerQuery.includes("flowers")) {
    preferences.push("Custom decoration")
  }
  if (lowerQuery.includes("dj") || lowerQuery.includes("dancing")) {
    preferences.push("DJ and dancing")
  }

  return preferences
}

function calculateVenueMatchScore(venue: any, searchData: any) {
  let score = 0
  
  // Base score from rating
  score += (venue.rating || 0) * 20
  
  // Location match
  if (searchData.location && venue.location?.toLowerCase().includes(searchData.location.toLowerCase())) {
    score += 30
  }
  
  // Capacity match
  if (searchData.guests && venue.capacity >= parseInt(searchData.guests)) {
    score += 25
  }
  
  // Price range match
  if (searchData.budget && venue.price) {
    const budget = estimateBudget(searchData.query)
    if (venue.price >= budget.min && venue.price <= budget.max) {
      score += 25
    }
  }
  
  return Math.min(score, 100)
}

function calculateVendorMatchScore(vendor: any, searchData: any) {
  let score = 0
  
  // Base score from rating
  score += (vendor.rating || 0) * 20
  
  // Location match
  if (searchData.location && vendor.location?.city?.toLowerCase().includes(searchData.location.toLowerCase())) {
    score += 30
  }
  
  // Category match based on query
  const query = searchData.query.toLowerCase()
  if (vendor.category) {
    if (query.includes("photo") && vendor.category.toLowerCase().includes("photography")) {
      score += 25
    } else if (query.includes("music") && vendor.category.toLowerCase().includes("music")) {
      score += 25
    } else if (query.includes("food") && vendor.category.toLowerCase().includes("catering")) {
      score += 25
    } else if (query.includes("decoration") && vendor.category.toLowerCase().includes("decoration")) {
      score += 25
    }
  }
  
  // Verification bonus
  if (vendor.isVerified) {
    score += 10
  }
  
  return Math.min(score, 100)
}

function generateVenueReasons(venue: any, searchData: any) {
  const reasons = []
  
  if (venue.rating >= 4.5) {
    reasons.push("Highly rated venue")
  }
  
  if (searchData.guests && venue.capacity >= parseInt(searchData.guests)) {
    reasons.push(`Perfect capacity for ${searchData.guests} guests`)
  }
  
  if (venue.amenities && venue.amenities.length > 0) {
    reasons.push("Great amenities included")
  }
  
  if (venue.location && searchData.location && venue.location.toLowerCase().includes(searchData.location.toLowerCase())) {
    reasons.push("Located in your preferred area")
  }
  
  return reasons
}

function generateVendorReasons(vendor: any, searchData: any) {
  const reasons = []
  
  if (vendor.rating >= 4.5) {
    reasons.push("Excellent reviews")
  }
  
  if (vendor.isVerified) {
    reasons.push("Verified professional")
  }
  
  if (vendor.experience) {
    reasons.push(`Experienced (${vendor.experience} years)`)
  }
  
  if (vendor.location?.city && searchData.location && vendor.location.city.toLowerCase().includes(searchData.location.toLowerCase())) {
    reasons.push("Local to your area")
  }
  
  return reasons
}

function generateInsights(venues: any[], vendors: any[], searchData: any) {
  const insights = []
  
  if (venues.length === 0) {
    insights.push("No venues found matching your criteria. Try expanding your search area or adjusting your requirements.")
  } else if (venues.length < 3) {
    insights.push("Limited venues available. Consider booking early or expanding your search criteria.")
  } else {
    insights.push(`Found ${venues.length} venues that match your requirements.`)
  }
  
  if (vendors.length > 0) {
    const avgRating = vendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / vendors.length
    if (avgRating >= 4.5) {
      insights.push("Excellent vendor options available with high ratings.")
    }
  }
  
  if (searchData.guests && parseInt(searchData.guests) > 200) {
    insights.push("For large weddings, consider booking 6-12 months in advance for better availability.")
  }
  
  if (searchData.location && searchData.location.toLowerCase().includes("colombo")) {
    insights.push("Colombo offers the widest selection of venues and vendors.")
  }
  
  return insights
}