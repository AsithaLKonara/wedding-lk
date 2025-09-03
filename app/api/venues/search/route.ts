import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const minCapacity = searchParams.get('minCapacity') || ''
    const maxCapacity = searchParams.get('maxCapacity') || ''
    const minRating = searchParams.get('minRating') || '0'
    const maxPrice = searchParams.get('maxPrice') || ''
    const amenities = searchParams.get('amenities') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock venue data for search
    const mockVenues = [
      {
        _id: "venue1",
        name: "Grand Ballroom Colombo",
        description: "Elegant ballroom in the heart of Colombo",
        location: {
          address: "123 Galle Road, Colombo 03",
          city: "Colombo",
          province: "Western Province",
          coordinates: { lat: 6.9271, lng: 79.8612 }
        },
        capacity: { min: 50, max: 500 },
        pricing: { basePrice: 150000, currency: "LKR" },
        rating: { average: 4.5, count: 120 },
        amenities: ["Parking", "AC", "Sound System", "Catering"],
        images: ["/placeholder.svg"],
        isActive: true
      },
      {
        _id: "venue2", 
        name: "Beachside Resort Negombo",
        description: "Beautiful beachfront venue with ocean views",
        location: {
          address: "456 Beach Road, Negombo",
          city: "Negombo", 
          province: "Western Province",
          coordinates: { lat: 7.2086, lng: 79.8358 }
        },
        capacity: { min: 30, max: 200 },
        pricing: { basePrice: 200000, currency: "LKR" },
        rating: { average: 4.8, count: 85 },
        amenities: ["Beach Access", "Parking", "AC", "Catering"],
        images: ["/placeholder.svg"],
        isActive: true
      },
      {
        _id: "venue3",
        name: "Mountain View Estate Kandy", 
        description: "Scenic mountain venue with panoramic views",
        location: {
          address: "789 Hill Road, Kandy",
          city: "Kandy",
          province: "Central Province", 
          coordinates: { lat: 7.2906, lng: 80.6337 }
        },
        capacity: { min: 25, max: 150 },
        pricing: { basePrice: 120000, currency: "LKR" },
        rating: { average: 4.3, count: 65 },
        amenities: ["Mountain Views", "Parking", "Garden", "Catering"],
        images: ["/placeholder.svg"],
        isActive: true
      }
    ]

    // Simple filtering logic
    let filteredVenues = mockVenues.filter(venue => {
      if (query && !venue.name.toLowerCase().includes(query.toLowerCase()) && 
          !venue.description.toLowerCase().includes(query.toLowerCase()) &&
          !venue.location.city.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (location && !venue.location.city.toLowerCase().includes(location.toLowerCase())) {
        return false
      }
      if (minCapacity && venue.capacity.max < parseInt(minCapacity)) {
        return false
      }
      if (maxCapacity && venue.capacity.min > parseInt(maxCapacity)) {
        return false
      }
      if (minRating && venue.rating.average < parseFloat(minRating)) {
        return false
      }
      return true
    })

    // Apply pagination
    const totalCount = filteredVenues.length
    const paginatedVenues = filteredVenues.slice(offset, offset + limit)

    return NextResponse.json({
      venues: paginatedVenues,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("Error searching venues:", error)
    return NextResponse.json(
      { error: "Failed to search venues" },
      { status: 500 }
    )
  }
} 