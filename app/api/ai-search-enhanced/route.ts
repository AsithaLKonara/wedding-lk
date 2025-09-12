// Enhanced AI Search API for WeddingLK
// Real LLM integration with intelligent wedding planning

import { NextRequest, NextResponse } from 'next/server';
import { enhancedAISearchService } from '@/lib/ai-search-enhanced';
import { SecurityMiddleware } from '@/lib/security-middleware';

export async function POST(request: NextRequest) {
  try {
    // Security validation
    const security = SecurityMiddleware.getInstance();
    const rateLimit = security.checkRateLimit(
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown'
    );
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const body = await request.json();
    const { query, context } = body;

    if (!query || !context) {
      return NextResponse.json(
        { error: 'Query and context are required' },
        { status: 400 }
      );
    }

    // Validate context
    const requiredFields = ['budget', 'guestCount', 'location', 'date', 'style'];
    const missingFields = requiredFields.filter(field => !context[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate AI-powered wedding plan
    const startTime = Date.now();
    const result = await enhancedAISearchService.searchWeddingPlan(query, context);
    const responseTime = Date.now() - startTime;

    const response = NextResponse.json({
      success: true,
      data: result,
      meta: {
        query,
        responseTime,
        timestamp: new Date().toISOString(),
        aiPowered: true
      }
    });

    // Add security headers
    security.setSecurityHeaders(response);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

    return response;

  } catch (error) {
    console.error('Enhanced AI search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'demo';
    const category = searchParams.get('category');

    let result: Record<string, unknown>;

    switch (action) {
      case 'demo':
        result = await handleDemo();
        break;
      case 'venues':
        result = await handleVenueRecommendations(searchParams);
        break;
      case 'vendors':
        result = await handleVendorRecommendations(searchParams, category);
        break;
      case 'budget':
        result = await handleBudgetBreakdown(searchParams);
        break;
      case 'timeline':
        result = await handleTimeline(searchParams);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = NextResponse.json({
      success: true,
      data: result,
      meta: {
        action,
        timestamp: new Date().toISOString(),
        aiPowered: true
      }
    });

    const security = SecurityMiddleware.getInstance();
    security.setSecurityHeaders(response);

    return response;

  } catch (error) {
    console.error('Enhanced AI search GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle demo request
async function handleDemo() {
  const demoContext = {
    budget: 1000000,
    guestCount: 150,
    location: 'Colombo',
    date: '2024-12-15',
    style: 'Traditional Sri Lankan',
    preferences: ['Outdoor ceremony', 'Traditional music', 'Local cuisine'],
    specialRequirements: ['Wheelchair accessible', 'Pet friendly']
  };

  const demoQuery = 'Plan a traditional Sri Lankan wedding in Colombo for 150 guests with a budget of 1 million LKR';

  return await enhancedAISearchService.searchWeddingPlan(demoQuery, demoContext);
}

// Handle venue recommendations
async function handleVenueRecommendations(searchParams: URLSearchParams) {
  const context = {
    budget: parseInt(searchParams.get('budget') || '1000000'),
    guestCount: parseInt(searchParams.get('guestCount') || '150'),
    location: searchParams.get('location') || 'Colombo',
    date: searchParams.get('date') || '2024-12-15',
    style: searchParams.get('style') || 'Traditional',
    preferences: (searchParams.get('preferences') || '').split(',').filter(Boolean),
    specialRequirements: (searchParams.get('requirements') || '').split(',').filter(Boolean)
  };

  return await enhancedAISearchService.getVenueRecommendations(context);
}

// Handle vendor recommendations
async function handleVendorRecommendations(searchParams: URLSearchParams, category?: string | null) {
  const context = {
    budget: parseInt(searchParams.get('budget') || '1000000'),
    guestCount: parseInt(searchParams.get('guestCount') || '150'),
    location: searchParams.get('location') || 'Colombo',
    date: searchParams.get('date') || '2024-12-15',
    style: searchParams.get('style') || 'Traditional',
    preferences: (searchParams.get('preferences') || '').split(',').filter(Boolean),
    specialRequirements: (searchParams.get('requirements') || '').split(',').filter(Boolean)
  };

  return await enhancedAISearchService.getVendorRecommendations(context, category || undefined);
}

// Handle budget breakdown
async function handleBudgetBreakdown(searchParams: URLSearchParams) {
  const budget = parseInt(searchParams.get('budget') || '1000000');
  
  return {
    total: budget,
    breakdown: {
      venue: Math.round(budget * 0.4),
      catering: Math.round(budget * 0.3),
      photography: Math.round(budget * 0.15),
      decoration: Math.round(budget * 0.1),
      music: Math.round(budget * 0.03),
      other: Math.round(budget * 0.02)
    },
    recommendations: [
      'Allocate 40% of budget for venue and facilities',
      'Set aside 30% for catering and food',
      'Budget 15% for photography and videography',
      'Reserve 10% for decoration and flowers',
      'Keep 5% for miscellaneous expenses'
    ]
  };
}

// Handle timeline generation
async function handleTimeline(searchParams: URLSearchParams) {
  const date = searchParams.get('date') || '2024-12-15';
  const weddingDate = new Date(date);
  const monthsUntilWedding = Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
  
  return {
    monthsUntilWedding,
    timeline: [
      { month: Math.max(1, monthsUntilWedding - 8), task: 'Set budget and guest list', priority: 'high' },
      { month: Math.max(1, monthsUntilWedding - 6), task: 'Book venue and photographer', priority: 'high' },
      { month: Math.max(1, monthsUntilWedding - 4), task: 'Choose caterer and menu', priority: 'high' },
      { month: Math.max(1, monthsUntilWedding - 3), task: 'Book musicians and decorators', priority: 'medium' },
      { month: Math.max(1, monthsUntilWedding - 2), task: 'Send invitations', priority: 'high' },
      { month: Math.max(1, monthsUntilWedding - 1), task: 'Finalize details and fittings', priority: 'high' },
      { month: monthsUntilWedding, task: 'Wedding day!', priority: 'high' }
    ].filter(milestone => milestone.month > 0)
  };
}
