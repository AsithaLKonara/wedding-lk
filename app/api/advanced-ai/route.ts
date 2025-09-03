import { NextRequest, NextResponse } from 'next/server'
import { advancedAIService } from '@/lib/advanced-ai-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/advanced-ai - Use advanced AI features
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('advanced-ai-service', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      const body = await request.json()
      const { feature, data } = body

      if (!feature) {
        return NextResponse.json({ 
          error: 'AI feature type is required' 
        }, { status: 400 })
      }

      // Input validation
      const validation = SecurityService.validateInput(body, {
        preventXSS: true
      })

      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'Invalid input', 
          details: validation.errors 
        }, { status: 400 })
      }

      let result: unknown = null

      switch (feature) {
        case 'wedding-plan':
          result = await advancedAIService.generateContent('wedding plan', data)
          break
        case 'vendor-matching':
          result = await advancedAIService.generateRecommendations(data.userId, 'vendor matching')
          break
        case 'speech-generation':
          result = await advancedAIService.generateContent('wedding speech', data)
          break
        case 'hashtag-generation':
          result = await advancedAIService.generateContent('wedding hashtags', data)
          break
        case 'song-recommendations':
          result = await advancedAIService.generateContent('wedding songs', data)
          break
        default:
          return NextResponse.json({ 
            error: 'Unsupported AI feature type' 
          }, { status: 400 })
      }

      if (result) {
        return NextResponse.json({
          success: true,
          data: result,
          feature
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `${feature} AI feature failed`
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('Advanced AI API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Advanced AI service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/advanced-ai - Test advanced AI features
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('advanced-ai-test', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      const { searchParams } = new URL(request.url)
      const action = searchParams.get('action')

      if (action === 'test') {
        const results = await advancedAIService.generateContent('test content', { test: true })
        return NextResponse.json({
          success: true,
          data: results,
          message: 'Advanced AI features test completed'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Advanced AI features are available',
        features: [
          'wedding-plan',
          'vendor-matching',
          'speech-generation',
          'hashtag-generation',
          'song-recommendations'
        ]
      })

    } catch (error) {
      console.error('Advanced AI test error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Advanced AI features test failed'
        },
        { status: 500 }
      )
    }
  })
} 