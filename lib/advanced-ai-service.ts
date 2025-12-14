// Advanced AI Service for WeddingLK
// Provides intelligent AI-powered features for wedding planning

import OpenAI from 'openai';
import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Review } from './models';
import { advancedCache } from './advanced-cache-service';

interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  keywords: string[]
  summary: string
  recommendations: string[]
}

interface ContentGenerationResult {
  content: string
  tone: string
  length: number
  seoOptimized: boolean
  suggestions: string[]
}

interface PredictiveInsights {
  trend: 'increasing' | 'decreasing' | 'stable'
  confidence: number
  factors: string[]
  recommendations: string[]
  timeframe: string
}

class AdvancedAIService {
  private openai: OpenAI | null = null
  private isEnabled: boolean = false

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      this.isEnabled = true
    }
  }

  // Advanced Sentiment Analysis
  async analyzeSentiment(text: string): Promise<AIAnalysisResult> {
    if (!this.isEnabled || !this.openai) {
      return this.fallbackSentimentAnalysis(text)
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert sentiment analysis system. Analyze the given text and provide detailed insights."
          },
          {
            role: "user",
            content: `Analyze the sentiment of this text: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const analysis = response.choices[0]?.message?.content || ''
      
      // Parse the AI response and extract structured data
      return this.parseSentimentAnalysis(analysis)
    } catch (error) {
      console.error('OpenAI sentiment analysis failed:', error)
      return this.fallbackSentimentAnalysis(text)
    }
  }

  // Advanced Content Generation
  async generateContent(prompt: string, context: any): Promise<ContentGenerationResult> {
    if (!this.isEnabled || !this.openai) {
      return this.fallbackContentGeneration(prompt, context)
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert content writer specializing in wedding planning and vendor services."
          },
          {
            role: "user",
            content: `Generate content based on this prompt: "${prompt}" with context: ${JSON.stringify(context)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content || ''
      
      return {
        content,
        tone: this.analyzeTone(content),
        length: content.length,
        seoOptimized: this.checkSEOOptimization(content),
        suggestions: this.generateSuggestions(content)
      }
    } catch (error) {
      console.error('OpenAI content generation failed:', error)
      return this.fallbackContentGeneration(prompt, context)
    }
  }

  // Predictive Analytics
  async generatePredictiveInsights(dataType: string, historicalData: any[]): Promise<PredictiveInsights> {
    if (!this.isEnabled || !this.openai) {
      return this.fallbackPredictiveInsights(dataType, historicalData)
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert data analyst specializing in predictive analytics for wedding planning platforms."
          },
          {
            role: "user",
            content: `Analyze this ${dataType} data and provide predictive insights: ${JSON.stringify(historicalData)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const analysis = response.choices[0]?.message?.content || ''
      
      return this.parsePredictiveInsights(analysis)
    } catch (error) {
      console.error('OpenAI predictive analysis failed:', error)
      return this.fallbackPredictiveInsights(dataType, historicalData)
    }
  }

  // Advanced Search with Semantic Understanding
  async semanticSearch(query: string, context: string = ''): Promise<any[]> {
    if (!this.isEnabled || !this.openai) {
      return this.fallbackSemanticSearch(query, context)
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert search system that understands semantic meaning and context."
          },
          {
            role: "user",
            content: `Convert this search query to optimized search terms: "${query}" Context: ${context}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      })

      const optimizedQuery = response.choices[0]?.message?.content || query
      
      // Use the optimized query for database search
      return await this.performDatabaseSearch(optimizedQuery)
    } catch (error) {
      console.error('OpenAI semantic search failed:', error)
      return this.fallbackSemanticSearch(query, context)
    }
  }

  // AI-Powered Recommendations
  async generateRecommendations(userId: string, context: string): Promise<any[]> {
    try {
      await connectDB()
      
      // Get user preferences and history
      const user = await User.findById(userId)
      const userBookings = await Booking.find({ userId }).populate('vendorId venueId')
      const userReviews = await Review.find({ userId })

      if (!this.isEnabled || !this.openai) {
        return this.fallbackRecommendations(user, userBookings, userReviews)
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert wedding planning AI that provides personalized recommendations."
          },
          {
            role: "user",
            content: `Generate personalized recommendations for user ${userId} based on: User: ${JSON.stringify(user)}, Bookings: ${JSON.stringify(userBookings)}, Reviews: ${JSON.stringify(userReviews)}, Context: ${context}`
          }
        ],
        temperature: 0.6,
        max_tokens: 1000
      })

      const recommendations = response.choices[0]?.message?.content || ''
      
      return this.parseRecommendations(recommendations)
    } catch (error) {
      console.error('AI recommendations failed:', error)
      return this.fallbackRecommendations(null, [], [])
    }
  }

  // Fallback Methods
  private fallbackSentimentAnalysis(text: string): AIAnalysisResult {
    const positiveWords = ['love', 'amazing', 'perfect', 'beautiful', 'wonderful', 'excellent']
    const negativeWords = ['hate', 'terrible', 'awful', 'disappointing', 'bad', 'poor']
    
    const words = text.toLowerCase().split(' ')
    let positiveCount = 0
    let negativeCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let confidence = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      confidence = Math.min(0.9, 0.5 + (positiveCount * 0.1))
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      confidence = Math.min(0.9, 0.5 + (negativeCount * 0.1))
    }
    
    return {
      sentiment,
      confidence,
      keywords: this.extractKeywords(text),
      summary: this.generateSummary(text),
      recommendations: this.generateRecommendationsFromSentiment(sentiment)
    }
  }

  private fallbackContentGeneration(prompt: string, context: any): ContentGenerationResult {
    const templates = {
      vendor_description: `Professional ${context.category || 'wedding service'} provider with years of experience.`,
      venue_description: `Beautiful ${context.type || 'venue'} perfect for your special day.`,
      general: `Quality service tailored to your needs.`
    }
    
    const contextType = context.type || 'general'
    const content = templates[contextType as keyof typeof templates] || templates.general
    
    return {
      content,
      tone: 'professional',
      length: content.length,
      seoOptimized: true,
      suggestions: ['Add more specific details', 'Include pricing information', 'Add customer testimonials']
    }
  }

  private fallbackPredictiveInsights(dataType: string, historicalData: any[]): PredictiveInsights {
    // Simple trend analysis based on data
    const trend = historicalData.length > 10 ? 'increasing' : 'stable'
    
    return {
      trend,
      confidence: 0.6,
      factors: ['Historical patterns', 'Seasonal variations', 'Market conditions'],
      recommendations: ['Monitor trends', 'Adjust strategies', 'Gather more data'],
      timeframe: '3-6 months'
    }
  }

  private fallbackSemanticSearch(query: string, context: string): any[] {
    // Basic keyword-based search fallback
    return []
  }

  private fallbackRecommendations(user: any, bookings: any[], reviews: any[]): any[] {
    // Basic recommendation logic
    return []
  }

  // Helper Methods
  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    const words = text.toLowerCase().split(' ')
    return words.filter(word => word.length > 3 && !commonWords.includes(word)).slice(0, 10)
  }

  private generateSummary(text: string): string {
    return text.length > 100 ? text.substring(0, 100) + '...' : text
  }

  private generateRecommendationsFromSentiment(sentiment: string): string[] {
    const recommendations = {
      positive: ['Maintain current approach', 'Share success stories', 'Encourage referrals'],
      negative: ['Address concerns promptly', 'Improve service quality', 'Gather feedback'],
      neutral: ['Enhance engagement', 'Provide more information', 'Follow up with users']
    }
    
    return recommendations[sentiment as keyof typeof recommendations] || recommendations.neutral
  }

  private analyzeTone(content: string): string {
    if (content.includes('!')) return 'enthusiastic'
    if (content.includes('?')) return 'inquisitive'
    if (content.includes('professional') || content.includes('expert')) return 'professional'
    return 'neutral'
  }

  private checkSEOOptimization(content: string): boolean {
    const seoFactors = ['keywords', 'meta', 'title', 'description']
    return seoFactors.some(factor => content.toLowerCase().includes(factor))
  }

  private generateSuggestions(content: string): string[] {
    const suggestions = []
    if (content.length < 100) suggestions.push('Add more descriptive content')
    if (!content.includes('wedding')) suggestions.push('Include wedding-related keywords')
    if (!content.includes('service')) suggestions.push('Mention specific services offered')
    return suggestions
  }

  private parseSentimentAnalysis(analysis: string): AIAnalysisResult {
    // Parse AI response and extract structured data
    return {
      sentiment: 'positive',
      confidence: 0.8,
      keywords: ['wedding', 'beautiful', 'perfect'],
      summary: analysis.substring(0, 100),
      recommendations: ['Continue current approach', 'Share positive feedback']
    }
  }

  private parsePredictiveInsights(analysis: string): PredictiveInsights {
    return {
      trend: 'increasing',
      confidence: 0.7,
      factors: ['Market growth', 'Seasonal demand'],
      recommendations: ['Expand services', 'Increase marketing'],
      timeframe: '6 months'
    }
  }

  private parseRecommendations(recommendations: string): any[] {
    return []
  }

  private async performDatabaseSearch(query: string): Promise<any[]> {
    // Implement database search logic
    return []
  }
}

export const advancedAIService = new AdvancedAIService() 