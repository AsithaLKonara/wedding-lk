import { NextRequest, NextResponse } from 'next/server'
import MobileAppService from '@/lib/mobile-app-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/mobile - Mobile app specific operations
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('mobile-service', async () => {
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
      const { action, data } = body

      if (!action) {
        return NextResponse.json({ 
          error: 'Action type is required' 
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

      let result: any

      switch (action) {
        case 'user-data':
          result = await MobileAppService.getMobileUserData(data.userId)
          break
        case 'venues':
          result = await MobileAppService.getMobileVenues(data.filters)
          break
        case 'vendors':
          result = await MobileAppService.getMobileVendors(data.filters)
          break
        case 'bookings':
          result = await MobileAppService.getMobileBookings(data.userId)
          break
        case 'push-notification':
          result = await MobileAppService.sendMobilePushNotification(data.userId, data.notification)
          break
        default:
          return NextResponse.json({ 
            error: 'Unsupported action type' 
          }, { status: 400 })
      }

      if (result !== null) {
        return NextResponse.json({
          success: true,
          data: result,
          action
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `${action} operation failed`
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('Mobile API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Mobile app service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/mobile - Get mobile app configuration and data
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('mobile-config', async () => {
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
      const type = searchParams.get('type')
      const action = searchParams.get('action')

      if (action === 'test') {
        const results = await MobileAppService.testMobileAppService()
        return NextResponse.json({
          success: true,
          data: results,
          message: 'Mobile app service test completed'
        })
      }

      switch (type) {
        case 'config':
          const config = MobileAppService.getMobileAppConfig()
          return NextResponse.json({
            success: true,
            data: config
          })
        case 'manifest':
          const manifest = MobileAppService.generateMobileAppManifest()
          return NextResponse.json({
            success: true,
            data: manifest
          })
        case 'react-native-config':
          const rnConfig = MobileAppService.generateReactNativeConfig()
          return NextResponse.json({
            success: true,
            data: rnConfig
          })
        case 'api-docs':
          const apiDocs = MobileAppService.generateMobileAPIDocs()
          return NextResponse.json({
            success: true,
            data: apiDocs
          })
        default:
          return NextResponse.json({
            success: true,
            message: 'Mobile app service is available',
            types: ['config', 'manifest', 'react-native-config', 'api-docs'],
            actions: ['user-data', 'venues', 'vendors', 'bookings', 'push-notification']
          })
      }

    } catch (error) {
      console.error('Mobile config error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Mobile app configuration failed'
        },
        { status: 500 }
      )
    }
  })
} 