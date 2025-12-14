import { NextRequest, NextResponse } from 'next/server'
import EmailService from '@/lib/email-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// POST /api/email - Send email
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('email-send', async () => {
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
      const { template, data, to, attachments } = body

      if (!template || !to) {
        return NextResponse.json({ 
          error: 'Template and recipient email are required' 
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

      // Send email
      const result = await EmailService.sendEmail({
        to,
        template,
        data,
        attachments
      })

      if (result) {
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully'
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Email sending failed'
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('Email API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Email service failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/email - Test email service
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('email-test', async () => {
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
        const result = await EmailService.testEmailService()
        return NextResponse.json({
          success: result,
          message: result ? 'Email service is working' : 'Email service test failed'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Email service is available',
        templates: ['welcome', 'booking_confirmation', 'payment_receipt', 'wedding_reminder', 'vendor_inquiry']
      })

    } catch (error) {
      console.error('Email test error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Email service test failed'
        },
        { status: 500 }
      )
    }
  })
} 