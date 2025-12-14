// AI Service for WeddingLK
// Provides AI-powered features for wedding planning

import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Payment } from './models';
import { advancedCache } from './advanced-cache-service';

import OpenAI from 'openai'
// Removed unused imports for code quality

// Initialize OpenAI client conditionally
let openai: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface AIRecommendation {
  type: 'venue' | 'vendor' | 'service'
  id: string
  name: string
  reason: string
  confidence: number
  price: number
}

interface WeddingPlan {
  timeline: Array<{
    date: string
    task: string
    description: string
    priority: 'low' | 'medium' | 'high'
  }>
  budget: {
    total: number
    breakdown: Record<string, number>
    recommendations: string[]
  }
  checklist: Array<{
    category: string
    items: Array<{
      task: string
      completed: boolean
      dueDate?: string
    }>
  }>
}

class AIService {
  // Intelligent venue and vendor recommendations
  async getPersonalizedRecommendations(userId: string): Promise<AIRecommendation[]> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      const { preferences } = user
      if (!preferences) throw new Error('User preferences not found')

      // Get all venues and vendors
      const venues = await Venue.find({ isActive: true })
      const vendors = await Vendor.find({ isActive: true })

      // If OpenAI is not available, return basic recommendations
      if (!openai) {
        return this.getBasicRecommendations(venues, vendors, preferences)
      }

      // Create AI prompt for recommendations
      const prompt = `
        As a wedding planning AI assistant, recommend the best venues and vendors for this couple:
        
        Wedding Date: ${preferences.weddingDate}
        Budget: LKR ${preferences.budget}
        Guest Count: ${preferences.guestCount}
        Location: ${preferences.location}
        Style: ${preferences.style}
        
        Available Venues:
        ${venues.map((v: any) => `- ${v.name}: ${v.location}, LKR ${v.price}, ${v.capacity} guests`).join('\n')}
        
        Available Vendors:
        ${vendors.map((v: any) => `- ${v.name}: ${v.category}, ${v.location}, LKR ${v.price}`).join('\n')}
        
        Provide 3 venue recommendations and 2 vendor recommendations with reasons.
        Format as JSON array with: type, id, name, reason, confidence (0-1), price
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      const recommendations = JSON.parse(completion.choices[0].message.content || '[]')
      return recommendations

    } catch (error) {
      console.error('AI recommendation error:', error)
      return []
    }
  }

  // Get basic recommendations when AI is not available
  private getBasicRecommendations(venues: any[], vendors: any[], preferences: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []

    // Add top-rated venues
    const topVenues = venues
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)

    topVenues.forEach(venue => {
      recommendations.push({
        type: 'venue',
        id: venue._id.toString(),
        name: venue.name,
        reason: `Highly rated venue (${venue.rating}/5) in ${venue.location}`,
        confidence: 0.8,
        price: venue.price
      })
    })

    // Add top-rated vendors
    const topVendors = vendors
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)

    topVendors.forEach(vendor => {
      recommendations.push({
        type: 'vendor',
        id: vendor._id.toString(),
        name: vendor.name,
        reason: `Top-rated ${vendor.category} service in ${vendor.location}`,
        confidence: 0.8,
        price: vendor.price
      })
    })

    return recommendations
  }

  // Generate personalized wedding timeline
  async generateWeddingTimeline(userId: string): Promise<WeddingPlan> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user?.preferences?.weddingDate) throw new Error('Wedding date not found')

      const weddingDate = new Date(user.preferences.weddingDate)
      const today = new Date()
      const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // If OpenAI is not available, return basic timeline
      if (!openai) {
        return this.getBasicWeddingTimeline(daysUntilWedding, user.preferences)
      }

      const prompt = `
        Create a comprehensive wedding planning timeline for a couple with ${daysUntilWedding} days until their wedding.
        
        Wedding Details:
        - Date: ${user.preferences.weddingDate}
        - Budget: LKR ${user.preferences.budget}
        - Guest Count: ${user.preferences.guestCount}
        - Location: ${user.preferences.location}
        - Style: ${user.preferences.style}
        
