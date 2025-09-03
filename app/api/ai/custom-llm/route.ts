import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import customLLMService from '@/lib/custom-llm-service';
import PerformanceMonitor from '@/lib/performance-monitor';

// POST /api/ai/custom-llm - Process queries with custom LLM
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('custom-llm-query', async () => {
    try {
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
      const { query, context = {}, type = 'general' } = body;

      if (!query || typeof query !== 'string') {
        return NextResponse.json({ 
          error: 'Query is required and must be a string' 
        }, { status: 400 });
      }

      let response;

      // Route to appropriate custom LLM method based on type
      switch (type) {
        case 'venue-recommendation':
          response = await customLLMService.recommendVenues(query, context);
          break;
        
        case 'vendor-matching':
          response = await customLLMService.matchVendors(context, context.preferences || {});
          break;
        
        case 'budget-optimization':
          response = await customLLMService.optimizeBudget(context.budget || 1000000, context);
          break;
        
        case 'cultural-guidance':
          response = await customLLMService.provideCulturalGuidance(
            context.tradition || 'mixed', 
            query
          );
          break;
        
        case 'timeline-generation':
          response = await customLLMService.generateTimeline(
            context.eventDate ? new Date(context.eventDate) : new Date(),
            context
          );
          break;
        
        case 'general':
        default:
          response = await customLLMService.processQuery(query, context);
          break;
      }

      return NextResponse.json({
        success: true,
        data: response,
        metadata: {
          model: 'WeddingLK-Custom-LLM',
          version: '1.0.0',
          processingTime: Date.now(),
          culturalContext: response.culturalContext,
          confidence: response.confidence
        }
      });

    } catch (error) {
      console.error('Custom LLM API error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Custom LLM processing failed',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}

// GET /api/ai/custom-llm - Get custom LLM status and capabilities
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('custom-llm-status', async () => {
    try {
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');

      if (action === 'test') {
        // Test the custom LLM with a sample query
        const testResponse = await customLLMService.processQuery(
          'I need help planning a Kandyan wedding in Colombo for 150 guests with a budget of 1.5 million LKR',
          {
            tradition: 'kandyan',
            location: 'Colombo',
            guestCount: 150,
            budget: 1500000,
            eventDate: new Date('2024-12-15')
          }
        );

        return NextResponse.json({
          success: true,
          data: {
            status: 'operational',
            testResponse,
            capabilities: [
              'venue-recommendation',
              'vendor-matching', 
              'budget-optimization',
              'cultural-guidance',
              'timeline-generation',
              'general-query'
            ],
            culturalSupport: [
              'kandyan',
              'tamil', 
              'muslim',
              'christian',
              'mixed'
            ],
            languages: ['English', 'Sinhala', 'Tamil'],
            lastUpdated: new Date().toISOString()
          }
        });
      }

      // Return general status
      return NextResponse.json({
        success: true,
        data: {
          status: 'operational',
          model: 'WeddingLK-Custom-LLM',
          version: '1.0.0',
          capabilities: [
            'Sri Lankan wedding planning expertise',
            'Cultural tradition guidance',
            'Local vendor and venue recommendations',
            'Seasonal planning advice',
            'Budget optimization with local pricing',
            'Timeline generation with cultural considerations'
          ],
          supportedQueries: [
            'Venue recommendations with cultural context',
            'Vendor matching with local expertise',
            'Budget optimization with LKR pricing',
            'Cultural guidance for traditions',
            'Timeline generation with seasonal awareness',
            'General wedding planning questions'
          ],
          culturalContext: {
            traditions: ['kandyan', 'tamil', 'muslim', 'christian', 'mixed'],
            locations: ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Bentota', 'Anuradhapura'],
            seasons: ['Spring (Yala)', 'Summer (Maha)', 'Autumn (Inter-monsoon)', 'Winter (Northeast monsoon)']
          }
        }
      });

    } catch (error) {
      console.error('Custom LLM status error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get custom LLM status'
        },
        { status: 500 }
      );
    }
  });
}
