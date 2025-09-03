import { NextRequest, NextResponse } from 'next/server';
import { optimizedAISearch } from '../../../lib/ai-search-optimized';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    console.log('🤖 Processing AI search with optimized service...');
    const startTime = Date.now();
    
    const result = await optimizedAISearch.search({
      query,
      limit: 10
    });
    
    const searchTime = Date.now() - startTime;
    console.log(`⚡ AI search completed in ${searchTime}ms (${result.vendors.length} vendors, ${result.venues.length} venues)`);
    
    return NextResponse.json({
      ...result,
      performance: {
        searchTime,
        cached: result.cached,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error in AI search:', error);
    return NextResponse.json(
      { error: 'AI search failed' },
      { status: 500 }
    );
  }
} 