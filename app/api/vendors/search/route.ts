import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''
    const minRating = searchParams.get('minRating') || '0'
    const maxPrice = searchParams.get('maxPrice') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock vendor data for search
    const mockVendors = [
      {
        _id: "vendor1",
        name: "John Smith",
        businessName: "Elegant Photography Studio",
        category: "photographer",
        description: "Professional wedding photographer with 10+ years experience",
        location: {
          address: "123 Main Street, Colombo 07",
          city: "Colombo",
          province: "Western Province",
          coordinates: { lat: 6.9271, lng: 79.8612 }
        },
        rating: { average: 4.7, count: 95 },
        pricing: { startingPrice: 50000, currency: "LKR" },
        portfolio: ["/placeholder.svg", "/placeholder.svg"],
        services: [
          { name: "Wedding Photography", price: 50000 },
          { name: "Pre-wedding Shoot", price: 25000 },
          { name: "Engagement Session", price: 15000 }
        ],
        isVerified: true,
        isActive: true
      },
      {
        _id: "vendor2",
        name: "Maria Silva",
        businessName: "Royal Catering Services",
        category: "caterer", 
        description: "Premium catering with authentic Sri Lankan cuisine",
        location: {
          address: "456 Food Street, Negombo",
          city: "Negombo",
          province: "Western Province",
          coordinates: { lat: 7.2086, lng: 79.8358 }
        },
        rating: { average: 4.9, count: 120 },
        pricing: { startingPrice: 80000, currency: "LKR" },
        portfolio: ["/placeholder.svg", "/placeholder.svg"],
        services: [
          { name: "Full Wedding Menu", price: 80000 },
          { name: "Appetizers Only", price: 30000 },
          { name: "Dessert Station", price: 20000 }
        ],
        isVerified: true,
        isActive: true
      },
      {
        _id: "vendor3",
        name: "David Fernando",
        businessName: "Garden Decorations",
        category: "decorator",
        description: "Beautiful floral arrangements and venue decorations",
        location: {
          address: "789 Flower Road, Kandy",
          city: "Kandy", 
          province: "Central Province",
          coordinates: { lat: 7.2906, lng: 80.6337 }
        },
        rating: { average: 4.5, count: 75 },
        pricing: { startingPrice: 40000, currency: "LKR" },
        portfolio: ["/placeholder.svg", "/placeholder.svg"],
        services: [
          { name: "Full Venue Decoration", price: 40000 },
          { name: "Flower Arrangements", price: 20000 },
          { name: "Table Settings", price: 15000 }
        ],
        isVerified: true,
        isActive: true
      }
    ]

    // Simple filtering logic
    let filteredVendors = mockVendors.filter(vendor => {
      if (query && !vendor.name.toLowerCase().includes(query.toLowerCase()) && 
          !vendor.businessName.toLowerCase().includes(query.toLowerCase()) &&
          !vendor.description.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (category && vendor.category !== category) {
        return false
      }
      if (location && !vendor.location.city.toLowerCase().includes(location.toLowerCase())) {
        return false
      }
      if (minRating && vendor.rating.average < parseFloat(minRating)) {
        return false
      }
      return true
    })

    // Apply pagination
    const totalCount = filteredVendors.length
    const paginatedVendors = filteredVendors.slice(offset, offset + limit)

    return NextResponse.json({
      vendors: paginatedVendors,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("Error searching vendors:", error)
    return NextResponse.json(
      { error: "Failed to search vendors" },
      { status: 500 }
    )
  }
}