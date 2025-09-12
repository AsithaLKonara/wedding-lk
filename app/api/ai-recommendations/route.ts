import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Package } from '@/lib/models/package';
import { Venue } from '@/lib/models/venue';
import { Vendor } from '@/lib/models/vendor';
import { enhancedAISearchService } from '@/lib/ai-search-enhanced';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      budget, 
      guestCount, 
      location, 
      date, 
      style, 
      preferences = [], 
      specialRequirements = [] 
    } = body;

    if (!budget || !guestCount || !location) {
      return NextResponse.json({
        success: false,
        error: 'Budget, guest count, and location are required'
      }, { status: 400 });
    }

    await connectDB();

    // Generate AI-powered recommendations
    const aiContext = {
      budget: parseInt(budget),
      guestCount: parseInt(guestCount),
      location,
      date: date || '2024-12-15',
      style: style || 'Traditional Sri Lankan',
      preferences,
      specialRequirements
    };

    const aiResult = await enhancedAISearchService.searchWeddingPlan(
      `Find wedding packages for ${guestCount} guests in ${location} with budget ${budget} LKR`,
      aiContext
    );

    // Get packages from database
    const packages = await Package.find({
      price: { $lte: budget * 1.2 }, // Allow 20% over budget for recommendations
      featured: true
    })
    .populate('venues', 'name rating images location capacity pricing')
    .populate('vendors', 'businessName category rating location services')
    .sort({ 'rating.average': -1 })
    .limit(6)
    .lean();

    // Get venues matching criteria
    const venues = await Venue.find({
      'location.city': { $regex: location, $options: 'i' },
      'capacity.max': { $gte: guestCount },
      'pricing.basePrice': { $lte: budget * 0.6 } // Venue should be max 60% of budget
    })
    .sort({ 'rating.average': -1 })
    .limit(4)
    .lean();

    // Get vendors matching criteria
    const vendors = await Vendor.find({
      $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.province': { $regex: location, $options: 'i' } }
      ],
      'rating.average': { $gte: 4.0 }
    })
    .sort({ 'rating.average': -1 })
    .limit(6)
    .lean();

    // Generate personalized package recommendations
    const personalizedPackages = packages.map((pkg, index) => {
      const matchScore = calculateMatchScore(pkg, aiContext);
      const discount = pkg.originalPrice > pkg.price ? 
        Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100) : 0;

      return {
        ...pkg,
        matchScore,
        discount,
        personalizedFeatures: generatePersonalizedFeatures(pkg, aiContext),
        whyRecommended: generateWhyRecommended(pkg, aiContext),
        badge: index === 0 ? "Best Match" : index === 1 ? "Great Value" : "Popular Choice"
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Generate budget breakdown
    const budgetBreakdown = generateBudgetBreakdown(budget, guestCount, location);

    // Generate timeline recommendations
    const timeline = generateTimeline(date, location);

    // Generate cultural insights
    const culturalInsights = generateCulturalInsights(location, style);

    return NextResponse.json({
      success: true,
      data: {
        packages: personalizedPackages,
        venues: venues.map(venue => ({
          ...venue,
          matchScore: calculateVenueMatchScore(venue, aiContext),
          whyRecommended: generateVenueWhyRecommended(venue, aiContext)
        })),
        vendors: vendors.map(vendor => ({
          ...vendor,
          matchScore: calculateVendorMatchScore(vendor, aiContext),
          whyRecommended: generateVendorWhyRecommended(vendor, aiContext)
        })),
        budgetBreakdown,
        timeline,
        culturalInsights,
        aiInsights: aiResult.culturalInsights || [],
        localTips: aiResult.localTips || []
      },
      meta: {
        searchCriteria: aiContext,
        timestamp: new Date().toISOString(),
        aiPowered: true
      }
    });

  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate AI recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function calculateMatchScore(pkg: any, context: any): number {
  let score = 0;
  
  // Budget match (40% weight)
  const budgetRatio = pkg.price / context.budget;
  if (budgetRatio <= 1) {
    score += 40;
  } else if (budgetRatio <= 1.2) {
    score += 30;
  } else {
    score += 20;
  }
  
  // Rating match (30% weight)
  score += (pkg.rating?.average || 0) * 6; // 5 stars = 30 points
  
  // Feature match (20% weight)
  const featureMatches = context.preferences.filter((pref: string) => 
    pkg.features.some((feature: string) => 
      feature.toLowerCase().includes(pref.toLowerCase())
    )
  ).length;
  score += (featureMatches / context.preferences.length) * 20;
  
  // Location match (10% weight)
  const hasLocationMatch = pkg.venues?.some((venue: any) => 
    venue.location?.city?.toLowerCase().includes(context.location.toLowerCase())
  );
  if (hasLocationMatch) score += 10;
  
  return Math.min(Math.round(score), 100);
}

function calculateVenueMatchScore(venue: any, context: any): number {
  let score = 0;
  
  // Capacity match (30% weight)
  if (venue.capacity?.max >= context.guestCount) {
    score += 30;
  }
  
  // Budget match (25% weight)
  const budgetRatio = venue.pricing?.basePrice / context.budget;
  if (budgetRatio <= 0.6) {
    score += 25;
  } else if (budgetRatio <= 0.8) {
    score += 20;
  }
  
  // Rating match (25% weight)
  score += (venue.rating?.average || 0) * 5;
  
  // Location match (20% weight)
  if (venue.location?.city?.toLowerCase().includes(context.location.toLowerCase())) {
    score += 20;
  }
  
  return Math.min(Math.round(score), 100);
}

function calculateVendorMatchScore(vendor: any, context: any): number {
  let score = 0;
  
  // Rating match (40% weight)
  score += (vendor.rating?.average || 0) * 8;
  
  // Location match (30% weight)
  if (vendor.location?.city?.toLowerCase().includes(context.location.toLowerCase())) {
    score += 30;
  }
  
  // Category relevance (30% weight)
  const relevantCategories = ['Photography', 'Catering', 'Music', 'Decoration'];
  if (relevantCategories.includes(vendor.category)) {
    score += 30;
  }
  
  return Math.min(Math.round(score), 100);
}

function generatePersonalizedFeatures(pkg: any, context: any): string[] {
  const features = [...(pkg.features || [])];
  
  // Add personalized features based on context
  if (context.guestCount > 200) {
    features.push(`Accommodates ${context.guestCount}+ guests`);
  }
  
  if (context.budget > 1000000) {
    features.push('Premium luxury experience');
  }
  
  if (context.preferences.includes('Traditional')) {
    features.push('Traditional Sri Lankan elements');
  }
  
  if (context.preferences.includes('Modern')) {
    features.push('Contemporary wedding styling');
  }
  
  return features.slice(0, 8); // Limit to 8 features
}

function generateWhyRecommended(pkg: any, context: any): string[] {
  const reasons = [];
  
  if (pkg.price <= context.budget) {
    reasons.push('Fits perfectly within your budget');
  }
  
  if (pkg.rating?.average >= 4.5) {
    reasons.push('Highly rated by previous couples');
  }
  
  if (pkg.features?.length > 6) {
    reasons.push('Comprehensive package with many inclusions');
  }
  
  if (pkg.venues?.length > 0) {
    reasons.push('Includes premium venue options');
  }
  
  return reasons;
}

function generateVenueWhyRecommended(venue: any, context: any): string[] {
  const reasons = [];
  
  if (venue.capacity?.max >= context.guestCount) {
    reasons.push(`Perfect capacity for ${context.guestCount} guests`);
  }
  
  if (venue.rating?.average >= 4.5) {
    reasons.push('Excellent reviews from previous couples');
  }
  
  if (venue.pricing?.basePrice <= context.budget * 0.6) {
    reasons.push('Great value for your budget');
  }
  
  if (venue.location?.city?.toLowerCase().includes(context.location.toLowerCase())) {
    reasons.push(`Located in your preferred area: ${context.location}`);
  }
  
  return reasons;
}

function generateVendorWhyRecommended(vendor: any, context: any): string[] {
  const reasons = [];
  
  if (vendor.rating?.average >= 4.5) {
    reasons.push('Highly rated professional service');
  }
  
  if (vendor.location?.city?.toLowerCase().includes(context.location.toLowerCase())) {
    reasons.push(`Local vendor in ${context.location}`);
  }
  
  if (vendor.category === 'Photography') {
    reasons.push('Professional wedding photography');
  }
  
  if (vendor.category === 'Catering') {
    reasons.push('Quality catering service');
  }
  
  return reasons;
}

function generateBudgetBreakdown(budget: number, guestCount: number, location: string) {
  const breakdown = {
    venue: Math.round(budget * 0.4),
    catering: Math.round(budget * 0.25),
    photography: Math.round(budget * 0.15),
    decoration: Math.round(budget * 0.1),
    music: Math.round(budget * 0.05),
    miscellaneous: Math.round(budget * 0.05)
  };
  
  return {
    total: budget,
    breakdown,
    perGuest: Math.round(budget / guestCount),
    recommendations: [
      `Allocate 40% (LKR ${breakdown.venue.toLocaleString()}) for venue rental`,
      `Set aside 25% (LKR ${breakdown.catering.toLocaleString()}) for catering`,
      `Budget 15% (LKR ${breakdown.photography.toLocaleString()}) for photography`,
      `Reserve 10% (LKR ${breakdown.decoration.toLocaleString()}) for decoration`,
      `Plan 5% (LKR ${breakdown.music.toLocaleString()}) for music/entertainment`,
      `Keep 5% (LKR ${breakdown.miscellaneous.toLocaleString()}) for miscellaneous expenses`
    ]
  };
}

function generateTimeline(date: string, location: string) {
  const weddingDate = new Date(date);
  const now = new Date();
  const monthsUntilWedding = Math.ceil((weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  return {
    monthsUntilWedding,
    timeline: [
      {
        period: '12+ months before',
        tasks: ['Set budget', 'Choose wedding date', 'Book venue', 'Hire wedding planner']
      },
      {
        period: '6-12 months before',
        tasks: ['Book photographer', 'Choose caterer', 'Order wedding dress', 'Send save-the-dates']
      },
      {
        period: '3-6 months before',
        tasks: ['Book florist', 'Order invitations', 'Plan menu', 'Book transportation']
      },
      {
        period: '1-3 months before',
        tasks: ['Finalize details', 'Send invitations', 'Schedule fittings', 'Plan rehearsal']
      },
      {
        period: '1 month before',
        tasks: ['Confirm vendors', 'Final payments', 'Pack for honeymoon', 'Relax and enjoy!']
      }
    ]
  };
}

function generateCulturalInsights(location: string, style: string) {
  const insights = [];
  
  if (location.toLowerCase().includes('kandy')) {
    insights.push('Kandy offers beautiful hill country venues with cooler weather');
    insights.push('Traditional Kandyan weddings often include cultural performances');
    insights.push('Consider the Temple of the Tooth for traditional ceremonies');
  }
  
  if (location.toLowerCase().includes('galle')) {
    insights.push('Galle provides stunning beachfront venues with colonial charm');
    insights.push('Perfect for sunset ceremonies with ocean views');
    insights.push('Historic Galle Fort offers unique photo opportunities');
  }
  
  if (location.toLowerCase().includes('colombo')) {
    insights.push('Colombo offers modern venues with excellent accessibility');
    insights.push('Wide variety of international and local cuisine options');
    insights.push('Easy access for international guests');
  }
  
  if (style.toLowerCase().includes('traditional')) {
    insights.push('Traditional Sri Lankan weddings often include oil lamp lighting');
    insights.push('Consider incorporating traditional music and dance');
    insights.push('Traditional attire adds cultural significance to the ceremony');
  }
  
  return insights;
}
