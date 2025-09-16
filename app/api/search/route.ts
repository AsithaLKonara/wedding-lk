import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Vendor, Venue, ServicePackage } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, vendors, venues, packages
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const rating = searchParams.get('rating') || ''
    const sortBy = searchParams.get('sortBy') || 'relevance' // relevance, price, rating, name
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    await connectDB()

    let results: any[] = []
    let totalCount = 0

    // Build search criteria
    const searchCriteria: any = {}
    
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }

    if (category) {
      searchCriteria.category = category
    }

    if (location) {
      searchCriteria.location = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      searchCriteria.price = {}
      if (minPrice) searchCriteria.price.$gte = parseInt(minPrice)
      if (maxPrice) searchCriteria.price.$lte = parseInt(maxPrice)
    }

    if (rating) {
      searchCriteria.rating = { $gte: parseFloat(rating) }
    }

    // Search based on type
    if (type === 'all' || type === 'vendors') {
      const vendorResults = await Vendor.find(searchCriteria)
        .populate('userId', 'name email image')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(getSortCriteria(sortBy))

      const vendorCount = await Vendor.countDocuments(searchCriteria)
      
      results = results.concat(vendorResults.map(vendor => ({
        ...vendor.toObject(),
        type: 'vendor',
        searchScore: calculateSearchScore(vendor, query)
      })))
      
      totalCount += vendorCount
    }

    if (type === 'all' || type === 'venues') {
      const venueResults = await Venue.find(searchCriteria)
        .populate('userId', 'name email image')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(getSortCriteria(sortBy))

      const venueCount = await Venue.countDocuments(searchCriteria)
      
      results = results.concat(venueResults.map(venue => ({
        ...venue.toObject(),
        type: 'venue',
        searchScore: calculateSearchScore(venue, query)
      })))
      
      totalCount += venueCount
    }

    if (type === 'all' || type === 'packages') {
      const packageResults = await ServicePackage.find(searchCriteria)
        .populate('vendorId', 'name email image')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(getSortCriteria(sortBy))

      const packageCount = await ServicePackage.countDocuments(searchCriteria)
      
      results = results.concat(packageResults.map(pkg => ({
        ...pkg.toObject(),
        type: 'package',
        searchScore: calculateSearchScore(pkg, query)
      })))
      
      totalCount += packageCount
    }

    // Sort results if needed
    if (sortBy === 'relevance' && query) {
      results.sort((a, b) => b.searchScore - a.searchScore)
    }

    // Apply pagination to combined results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      results: paginatedResults,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      filters: {
        query,
        type,
        category,
        location,
        minPrice,
        maxPrice,
        rating,
        sortBy
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getSortCriteria(sortBy: string) {
  switch (sortBy) {
    case 'price':
      return { price: 1 }
    case 'price-desc':
      return { price: -1 }
    case 'rating':
      return { rating: -1 }
    case 'name':
      return { name: 1 }
    case 'created':
      return { createdAt: -1 }
    default:
      return { createdAt: -1 }
  }
}

function calculateSearchScore(item: any, query: string): number {
  if (!query) return 0

  let score = 0
  const queryLower = query.toLowerCase()

  // Exact name match gets highest score
  if (item.name?.toLowerCase().includes(queryLower)) {
    score += 10
  }

  // Description match gets medium score
  if (item.description?.toLowerCase().includes(queryLower)) {
    score += 5
  }

  // Tags match gets lower score
  if (item.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
    score += 3
  }

  // Category match gets bonus
  if (item.category?.toLowerCase().includes(queryLower)) {
    score += 2
  }

  // Location match gets bonus
  if (item.location?.toLowerCase().includes(queryLower)) {
    score += 1
  }

  return score
}