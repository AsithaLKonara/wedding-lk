import crypto from 'crypto'
import { NextRequest } from 'next/server'
import { connectDB } from './db'

interface SecurityEvent {
  timestamp: Date
  type: 'login_attempt' | 'rate_limit' | 'suspicious_activity' | 'blocked_request'
  ip: string
  userId?: string
  details: any
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface RateLimitInfo {
  ip: string
  endpoint: string
  count: number
  resetTime: Date
  blocked: boolean
}

class SecurityService {
  private rateLimits = new Map<string, RateLimitInfo>()
  private blockedIPs = new Set<string>()
  private securityEvents: SecurityEvent[] = []
  private failedLoginAttempts = new Map<string, { count: number; lastAttempt: Date; blocked: boolean }>()

  // Rate limiting
  isRateLimited(ip: string, endpoint: string, limit: number = 100, windowMs: number = 60000): boolean {
    const key = `${ip}:${endpoint}`
    const now = new Date()
    
    let rateLimit = this.rateLimits.get(key)
    
    if (!rateLimit || now > rateLimit.resetTime) {
      rateLimit = {
        ip,
        endpoint,
        count: 0,
        resetTime: new Date(now.getTime() + windowMs),
        blocked: false
      }
    }

    rateLimit.count++

    if (rateLimit.count > limit) {
      rateLimit.blocked = true
      this.blockIP(ip, `Rate limit exceeded for ${endpoint}`)
      this.recordSecurityEvent({
        timestamp: now,
        type: 'rate_limit',
        ip,
        details: { endpoint, count: rateLimit.count, limit },
        severity: 'medium'
      })
    }

    this.rateLimits.set(key, rateLimit)
    return rateLimit.blocked
  }

  // IP blocking
  blockIP(ip: string, reason: string) {
    this.blockedIPs.add(ip)
    this.recordSecurityEvent({
      timestamp: new Date(),
      type: 'blocked_request',
      ip,
      details: { reason },
      severity: 'high'
    })
  }

  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  unblockIP(ip: string) {
    this.blockedIPs.delete(ip)
  }

  // Login attempt tracking
  trackLoginAttempt(ip: string, email: string, success: boolean) {
    const key = `${ip}:${email}`
    const now = new Date()
    
    let attempts = this.failedLoginAttempts.get(key)
    
    if (!attempts) {
      attempts = { count: 0, lastAttempt: now, blocked: false }
    }

    if (success) {
      this.failedLoginAttempts.delete(key)
      return true
    }

    attempts.count++
    attempts.lastAttempt = now

    // Block after 5 failed attempts for 15 minutes
    if (attempts.count >= 5) {
      attempts.blocked = true
      this.blockIP(ip, `Multiple failed login attempts for ${email}`)
      this.recordSecurityEvent({
        timestamp: now,
        type: 'login_attempt',
        ip,
        details: { email, failedAttempts: attempts.count },
        severity: 'high'
      })
    }

    this.failedLoginAttempts.set(key, attempts)
    return !attempts.blocked
  }

  isLoginBlocked(ip: string, email: string): boolean {
    const key = `${ip}:${email}`
    const attempts = this.failedLoginAttempts.get(key)
    
    if (!attempts) return false
    
    // Unblock after 15 minutes
    const now = new Date()
    const blockDuration = 15 * 60 * 1000 // 15 minutes
    
    if (attempts.blocked && (now.getTime() - attempts.lastAttempt.getTime()) > blockDuration) {
      this.failedLoginAttempts.delete(key)
      return false
    }
    
    return attempts.blocked
  }

  // Input validation and sanitization
  validateInput(input: any, rules: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Email validation
    if (rules.email && input.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.email)) {
        errors.push('Invalid email format')
      }
    }

    // Password validation
    if (rules.password && input.password) {
      if (input.password.length < 8) {
        errors.push('Password must be at least 8 characters long')
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(input.password)) {
        errors.push('Password must contain uppercase, lowercase, and number')
      }
    }

    // XSS prevention
    if (rules.preventXSS) {
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
      ]

