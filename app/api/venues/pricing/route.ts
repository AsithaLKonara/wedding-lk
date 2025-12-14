import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const date = searchParams.get('date')
    const guests = searchParams.get('guests')

    if (!venueId) {
      return NextResponse.json(
        { error: "Venue ID is required" },
        { status: 400 }
      )
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      )
    }

    // Get base pricing
    const basePricing = venue.pricing || {
      basePrice: 0,
      perPerson: 0,
      minimumGuests: 0
    }

    // Calculate pricing based on guest count
    let totalPrice = basePricing.basePrice
    const perPersonPrice = basePricing.perPerson
    const minimumCharge = basePricing.minimumGuests

    if (guests) {
      const guestCount = parseInt(guests)
      if (guestCount > minimumCharge) {
        totalPrice += (guestCount - minimumCharge) * perPersonPrice
      }
    }

    // Get seasonal pricing if available
    let seasonalAdjustment = 0
    if (date && venue.seasonalPricing) {
      const requestDate = new Date(date)
      const month = requestDate.getMonth() + 1 // 1-12
      
      const seasonal = venue.seasonalPricing.find((s: any) => 
        month >= s.startMonth && month <= s.endMonth
      )
      
      if (seasonal) {
        seasonalAdjustment = seasonal.adjustment
        totalPrice += (totalPrice * seasonal.adjustment) / 100
      }
    }

    // Get package pricing if available
    const packages = venue.packages || []
    const availablePackages = packages.map((pkg: any) => ({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      includes: pkg.includes || [],
      minGuests: pkg.minGuests,
      maxGuests: pkg.maxGuests
    }))

    // Calculate additional services
    const additionalServices = venue.additionalServices || []
    const servicePricing = additionalServices.map((service: any) => ({
      name: service.name,
      description: service.description,
      price: service.price,
      priceType: service.priceType, // fixed, per-person, per-hour
      required: service.required || false
    }))

    return NextResponse.json({
      venueId,
      basePricing: {
        basePrice: basePricing.basePrice,
        perPerson: perPersonPrice,
        minimumGuests: minimumCharge
      },
      calculatedPrice: {
        total: Math.round(totalPrice),
        base: basePricing.basePrice,
        perPerson: perPersonPrice,
        seasonalAdjustment: Math.round(seasonalAdjustment * 100) / 100
      },
      packages: availablePackages,
      additionalServices: servicePricing,
      currency: venue.currency || 'LKR',
      depositRequired: venue.depositRequired || false,
      depositPercentage: venue.depositPercentage || 0
    })

  } catch (error) {
    console.error("Error fetching venue pricing:", error)
    return NextResponse.json(
      { error: "Failed to fetch venue pricing" },
      { status: 500 }
    )
  }
} 