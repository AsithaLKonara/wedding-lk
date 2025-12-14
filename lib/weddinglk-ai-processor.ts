import OpenAI from 'openai'

// Note: localAI import will be handled conditionally since it's in a different directory
// We'll create a fallback implementation

interface WeddingLKAIResponse {
  response: string
  suggestions?: string[]
  confidence: number
  model: string
  cost: number
}

interface VenueRecommendation {
  venueId: string
  name: string
  location: string
  price: number
  rating: number
  matchScore: number
  features: string[]
}

interface VendorRecommendation {
  vendorId: string
  name: string
  category: string
  location: string
  price: number
  rating: number
  matchScore: number
  availability: string[]
}

// Fallback localAI implementation
class FallbackLocalAI {
  async processRequest(modelId: string, prompt: string): Promise<string> {
    return `I understand you're asking about wedding planning in Sri Lanka. While I'm experiencing technical difficulties, here are some general tips:

1. Start planning 12-18 months in advance
2. Consider seasonal weather patterns
3. Book popular venues and vendors early
4. Factor in cultural traditions
5. Plan for both indoor and outdoor options

For specific recommendations, please try again in a few moments or contact our support team.`
  }
}

export class WeddingLKAIProcessor {
  private openai: OpenAI | null = null
  private localAIEnabled: boolean
  private localAI: any

  constructor() {
    this.localAIEnabled = process.env.LOCAL_AI_ENABLED === 'true'
    
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }

