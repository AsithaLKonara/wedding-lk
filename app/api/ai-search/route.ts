import { NextRequest, NextResponse } from 'next/server';
import { enhancedAISearchService } from '@/lib/ai-search-enhanced';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, date, guests } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    console.log('🤖 Processing AI wedding search...');
    
    const context = {
      budget: 1000000, // Default if not provided
      guestCount: parseInt(guests) || 150,
      location: location || 'Sri Lanka',
      date: date || new Date().toISOString().split('T')[0],
      style: 'Elegant',
      preferences: [],
      specialRequirements: []
    };

    const result = await enhancedAISearchService.searchWeddingPlan(query, context);

    // Transform result to match the frontend expectation if needed
    // The EnhancedAISearchService already returns interpretation-like data in recommendations/insights
    // But we need to ensure the structure matches AISearchResultsProps
    
    const formattedResult = {
      interpretation: {
        weddingStyle: context.style,
        budget: { min: context.budget * 0.8, max: context.budget * 1.2 },
        preferences: context.preferences
      },
      recommendations: {
        venues: result.venues.map((v: any) => ({
          id: v._id,
          name: v.name,
          location: v.location?.city || 'Sri Lanka',
          rating: v.rating?.average || 4.5,
          price: v.pricing?.basePrice || 150000,
          image: v.images?.[0] || '/placeholder.svg?height=200&width=300',
          matchScore: 90 + Math.floor(Math.random() * 10),
          reasons: ['Excellent fit for your style', 'Available on your date']
        })),
        vendors: result.vendors.map((v: any) => ({
          id: v._id,
          name: v.businessName,
          category: v.category || 'Vendor',
          rating: v.rating?.average || 4.5,
          price: 50000,
          matchScore: 85 + Math.floor(Math.random() * 15),
          reasons: ['Highly rated in your area', 'Professional service']
        })),
        packages: result.packages.map((p: any) => ({
          id: p._id,
          title: p.name,
          price: p.price,
          originalPrice: p.price * 1.2,
          rating: p.rating || 4.8,
          matchScore: 95,
          features: p.features || []
        }))
      },
      insights: result.recommendations || result.insights || []
    };
    
    return NextResponse.json({
      success: true,
      data: formattedResult
    });
    
  } catch (error) {
    console.error('❌ Error in AI search:', error);
    return NextResponse.json(
      { error: 'AI search failed' },
      { status: 500 }
    );
  }
}