      const inputString = JSON.stringify(input)
      for (const pattern of xssPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Potentially malicious content detected')
          break
        }
      }
    }

    // SQL injection prevention
    if (rules.preventSQLInjection) {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
        /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi
      ]

      const inputString = JSON.stringify(input)
      for (const pattern of sqlPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Potentially malicious SQL content detected')
          break
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Sanitize input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  // Generate secure tokens
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  generateJWTSecret(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  // Hash passwords
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex')
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err)
        else resolve(salt + ':' + derivedKey.toString('hex'))
      })
    })
  }

  // Verify passwords
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':')
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err)
        else resolve(key === derivedKey.toString('hex'))
      })
    })
  }

  // Request validation middleware
  validateRequest(request: NextRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const ip = this.getClientIP(request)

    // Check if IP is blocked
    if (this.isIPBlocked(ip)) {
      errors.push('IP address is blocked')
    }

    // Check rate limiting
    const endpoint = request.nextUrl.pathname
    if (this.isRateLimited(ip, endpoint)) {
      errors.push('Rate limit exceeded')
    }

    // Validate headers
    const userAgent = request.headers.get('user-agent')
    if (!userAgent || userAgent.length < 10) {
      errors.push('Invalid user agent')
    }

    // Check for suspicious patterns
    const url = request.url
    if (this.detectSuspiciousPatterns(url)) {
      this.recordSecurityEvent({
        timestamp: new Date(),
        type: 'suspicious_activity',
        ip,
        details: { url, userAgent },
        severity: 'medium'
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get client IP
  getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           'unknown'
  }

  // Detect suspicious patterns
  private detectSuspiciousPatterns(url: string): boolean {
    const suspiciousPatterns = [
      /\.\.\//, // Directory traversal
      /<script/i, // XSS attempts
      /javascript:/i, // JavaScript protocol
      /union\s+select/i, // SQL injection
      /exec\s*\(/i, // Command execution
      /eval\s*\(/i, // Code evaluation
      /document\.cookie/i, // Cookie access
      /window\.location/i // Location manipulation
    ]

    return suspiciousPatterns.some(pattern => pattern.test(url))
  }

  // Record security events
  recordSecurityEvent(event: SecurityEvent) {
    this.securityEvents.push(event)
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000)
    }

    // Log critical events
    if (event.severity === 'critical') {
      console.error('🚨 CRITICAL SECURITY EVENT:', event)
    }
  }

  // Get security events
  getSecurityEvents(severity?: 'low' | 'medium' | 'high' | 'critical'): SecurityEvent[] {
    let events = this.securityEvents
    
    if (severity) {
      events = events.filter(e => e.severity === severity)
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get security statistics
  getSecurityStats() {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentEvents = this.securityEvents.filter(e => e.timestamp > last24Hours)
    
    return {
      totalEvents: this.securityEvents.length,
      eventsLast24h: recentEvents.length,
      blockedIPs: this.blockedIPs.size,
      rateLimitedRequests: Array.from(this.rateLimits.values()).filter(r => r.blocked).length,
      failedLoginAttempts: Array.from(this.failedLoginAttempts.values()).reduce((sum, a) => sum + a.count, 0),
      severityBreakdown: {
        low: recentEvents.filter(e => e.severity === 'low').length,
        medium: recentEvents.filter(e => e.severity === 'medium').length,
        high: recentEvents.filter(e => e.severity === 'high').length,
        critical: recentEvents.filter(e => e.severity === 'critical').length
      }
    }
  }

  // Get performance alerts
  async getPerformanceAlerts() {
    try {
      // In a real implementation, this would check system performance metrics
      const alerts = []
      const now = new Date()
      
      // Check for high rate limiting
      const highRateLimitCount = Array.from(this.rateLimits.values()).filter(r => r.blocked).length
      if (highRateLimitCount > 10) {
        alerts.push({
          type: 'high_rate_limiting',
          severity: 'high',
          message: `High rate limiting detected: ${highRateLimitCount} blocked requests`,
          timestamp: now
        })
      }
      
      // Check for critical security events
      const criticalEvents = this.securityEvents.filter(e => 
        e.severity === 'critical' && 
        e.timestamp > new Date(now.getTime() - 60 * 60 * 1000) // Last hour
      )
      
      if (criticalEvents.length > 0) {
        alerts.push({
          type: 'critical_security_events',
          severity: 'critical',
          message: `${criticalEvents.length} critical security events in the last hour`,
          timestamp: now,
          details: criticalEvents
        })
      }
      
      // Check for blocked IPs
      if (this.blockedIPs.size > 50) {
        alerts.push({
          type: 'high_blocked_ips',
          severity: 'medium',
          message: `High number of blocked IPs: ${this.blockedIPs.size}`,
          timestamp: now
        })
      }
      
      return alerts
    } catch (error) {
      console.error('Error getting performance alerts:', error)
      return []
    }
  }

  // Clean up old data
  cleanup() {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Clean up old rate limits
    for (const [key, rateLimit] of this.rateLimits.entries()) {
      if (rateLimit.resetTime < now) {
        this.rateLimits.delete(key)
      }
    }
    
    // Clean up old security events
    this.securityEvents = this.securityEvents.filter(e => e.timestamp > oneHourAgo)
  }
}

export default new SecurityService() 