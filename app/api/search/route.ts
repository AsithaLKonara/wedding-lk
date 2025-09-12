import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';
import VenueBoost from '@/lib/models/venueBoost';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function searchHandler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Create cache key
    const cacheKey = `search:${searchParams.toString()}`;
    
    // Check cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedResult.data);
    }
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const priceMin = parseInt(searchParams.get('priceRange')?.split(',')[0] || '0');
    const priceMax = parseInt(searchParams.get('priceRange')?.split(',')[1] || '1000000');
    const rating = parseInt(searchParams.get('rating') || '0');
    const features = searchParams.get('features')?.split(',') || [];
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Limit results

    // Build search criteria
    const searchCriteria: any = {};

    if (query) {
      // Use MongoDB text search if available, otherwise fallback to regex
      try {
        searchCriteria.$text = { $search: query };
      } catch (error) {
        // Fallback to regex search
        searchCriteria.$or = [
          { businessName: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'services.name': { $regex: query, $options: 'i' } },
          { 'services.description': { $regex: query, $options: 'i' } }
        ];
      }
    }

    if (category) {
      searchCriteria.category = { $regex: category, $options: 'i' };
    }

    if (location) {
      searchCriteria.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.province': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }

    if (priceMin > 0 || priceMax < 1000000) {
      searchCriteria['pricing.startingPrice'] = { $gte: priceMin, $lte: priceMax };
    }

    if (rating > 0) {
      searchCriteria['rating.average'] = { $gte: rating };
    }

    if (features.length > 0) {
      searchCriteria.amenities = { $in: features };
    }

    // Build sort criteria
    let sortCriteria: any = {};
    switch (sortBy) {
      case 'price':
        sortCriteria['pricing.startingPrice'] = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'rating':
        sortCriteria['rating.average'] = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'newest':
        sortCriteria.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
      default: // relevance
        sortCriteria['rating.average'] = -1;
        sortCriteria['rating.count'] = -1;
    }

    const results: any[] = [];

    // Get all active boosts upfront to avoid N+1 queries
    const activeBoosts = await VenueBoost.find({
      status: 'active',
      endDate: { $gte: new Date() }
    }).lean();

    const vendorBoosts = new Map();
    const venueBoosts = new Map();
    
    activeBoosts.forEach(boost => {
      if (boost.vendorId) {
        vendorBoosts.set(boost.vendorId.toString(), boost);
      }
      if (boost.venueId) {
        venueBoosts.set(boost.venueId.toString(), boost);
      }
    });

    // Search vendors
    if (type === 'all' || type === 'vendors') {
      const vendors = await Vendor.find(searchCriteria)
        .sort(sortCriteria)
        .limit(limit)
        .lean();

      vendors.forEach(vendor => {
        const vendorId = (vendor as any)._id.toString();
        const activeBoost = vendorBoosts.get(vendorId);

        results.push({
          id: vendorId,
          name: vendor.businessName,
          description: vendor.description,
          type: 'vendor',
          category: vendor.category,
          location: vendor.location,
          price: vendor.pricing?.startingPrice || 0,
          rating: vendor.rating?.average || 0,
          reviewCount: vendor.rating?.count || 0,
          image: vendor.avatar || '/placeholder-venue.jpg',
          isBoosted: !!activeBoost,
          features: vendor.amenities || [],
          availability: vendor.availability || 'Available',
          contact: {
            phone: vendor.contact?.phone || '',
            email: vendor.contact?.email || ''
          },
          boostedAt: activeBoost?.createdAt
        });
      });
    }

    // Search venues
    if (type === 'all' || type === 'venues') {
      const venues = await Venue.find(searchCriteria)
        .sort(sortCriteria)
        .limit(limit)
        .lean();

      venues.forEach(venue => {
        const venueId = (venue as any)._id.toString();
        const activeBoost = venueBoosts.get(venueId);

        results.push({
          id: venueId,
          name: venue.name,
          description: venue.description,
          type: 'venue',
          category: 'venue',
          location: venue.location,
          price: venue.pricing?.basePrice || 0,
          rating: venue.rating?.average || 0,
          reviewCount: venue.rating?.count || 0,
          image: venue.images?.[0] || '/placeholder-venue.jpg',
          isBoosted: !!activeBoost,
          features: venue.amenities || [],
          availability: venue.availability || 'Available',
          contact: {
            phone: '',
            email: ''
          },
          boostedAt: activeBoost?.createdAt
        });
      });
    }

    // Sort boosted items first if sorting by relevance
    if (sortBy === 'relevance') {
      results.sort((a, b) => {
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return 0;
      });
    }

    // Apply additional sorting
    if (sortBy !== 'relevance') {
      results.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;
        
        if (sortBy === 'price') {
          aValue = a.price || 0;
          bValue = b.price || 0;
        } else if (sortBy === 'rating') {
          aValue = a.rating || 0;
          bValue = b.rating || 0;
        } else if (sortBy === 'newest') {
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
        }
        
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    const responseData = {
      success: true,
      results: results.slice(0, limit), // Limit results
      total: results.length,
      filters: {
        query,
        type,
        category,
        location,
        priceRange: [priceMin, priceMax],
        rating,
        features,
        sortBy,
        sortOrder
      }
    };

    // Cache the result
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.public,
  searchHandler
);