        Generate a detailed timeline with:
        1. Timeline: Array of tasks with dates, descriptions, and priorities
        2. Budget breakdown: Total and category breakdown
        3. Checklist: Organized by categories (venue, vendors, attire, etc.)
        
        Format as JSON with timeline, budget, and checklist properties.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })

      const weddingPlan = JSON.parse(completion.choices[0].message.content || '{}')
      return weddingPlan

    } catch (error) {
      console.error('AI timeline generation error:', error)
      return this.getBasicWeddingTimeline(30, { budget: 500000, guestCount: 200 })
    }
  }

  // Get basic wedding timeline when AI is not available
  private getBasicWeddingTimeline(daysUntilWedding: number, preferences: any): WeddingPlan {
    const timeline = [
      {
        date: new Date(Date.now() + (daysUntilWedding - 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Book Venue',
        description: 'Secure your wedding venue',
        priority: 'high' as const
      },
      {
        date: new Date(Date.now() + (daysUntilWedding - 45) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Book Vendors',
        description: 'Book photography, catering, and other services',
        priority: 'high' as const
      },
      {
        date: new Date(Date.now() + (daysUntilWedding - 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Send Invitations',
        description: 'Send out wedding invitations',
        priority: 'medium' as const
      }
    ]

    return {
      timeline,
      budget: {
        total: preferences.budget || 500000,
        breakdown: {
          venue: preferences.budget * 0.4 || 200000,
          catering: preferences.budget * 0.25 || 125000,
          photography: preferences.budget * 0.15 || 75000,
          decoration: preferences.budget * 0.1 || 50000,
          other: preferences.budget * 0.1 || 50000
        },
        recommendations: [
          'Consider booking vendors early for better rates',
          'Set aside 10% for unexpected expenses',
          'Compare multiple quotes before making decisions'
        ]
      },
      checklist: [
        {
          category: 'Venue',
          items: [
            { task: 'Book venue', completed: false },
            { task: 'Visit venue', completed: false },
            { task: 'Sign contract', completed: false }
          ]
        },
        {
          category: 'Vendors',
          items: [
            { task: 'Book photographer', completed: false },
            { task: 'Book caterer', completed: false },
            { task: 'Book decorator', completed: false }
          ]
        }
      ]
    }
  }

  // Smart search with semantic understanding
  async semanticSearch(query: string, filters: any = {}): Promise<{ venues: any[], vendors: any[], extractedParams: any }> {
    try {
      await connectDB()
      
      // If OpenAI is not available, return basic search
      if (!openai) {
        return this.getBasicSearch(query, filters)
      }

      const prompt = `
        Analyze this wedding-related search query and extract key information:
        Query: "${query}"
        
        Extract:
        1. Location preferences
        2. Budget range
        3. Guest count
        4. Style preferences
        5. Specific requirements
        
        Return as JSON with extracted parameters.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      })

      const extractedParams = JSON.parse(completion.choices[0].message.content || '{}')

      // Build database query based on extracted parameters
      const venueQuery: any = { isActive: true }
      const vendorQuery: any = { isActive: true }

      if (extractedParams.location) {
        venueQuery.location = { $regex: extractedParams.location, $options: 'i' }
        vendorQuery.location = { $regex: extractedParams.location, $options: 'i' }
      }

      if (extractedParams.budgetRange) {
        venueQuery.price = { $lte: extractedParams.budgetRange.max }
        vendorQuery.price = { $lte: extractedParams.budgetRange.max }
      }

      if (extractedParams.guestCount) {
        venueQuery.capacity = { $gte: extractedParams.guestCount }
      }

      const venues = await Venue.find(venueQuery).limit(10)
      const vendors = await Vendor.find(vendorQuery).limit(10)

      return { venues, vendors, extractedParams }

    } catch (error) {
      console.error('Semantic search error:', error)
      return this.getBasicSearch(query, filters)
    }
  }

  // Get basic search when AI is not available
  private async getBasicSearch(query: string, filters: any): Promise<any> {
    try {
      await connectDB()
      
      const venueQuery: any = { isActive: true }
      const vendorQuery: any = { isActive: true }

      if (filters?.location) {
        venueQuery.location = { $regex: filters.location, $options: 'i' }
        vendorQuery.location = { $regex: filters.location, $options: 'i' }
      }

      if (filters?.maxPrice) {
        venueQuery.price = { $lte: filters.maxPrice }
        vendorQuery.price = { $lte: filters.maxPrice }
      }

      if (filters?.guestCount) {
        venueQuery.capacity = { $gte: filters.guestCount }
      }

      const venues = await Venue.find(venueQuery).limit(10)
      const vendors = await Vendor.find(vendorQuery).limit(10)

      return { venues, vendors, extractedParams: filters }
    } catch (error) {
      console.error('Basic search error:', error)
      return { venues: [], vendors: [], extractedParams: {} }
    }
  }

  // Generate personalized content
  async generateContent(type: 'email' | 'description' | 'proposal', context: any): Promise<string> {
    try {
      if (!openai) {
        return this.getBasicContent(type, context)
      }

      const prompts = {
        email: `Write a professional wedding planning email for: ${JSON.stringify(context)}`,
        description: `Write an engaging venue/vendor description for: ${JSON.stringify(context)}`,
        proposal: `Write a wedding proposal for: ${JSON.stringify(context)}`
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompts[type] }],
        temperature: 0.7,
        max_tokens: 500
      })

      return completion.choices[0].message.content || ''

    } catch (error) {
      console.error('Content generation error:', error)
      return this.getBasicContent(type, context)
    }
  }

  // Get basic content when AI is not available
  private getBasicContent(type: 'email' | 'description' | 'proposal', context: any): string {
    const templates = {
      email: `Thank you for your interest in our wedding planning services. We're excited to help you create your perfect day!`,
      description: `A beautiful and elegant venue perfect for your special day.`,
      proposal: `Will you marry me?`
    }
    return templates[type] || ''
  }

  // Analyze user behavior and preferences
  async analyzeUserBehavior(userId: string): Promise<any> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      const bookings = await Booking.find({ userId })
      const payments = await Payment.find({ userId })

      const analysis: {
        preferences: any
        bookingHistory: number
        totalSpent: number
        favoriteCategories: string[]
        activityLevel: 'low' | 'medium' | 'high'
        recommendations: string[]
      } = {
        preferences: user?.preferences || {},
        bookingHistory: bookings.length,
        totalSpent: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
        favoriteCategories: this.extractFavoriteCategories(bookings),
        activityLevel: this.calculateActivityLevel(bookings, payments),
        recommendations: []
      }

      // Generate personalized recommendations based on analysis
      if (openai) {
        const prompt = `
          Analyze this user's wedding planning behavior and provide recommendations:
          ${JSON.stringify(analysis)}
          
          Provide 3 personalized recommendations for next steps.
        `

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 300
        })

        analysis.recommendations = completion.choices[0].message.content?.split('\n') || []
      } else {
        analysis.recommendations = [
          'Consider booking your venue early',
          'Explore vendor packages for better rates',
          'Start planning your wedding timeline'
        ]
      }

      return analysis

    } catch (error) {
      console.error('User behavior analysis error:', error)
      return {}
    }
  }

  private extractFavoriteCategories(bookings: any[]): string[] {
    // Extract favorite vendor categories from bookings
    const categories = bookings
      .map(b => b.services || b.vendorCategory || [])
      .flat()
      .filter(Boolean)
    return [...new Set(categories)]
  }

  private calculateActivityLevel(bookings: any[], payments: any[]): 'low' | 'medium' | 'high' {
    const totalActivity = bookings.length + payments.length
    if (totalActivity > 10) return 'high'
    if (totalActivity > 5) return 'medium'
    return 'low'
  }
}

export default new AIService() 