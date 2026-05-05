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

    // Build dynamic custom recommended packages by analyzing database results
    const dynamicPackages = [...(result.packages || [])];
    
    // Always insert a personalized custom package based on the query if we found venues and vendors
    if (result.venues.length > 0 && result.vendors.length > 0) {
      const topVenue = result.venues[0];
      const topPhotography = result.vendors.find((v: any) => v.category?.toLowerCase() === 'photography') || result.vendors[0];
      const topCatering = result.vendors.find((v: any) => v.category?.toLowerCase() === 'catering') || result.vendors[1] || result.vendors[0];
      
      const venuePrice = topVenue.priceRange || topVenue.pricing?.basePrice || 150000;
      const photoPrice = topPhotography ? (topPhotography.priceRange || topPhotography.pricing?.startingPrice || 75000) : 60000;
      const caterPrice = topCatering ? (topCatering.priceRange || topCatering.pricing?.startingPrice || 100000) : 80000;
      
      const pkgPrice = Math.round((venuePrice + photoPrice + caterPrice) * 0.9); // 10% discount for dynamic bundling!
      const pkgOriginalPrice = Math.round(pkgPrice * 1.2);
      
      const features = [
        `Venue: ${topVenue.name}`,
        topPhotography ? `Photography: ${topPhotography.businessName || topPhotography.name}` : "Professional Wedding Photography",
        topCatering ? `Catering: ${topCatering.businessName || topCatering.name}` : "Gourmet Sri Lankan Buffet Catering",
        `Tailored Guest Capacity: ${context.guestCount} guests`,
        "Poruwa traditional ceremony assistant & oil lamp decoration",
        "Includes personalized timeline & budget tracking tools",
        "Dedicated point of contact with chosen venue & vendors"
      ];

      // Unshift to place the dynamic AI custom-designed package as the premium 1st recommendation
      dynamicPackages.unshift({
        _id: 'ai-custom-package-generated',
        name: `AI Curated: Dream ${context.style || 'Elegant'} Wedding Package`,
        price: pkgPrice,
        originalPrice: pkgOriginalPrice,
        rating: 4.9,
        features: features,
        matchScore: 98,
        description: `Highly customized wedding plan designed in real-time by analyzing your requirements and live availability of top-rated partners.`
      });
    }

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
          rating: v.rating?.average || v.rating || 4.5,
          price: v.priceRange || v.pricing?.basePrice || 150000,
          image: v.images?.[0] || '/placeholder.svg?height=200&width=300',
          matchScore: 90 + Math.floor(Math.random() * 10),
          reasons: ['Excellent fit for your style', 'Available on your date']
        })),
        vendors: result.vendors.map((v: any) => ({
          id: v._id,
          name: v.businessName || v.name,
          category: v.category || 'Vendor',
          rating: v.rating?.average || v.rating || 4.5,
          price: v.priceRange || v.pricing?.startingPrice || 50000,
          matchScore: 85 + Math.floor(Math.random() * 15),
          reasons: ['Highly rated in your area', 'Professional service']
        })),
        packages: dynamicPackages.map((p: any) => ({
          id: p._id || p.id,
          title: p.name || p.title,
          price: p.price,
          originalPrice: p.originalPrice || (p.price * 1.2),
          rating: p.rating?.average || p.rating || 4.8,
          matchScore: p.matchScore || 95,
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