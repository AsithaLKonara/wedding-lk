// Analytics Service for WeddingLK
// This service provides comprehensive analytics and reporting

export interface AnalyticsEvent {
  id: string
  userId: string
  event: string
  category: string
  properties: Record<string, any>
  timestamp: Date
}

export interface UserMetrics {
  userId: string
  totalSessions: number
  pagesViewed: string[]
  timeSpent: number
  conversions: number
  lastActive: Date
}

export interface PerformanceMetrics {
  pageLoadTime: number
  serverResponseTime: number
  memoryUsage: number
  cpuUsage: number
  errorRate: number
}

export interface BusinessMetrics {
  totalUsers: number
  activeUsers: number
  revenue: number
  bookings: number
  conversions: number
  averageOrderValue: number
}

export class AnalyticsService {
  private static events: AnalyticsEvent[] = []
  private static userMetrics: Map<string, UserMetrics> = new Map()

  // Track user event
  static async trackEvent(userId: string, event: string, category: string, properties: Record<string, any> = {}): Promise<void> {
    try {
      const analyticsEvent: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        event,
        category,
        properties,
        timestamp: new Date()
      }

      this.events.push(analyticsEvent)
      console.log('Analytics event tracked:', analyticsEvent)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Track page view
  static async trackPageView(userId: string, page: string, duration: number = 0): Promise<void> {
    await this.trackEvent(userId, 'page_view', 'navigation', {
      page,
      duration,
      timestamp: new Date().toISOString()
    })
  }

  // Track user interaction
  static async trackInteraction(userId: string, element: string, action: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(userId, 'interaction', 'user_behavior', {
      element,
      action,
      ...properties
    })
  }

  // Track conversion
  static async trackConversion(userId: string, conversionType: string, value: number = 0): Promise<void> {
    await this.trackEvent(userId, 'conversion', 'business', {
      conversionType,
      value,
      timestamp: new Date().toISOString()
    })
  }

  // Get user metrics
  static async getUserMetrics(userId: string): Promise<UserMetrics | null> {
    try {
      const userEvents = this.events.filter(event => event.userId === userId)
      
      if (userEvents.length === 0) {
        return null
      }

      const pagesViewed = [...new Set(userEvents
        .filter(event => event.event === 'page_view')
        .map(event => event.properties.page))]

      const totalSessions = userEvents
        .filter(event => event.event === 'session_start')
        .length

      const timeSpent = userEvents
        .filter(event => event.event === 'page_view')
        .reduce((total, event) => total + (event.properties.duration || 0), 0)

      const conversions = userEvents
        .filter(event => event.event === 'conversion')
        .length

      const lastActive = new Date(Math.max(...userEvents.map(event => event.timestamp.getTime())))

      return {
        userId,
        totalSessions,
        pagesViewed,
        timeSpent,
        conversions,
        lastActive
      }
    } catch (error) {
      console.error('Get user metrics error:', error)
      return null
    }
  }

  // Get performance metrics
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // Mock performance metrics
    return {
      pageLoadTime: 1200, // milliseconds
      serverResponseTime: 150, // milliseconds
      memoryUsage: 45.2, // percentage
      cpuUsage: 23.8, // percentage
      errorRate: 0.02 // percentage
    }
  }

  // Get business metrics
  static async getBusinessMetrics(): Promise<BusinessMetrics> {
    // Mock business metrics
    return {
      totalUsers: 1250,
      activeUsers: 342,
      revenue: 2500000, // LKR
      bookings: 156,
      conversions: 89,
      averageOrderValue: 28000 // LKR
    }
  }

  // Get popular pages
  static async getPopularPages(): Promise<Array<{page: string, count: number}>> {
    try {
      const pageViews = this.events
        .filter(event => event.event === 'page_view')
        .map(event => event.properties.page)

      const pageCounts: Record<string, number> = {}
      pageViews.forEach(page => {
        pageCounts[page] = (pageCounts[page] || 0) + 1
      })

      return Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    } catch (error) {
      console.error('Get popular pages error:', error)
      return []
    }
  }

  // Get user engagement
  static async getUserEngagement(): Promise<any> {
    try {
      const totalEvents = this.events.length
      const uniqueUsers = new Set(this.events.map(event => event.userId)).size
      const averageEventsPerUser = totalEvents / uniqueUsers

      return {
        totalEvents,
        uniqueUsers,
        averageEventsPerUser,
        engagementRate: (uniqueUsers / 1250) * 100 // Assuming 1250 total users
      }
    } catch (error) {
      console.error('Get user engagement error:', error)
      return {
        totalEvents: 0,
        uniqueUsers: 0,
        averageEventsPerUser: 0,
        engagementRate: 0
      }
    }
  }

  // Get conversion funnel
  static async getConversionFunnel(): Promise<any> {
    try {
      const funnel = {
        visitors: 1000,
        registered: 250,
        activeUsers: 150,
        bookings: 89,
        revenue: 2500000
      }

      return {
        ...funnel,
        conversionRates: {
          registration: (funnel.registered / funnel.visitors) * 100,
          activation: (funnel.activeUsers / funnel.registered) * 100,
          booking: (funnel.bookings / funnel.activeUsers) * 100
        }
      }
    } catch (error) {
      console.error('Get conversion funnel error:', error)
      return {
        visitors: 0,
        registered: 0,
        activeUsers: 0,
        bookings: 0,
        revenue: 0,
        conversionRates: {
          registration: 0,
          activation: 0,
          booking: 0
        }
      }
    }
  }

  // Generate analytics report
  static async generateReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const filteredEvents = this.events.filter(event => 
        event.timestamp >= startDate && event.timestamp <= endDate
      )

      const report = {
        period: {
          start: startDate,
          end: endDate
        },
        metrics: {
          totalEvents: filteredEvents.length,
          uniqueUsers: new Set(filteredEvents.map(event => event.userId)).size,
          pageViews: filteredEvents.filter(event => event.event === 'page_view').length,
          conversions: filteredEvents.filter(event => event.event === 'conversion').length
        },
        topPages: await this.getPopularPages(),
        performance: await this.getPerformanceMetrics(),
        business: await this.getBusinessMetrics(),
        engagement: await this.getUserEngagement(),
        funnel: await this.getConversionFunnel()
      }

      return report
    } catch (error) {
      console.error('Generate report error:', error)
      return {}
    }
  }
}

// Export the analytics service
export default AnalyticsService 