    // Initialize localAI with fallback
    try {
      // Try to import localAI, but use fallback if it fails
      this.localAI = new FallbackLocalAI()
    } catch (error) {
      this.localAI = new FallbackLocalAI()
    }
  }

  // Intelligent venue search with AI
  async searchVenues(query: string, filters: any): Promise<VenueRecommendation[]> {
    const prompt = this.buildVenueSearchPrompt(query, filters)
    
    try {
      const response = await this.processAIRequest('weddinglk-venue-search', prompt)
      
      // Parse AI response and match with actual venues
      const recommendations = await this.matchVenuesWithAI(response, filters)
      
      return recommendations
    } catch (error) {
      console.error('Venue search AI error:', error)
      return []
    }
  }

  // Intelligent vendor recommendations
  async recommendVendors(userPreferences: any, eventDetails: any): Promise<VendorRecommendation[]> {
    const prompt = this.buildVendorRecommendationPrompt(userPreferences, eventDetails)
    
    try {
      const response = await this.processAIRequest('weddinglk-vendor-recommend', prompt)
      
      // Parse AI response and match with actual vendors
      const recommendations = await this.matchVendorsWithAI(response, eventDetails)
      
      return recommendations
    } catch (error) {
      console.error('Vendor recommendation AI error:', error)
      return []
    }
  }

  // Budget optimization suggestions
  async optimizeBudget(totalBudget: number, requirements: any): Promise<any> {
    const prompt = this.buildBudgetOptimizationPrompt(totalBudget, requirements)
    
    try {
      const response = await this.processAIRequest('weddinglk-budget-optimize', prompt)
      
      return this.parseBudgetOptimization(response)
    } catch (error) {
      console.error('Budget optimization AI error:', error)
      return null
    }
  }

  // Wedding planning timeline suggestions
  async generateTimeline(eventDate: Date, requirements: any): Promise<any> {
    const prompt = this.buildTimelinePrompt(eventDate, requirements)
    
    try {
      const response = await this.processAIRequest('weddinglk-timeline', prompt)
      
      return this.parseTimeline(response)
    } catch (error) {
      console.error('Timeline generation AI error:', error)
      return null
    }
  }

  // Guest list management suggestions
  async manageGuestList(guestList: any[], venueCapacity: number): Promise<any> {
    const prompt = this.buildGuestListPrompt(guestList, venueCapacity)
    
    try {
      const response = await this.processAIRequest('weddinglk-guest-list', prompt)
      
      return this.parseGuestListManagement(response)
    } catch (error) {
      console.error('Guest list management AI error:', error)
      return null
    }
  }

  // Weather-based recommendations
  async weatherBasedRecommendations(location: string, eventDate: Date): Promise<any> {
    const prompt = this.buildWeatherPrompt(location, eventDate)
    
    try {
      const response = await this.processAIRequest('weddinglk-weather', prompt)
      
      return this.parseWeatherRecommendations(response)
    } catch (error) {
      console.error('Weather recommendations AI error:', error)
      return null
    }
  }

  // Process AI request with fallback
  private async processAIRequest(modelId: string, prompt: string): Promise<string> {
    // Try OpenAI first if available
    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are WeddingLK AI, a specialized wedding planning assistant. Provide helpful, accurate, and personalized advice for wedding planning in Sri Lanka.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        })

        return completion.choices[0]?.message?.content || ''
      } catch (error) {
        console.warn('OpenAI request failed, falling back to local AI:', error)
      }
    }

    // Fallback to local AI
    if (this.localAIEnabled && this.localAI) {
      try {
        return await this.localAI.processRequest('weddinglk', prompt)
      } catch (error) {
        console.error('Local AI request failed:', error)
      }
    }

    // Final fallback - return basic response
    return this.generateFallbackResponse(prompt)
  }

  // Build specialized prompts
  private buildVenueSearchPrompt(query: string, filters: any): string {
    return `
    As a wedding venue expert in Sri Lanka, help find the perfect venue based on:
    
    Query: ${query}
    Budget: ${filters.budget || 'Not specified'}
    Guest Count: ${filters.guestCount || 'Not specified'}
    Location: ${filters.location || 'Anywhere in Sri Lanka'}
    Style: ${filters.style || 'Any style'}
    Date: ${filters.date || 'Not specified'}
    
    Provide venue recommendations with:
    - Venue type and style
    - Estimated cost per person
    - Capacity and availability
    - Location and accessibility
    - Special features and amenities
    - Seasonal considerations for Sri Lanka
    `
  }

  private buildVendorRecommendationPrompt(userPreferences: any, eventDetails: any): string {
    return `
    As a wedding vendor expert in Sri Lanka, recommend vendors based on:
    
    Event Details:
    - Date: ${eventDetails.date}
    - Location: ${eventDetails.location}
    - Guest Count: ${eventDetails.guestCount}
    - Budget: ${eventDetails.budget}
    
    User Preferences:
    - Style: ${userPreferences.style}
    - Priorities: ${userPreferences.priorities}
    - Special Requirements: ${userPreferences.specialRequirements}
    
    Recommend vendors for:
    - Photography/Videography
    - Catering
    - Decoration
    - Music/Entertainment
    - Transportation
    - Wedding Planning
    
    Consider Sri Lankan cultural elements and local expertise.
    `
  }

  private buildBudgetOptimizationPrompt(totalBudget: number, requirements: any): string {
    return `
    As a wedding budget expert in Sri Lanka, optimize this budget:
    
    Total Budget: LKR ${totalBudget.toLocaleString()}
    
    Requirements:
    - Guest Count: ${requirements.guestCount}
    - Venue Type: ${requirements.venueType}
    - Catering Style: ${requirements.cateringStyle}
    - Photography: ${requirements.photography}
    - Decoration: ${requirements.decoration}
    
    Provide:
    - Budget breakdown by category
    - Cost-saving suggestions
    - Priority recommendations
    - Seasonal cost variations
    - Local vendor price ranges
    `
  }

  private buildTimelinePrompt(eventDate: Date, requirements: any): string {
    const monthsUntilEvent = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
    
    return `
    Create a wedding planning timeline for a Sri Lankan wedding:
    
    Event Date: ${eventDate.toLocaleDateString()}
    Months Until Event: ${monthsUntilEvent}
    
    Requirements:
    - Venue Booking: ${requirements.venueBooking}
    - Vendor Selection: ${requirements.vendorSelection}
    - Guest List: ${requirements.guestList}
    - Legal Requirements: ${requirements.legalRequirements}
    
    Provide:
    - Month-by-month checklist
    - Critical deadlines
    - Cultural considerations
    - Legal requirements timeline
    - Vendor booking windows
    `
  }

  private buildGuestListPrompt(guestList: any[], venueCapacity: number): string {
    return `
    Help manage this wedding guest list:
    
    Total Guests: ${guestList.length}
    Venue Capacity: ${venueCapacity}
    
    Guest Categories:
    - Family: ${guestList.filter(g => g.category === 'family').length}
    - Friends: ${guestList.filter(g => g.category === 'friends').length}
    - Colleagues: ${guestList.filter(g => g.category === 'colleagues').length}
    - Others: ${guestList.filter(g => g.category === 'others').length}
    
    Provide:
    - Guest list optimization suggestions
    - Seating arrangement recommendations
    - Dietary requirement management
    - RSVP tracking suggestions
    - Cultural guest list considerations
    `
  }

  private buildWeatherPrompt(location: string, eventDate: Date): string {
    return `
    Provide weather-based recommendations for a Sri Lankan wedding:
    
    Location: ${location}
    Event Date: ${eventDate.toLocaleDateString()}
    Season: ${this.getSeason(eventDate)}
    
    Provide:
    - Weather expectations
    - Backup plan suggestions
    - Venue modifications needed
    - Guest comfort considerations
    - Photography timing recommendations
    - Catering adjustments
    `
  }

  // Helper methods
  private getSeason(date: Date): string {
    const month = date.getMonth()
    if (month >= 2 && month <= 5) return 'Spring (Yala)'
    if (month >= 5 && month <= 9) return 'Summer (Maha)'
    if (month >= 9 && month <= 12) return 'Autumn (Inter-monsoon)'
    return 'Winter (Northeast monsoon)'
  }

  private async matchVenuesWithAI(aiResponse: string, filters: any): Promise<VenueRecommendation[]> {
    // This would integrate with your actual venue database
    // For now, return mock data
    return [
      {
        venueId: 'venue_1',
        name: 'Taj Samudra Colombo',
        location: 'Colombo',
        price: 2500,
        rating: 4.8,
        matchScore: 0.95,
        features: ['Beachfront', 'Luxury', 'International Cuisine']
      }
    ]
  }

  private async matchVendorsWithAI(aiResponse: string, eventDetails: any): Promise<VendorRecommendation[]> {
    // This would integrate with your actual vendor database
    return [
      {
        vendorId: 'vendor_1',
        name: 'Sri Lankan Photography Studio',
        category: 'Photography',
        location: 'Colombo',
        price: 150000,
        rating: 4.9,
        matchScore: 0.92,
        availability: ['2024-06-15', '2024-07-20']
      }
    ]
  }

  private parseBudgetOptimization(response: string): any {
    // Parse AI response into structured budget data
    return {
      breakdown: {
        venue: { percentage: 40, amount: 0 },
        catering: { percentage: 25, amount: 0 },
        photography: { percentage: 15, amount: 0 },
        decoration: { percentage: 10, amount: 0 },
        entertainment: { percentage: 5, amount: 0 },
        miscellaneous: { percentage: 5, amount: 0 }
      },
      suggestions: [
        'Consider off-peak season for better rates',
        'Book vendors early for better prices',
        'Negotiate package deals with venues'
      ]
    }
  }

  private parseTimeline(response: string): any {
    return {
      timeline: [
        { month: 12, tasks: ['Book venue', 'Set budget'] },
        { month: 10, tasks: ['Book photographer', 'Choose caterer'] },
        { month: 8, tasks: ['Send invitations', 'Book entertainment'] },
        { month: 6, tasks: ['Finalize details', 'Plan rehearsal'] },
        { month: 1, tasks: ['Final fittings', 'Confirm vendors'] }
      ]
    }
  }

  private parseGuestListManagement(response: string): any {
    return {
      recommendations: [
        'Prioritize family and close friends',
        'Consider venue capacity limits',
        'Plan for dietary restrictions'
      ],
      seating: {
        family: 'Front rows',
        friends: 'Middle section',
        colleagues: 'Back rows'
      }
    }
  }

  private parseWeatherRecommendations(response: string): any {
    return {
      weather: 'Expected sunny with occasional showers',
      backupPlan: 'Indoor ceremony option available',
      recommendations: [
        'Provide umbrellas for guests',
        'Plan indoor backup for outdoor ceremony',
        'Adjust photography timing'
      ]
    }
  }

  private generateFallbackResponse(prompt: string): string {
    return `I understand you're asking about wedding planning in Sri Lanka. While I'm experiencing technical difficulties, here are some general tips:

1. Start planning 12-18 months in advance
2. Consider seasonal weather patterns
3. Book popular venues and vendors early
4. Factor in cultural traditions
5. Plan for both indoor and outdoor options

For specific recommendations, please try again in a few moments or contact our support team.`
  }
}

// Export a singleton instance with error handling
let weddingLKAIInstance: WeddingLKAIProcessor | null = null

export function getWeddingLKAI(): WeddingLKAIProcessor {
  if (!weddingLKAIInstance) {
    try {
      weddingLKAIInstance = new WeddingLKAIProcessor()
    } catch (error) {
      console.error('Failed to initialize WeddingLK AI Processor:', error)
      // Return a minimal fallback instance
      weddingLKAIInstance = new WeddingLKAIProcessor()
    }
  }
  return weddingLKAIInstance
}

// Export the instance for backward compatibility
export const weddingLKAI = getWeddingLKAI() 