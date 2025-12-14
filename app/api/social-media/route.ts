import { NextRequest, NextResponse } from 'next/server'
import SocialMediaService from '@/lib/social-media-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/social-media - Post to social media
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('social-media-post', async () => {
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
      const { platform, content, image, link, hashtags, scheduledTime } = body

      if (!platform || !content) {
        return NextResponse.json({ 
          error: 'Platform and content are required' 
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

      // Post to social media
      const result = await SocialMediaService.postToSocialMedia({
        platform,
        content,
        image,
        link,
        hashtags,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
      })

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Social media post successful',
          postId: result.postId,
          platform: result.platform
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Social media posting failed',
            platform: result.platform
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('Social media API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Social media service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/social-media - Get social media analytics
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('social-media-analytics', async () => {
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
      const platform = searchParams.get('platform')
      const timeRange = searchParams.get('timeRange') || '24h'
      const action = searchParams.get('action')

      if (action === 'test') {
        const result = await SocialMediaService.testSocialMediaService()
        return NextResponse.json({
          success: result,
          message: result ? 'Social media service is working' : 'Social media service test failed'
        })
      }

      if (platform) {
        const analytics = await SocialMediaService.getSocialMediaAnalytics(platform, timeRange)
        return NextResponse.json({
          success: true,
          data: analytics
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Social media service is available',
        platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest']
      })

    } catch (error) {
      console.error('Social media analytics error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Social media analytics failed'
        },
        { status: 500 }
      )
    }
  })
} 