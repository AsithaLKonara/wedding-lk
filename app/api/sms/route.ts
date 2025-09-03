import { NextRequest, NextResponse } from 'next/server'
import SMSService from '@/lib/sms-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/sms - Send SMS
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('sms-send', async () => {
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
      const { template, data, to, message } = body

      if (!to || (!template && !message)) {
        return NextResponse.json({ 
          error: 'Recipient phone and template/message are required' 
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

      // Send SMS
      let result
      if (template) {
        result = await SMSService.sendSMSTemplate(to, template, data)
      } else {
        result = await SMSService.sendSMS({ to, message: message! })
      }

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'SMS sent successfully',
          messageId: result.messageId
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'SMS sending failed'
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('SMS API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'SMS service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/sms - Test SMS service
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('sms-test', async () => {
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
        const result = await SMSService.testSMSService()
        return NextResponse.json({
          success: result,
          message: result ? 'SMS service is working' : 'SMS service test failed'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'SMS service is available',
        templates: ['welcome', 'booking_confirmation', 'payment_receipt', 'wedding_reminder', 'vendor_inquiry', 'otp_verification', 'password_reset']
      })

    } catch (error) {
      console.error('SMS test error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'SMS service test failed'
        },
        { status: 500 }
      )
    }
  })
} 