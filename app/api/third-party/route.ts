import { NextRequest, NextResponse } from 'next/server'
import ThirdPartyService from '@/lib/third-party-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/third-party - Use third-party services
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('third-party-service', async () => {
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
      const { service, data } = body

      if (!service) {
        return NextResponse.json({ 
          error: 'Service type is required' 
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

      switch (service) {
        case 'weather':
          result = await ThirdPartyService.getWeatherData(data.location)
          break
        case 'currency':
          result = await ThirdPartyService.getCurrencyData(data.baseCurrency)
          break
        case 'maps':
          result = await ThirdPartyService.getMapsData(data.address)
          break
        case 'translation':
          result = await ThirdPartyService.translateText(data.text, data.targetLanguage, data.sourceLanguage)
          break
        case 'payhere':
          result = await ThirdPartyService.processPayHerePayment(data)
          break
        case 'sms':
          result = await ThirdPartyService.sendSMSViaGateway(data.phone, data.message, data.gateway)
          break
        case 'bank-transfer':
          result = await ThirdPartyService.processBankTransfer(data)
          break
        case 'calendar':
          result = await ThirdPartyService.createCalendarEvent(data)
          break
        case 'whatsapp':
          result = await ThirdPartyService.sendWhatsAppMessage(data.phone, data.message, data.template)
          break
        case 'instagram':
          result = await ThirdPartyService.postToInstagramBusiness(data)
          break
        default:
          return NextResponse.json({ 
            error: 'Unsupported service type' 
          }, { status: 400 })
      }

      if (result) {
        return NextResponse.json({
          success: true,
          data: result,
          service
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `${service} service failed`
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('Third-party API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Third-party service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/third-party - Test third-party services
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('third-party-test', async () => {
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
        const results = await ThirdPartyService.testAllServices()
        return NextResponse.json({
          success: true,
          data: results,
          message: 'Third-party services test completed'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Third-party services are available',
        services: [
          'weather',
          'currency', 
          'maps',
          'translation',
          'payhere',
          'sms',
          'bank-transfer',
          'calendar',
          'whatsapp',
          'instagram'
        ]
      })

    } catch (error) {
      console.error('Third-party test error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Third-party services test failed'
        },
        { status: 500 }
      )
    }
  })
} 