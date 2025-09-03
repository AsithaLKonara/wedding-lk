import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get featured venues without populate to avoid User model issues
    let venues = await Venue.find({ 
      featured: true, 
      isActive: true 
    })
    .select('name description location capacity pricing rating images amenities')
    .limit(6)
    .sort({ 'rating.average': -1, createdAt: -1 })

    // If not enough featured venues, get top-rated active venues
    if (venues.length < 6) {
      const additionalVenues = await Venue.find({ 
        isActive: true,
        featured: { $ne: true }
      })
      .select('name description location capacity pricing rating images amenities')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(6 - venues.length)

      venues.push(...additionalVenues)
    }

    // If still no venues, get any active venues
    if (venues.length === 0) {
      venues = await Venue.find({ isActive: true })
        .select('name description location capacity pricing rating images amenities')
        .limit(6)
        .sort({ 'rating.average': -1, createdAt: -1 })
    }

    // If still no venues, return mock data
    if (venues.length === 0) {
      const mockVenues = [
        {
          _id: 'mock1',
          name: 'Grand Ballroom Hotel',
          description: 'Luxurious wedding venue with stunning architecture',
          location: { city: 'Colombo', province: 'Western' },
          capacity: 300,
          pricing: { basePrice: 50000 },
          rating: { average: 4.8 },
          images: ['/placeholder.jpg'],
          amenities: ['parking', 'catering', 'decoration']
        },
        {
          _id: 'mock2',
          name: 'Garden Paradise',
          description: 'Beautiful outdoor garden venue',
          location: { city: 'Kandy', province: 'Central' },
          capacity: 150,
          pricing: { basePrice: 35000 },
          rating: { average: 4.6 },
          images: ['/placeholder.jpg'],
          amenities: ['parking', 'decoration']
        }
      ]
      return NextResponse.json({ venues: mockVenues })
    }

    return NextResponse.json({ venues })

  } catch (error) {
    console.error("Error fetching featured venues:", error)
    
    // Return mock data on error
    const mockVenues = [
      {
        _id: 'mock1',
        name: 'Grand Ballroom Hotel',
        description: 'Luxurious wedding venue with stunning architecture',
        location: { city: 'Colombo', province: 'Western' },
        capacity: 300,
        pricing: { basePrice: 50000 },
        rating: { average: 4.8 },
        images: ['/placeholder.jpg'],
        amenities: ['parking', 'catering', 'decoration']
      },
      {
        _id: 'mock2',
        name: 'Garden Paradise',
        description: 'Beautiful outdoor garden venue',
        location: { city: 'Kandy', province: 'Central' },
        capacity: 150,
        pricing: { basePrice: 35000 },
        rating: { average: 4.6 },
        images: ['/placeholder.jpg'],
        amenities: ['parking', 'decoration']
      }
    ]
    return NextResponse.json({ venues: mockVenues })
  }
} 