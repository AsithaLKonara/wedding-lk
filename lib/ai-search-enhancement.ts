// Enhanced AI Search with performance optimization
export interface SearchQuery {
  query: string
  filters: {
    location?: string
    priceRange?: [number, number]
    date?: string
    guestCount?: number
    category?: string
  }
  userPreferences?: {
    style?: string
    budget?: number
    priority?: 'price' | 'quality' | 'location'
  }
}

export interface SearchResult {
  id: string
  type: 'venue' | 'vendor'
  name: string
  description: string
  location: string
  price: number
  rating: number
  relevance: number
  features: string[]
  images: string[]
}

export class AISearchEnhancement {
  private static instance: AISearchEnhancement
  private searchHistory: Map<string, number> = new Map()
  private userPreferences: Map<string, any> = new Map()
  private cache: Map<string, SearchResult[]> = new Map()

  static getInstance(): AISearchEnhancement {
    if (!AISearchEnhancement.instance) {
      AISearchEnhancement.instance = new AISearchEnhancement()
    }
    return AISearchEnhancement.instance
  }

  // Enhanced search with semantic understanding
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const cacheKey = this.generateCacheKey(query)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Update search history
    this.updateSearchHistory(query.query)

    // Perform semantic search
    const results = await this.performSemanticSearch(query)
    
    // Apply personalization
    const personalizedResults = this.applyPersonalization(results, query)
    
    // Cache results
    this.cache.set(cacheKey, personalizedResults)
    
    return personalizedResults
  }

  private async performSemanticSearch(query: SearchQuery): Promise<SearchResult[]> {
    // Simulate AI-powered semantic search
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'venue',
        name: 'Grand Ballroom Hotel',
        description: 'Luxurious wedding venue with stunning architecture',
        location: 'Colombo',
        price: 50000,
        rating: 4.8,
        relevance: 0.95,
        features: ['Parking', 'Catering', 'Decoration'],
        images: ['/venue1.jpg', '/venue2.jpg']
      },
      {
        id: '2',
        type: 'vendor',
        name: 'Perfect Moments Photography',
        description: 'Professional wedding photography services',
        location: 'Colombo',
        price: 25000,
        rating: 4.9,
        relevance: 0.92,
        features: ['Full Day Coverage', 'Album', 'Drone'],
        images: ['/photo1.jpg', '/photo2.jpg']
      }
    ]

    // Filter based on query
    return mockResults.filter(result => {
      if (query.filters.location && !result.location.toLowerCase().includes(query.filters.location.toLowerCase())) {
        return false
      }
      if (query.filters.priceRange && (result.price < query.filters.priceRange[0] || result.price > query.filters.priceRange[1])) {
        return false
      }
      return true
    })
  }

  private applyPersonalization(results: SearchResult[], query: SearchQuery): SearchResult[] {
    // Apply user preferences and search history
    const personalizedResults = results.map(result => {
      let score = result.relevance

      // Boost based on user preferences
      if (query.userPreferences?.priority === 'price' && result.price < 30000) {
        score += 0.1
      }
      if (query.userPreferences?.priority === 'quality' && result.rating > 4.5) {
        score += 0.1
      }

      // Boost based on search history
      const historyBoost = this.searchHistory.get(result.name.toLowerCase()) || 0
      score += historyBoost * 0.05

      return { ...result, relevance: Math.min(score, 1.0) }
    })

    // Sort by relevance
    return personalizedResults.sort((a, b) => b.relevance - a.relevance)
  }

  private updateSearchHistory(query: string): void {
    const normalizedQuery = query.toLowerCase()
    const currentCount = this.searchHistory.get(normalizedQuery) || 0
    this.searchHistory.set(normalizedQuery, currentCount + 1)
  }

  private generateCacheKey(query: SearchQuery): string {
    return JSON.stringify(query)
  }

  // Get search suggestions based on user behavior
  getSearchSuggestions(partialQuery: string): string[] {
    const suggestions: string[] = []
    
    // Add from search history
    for (const [query, count] of this.searchHistory) {
      if (query.includes(partialQuery.toLowerCase()) && count > 1) {
        suggestions.push(query)
      }
    }

    // Add common wedding-related suggestions
    const commonTerms = [
      'wedding venue',
      'photographer',
      'catering',
      'decoration',
      'music',
      'transportation'
    ]

    commonTerms.forEach(term => {
      if (term.includes(partialQuery.toLowerCase())) {
        suggestions.push(term)
      }
    })

    return suggestions.slice(0, 5)
  }

  // Update user preferences
  updateUserPreferences(userId: string, preferences: any): void {
    this.userPreferences.set(userId, preferences)
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get search analytics
  getSearchAnalytics(): Record<string, number> {
    const analytics: Record<string, number> = {}
    for (const [query, count] of this.searchHistory) {
      analytics[query] = count
    }
    return analytics
  }
}

// Export singleton instance
export const aiSearch = AISearchEnhancement.getInstance() 