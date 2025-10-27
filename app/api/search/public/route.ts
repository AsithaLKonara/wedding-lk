import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Venue, Vendor } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const city = searchParams.get('city') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    await connectDB()

    const searchRegex = new RegExp(query, 'i')
    
    // Build search conditions
    const venueConditions: any = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { location: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }

    const vendorConditions: any = {
      $or: [
        { businessName: searchRegex },
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ],
      isActive: true
    }

    if (city) {
      venueConditions['location.city'] = { $regex: city, $options: 'i' }
      vendorConditions['location.city'] = { $regex: city, $options: 'i' }
    }

    // Execute searches in parallel
    const searchPromises: Promise<any>[] = []
    
    if (type === 'all' || type === 'venues') {
      searchPromises.push(
        Venue.find(venueConditions)
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()
          .then(venues => ({ type: 'venues', results: venues, count: venues.length }))
      )
    }

    if (type === 'all' || type === 'vendors') {
      searchPromises.push(
        Vendor.find(vendorConditions)
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()
          .then(vendors => ({ type: 'vendors', results: vendors, count: vendors.length }))
      )
    }

    const results = await Promise.all(searchPromises)

    const formattedResults = results.map(r => ({
      type: r.type,
      items: r.results,
      count: r.count
    }))

    return NextResponse.json({
      success: true,
      query,
      results: formattedResults,
      pagination: {
        page,
        limit,
        hasMore: formattedResults.some(r => r.count === limit)
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}

