import { NextRequest, NextResponse } from 'next/server'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// GET /api/security - Get security statistics and events
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('security-stats', async () => {
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
      const type = searchParams.get('type') || 'stats'
      const severity = searchParams.get('severity') as 'low' | 'medium' | 'high' | 'critical' | undefined

      let securityData: any = {}

      switch (type) {
        case 'stats':
          securityData = SecurityService.getSecurityStats()
          break
        case 'events':
          securityData = SecurityService.getSecurityEvents(severity)
          break
        case 'alerts':
          securityData = await SecurityService.getPerformanceAlerts()
          break
        default:
          securityData = SecurityService.getSecurityStats()
      }

      return NextResponse.json({
        success: true,
        data: securityData,
        type,
        severity,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Security stats error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Security statistics failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// POST /api/security - Report security events
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('security-report', async () => {
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
      const { type, details, severity = 'medium' } = body

      if (!type || !details) {
        return NextResponse.json({ 
          error: 'Event type and details are required' 
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

      // Record security event
      SecurityService.recordSecurityEvent({
        timestamp: new Date(),
        type: type as any,
        ip: SecurityService.getClientIP(request),
        details,
        severity: severity as any
      })

      return NextResponse.json({
        success: true,
        message: 'Security event reported successfully'
      })

    } catch (error) {
      console.error('Security reporting error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Security reporting failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// DELETE /api/security - Unblock IP
export async function DELETE(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('security-unblock', async () => {
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
      const ip = searchParams.get('ip')

      if (!ip) {
        return NextResponse.json({ 
          error: 'IP address is required' 
        }, { status: 400 })
      }

      // Unblock IP
      SecurityService.unblockIP(ip)

      return NextResponse.json({
        success: true,
        message: `IP ${ip} unblocked successfully`
      })

    } catch (error) {
      console.error('Security unblock error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'IP unblock failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
} 