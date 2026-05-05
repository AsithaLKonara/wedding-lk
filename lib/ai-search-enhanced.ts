// Enhanced AI Search Service for WeddingLK
// Real LLM integration with intelligent wedding planning

import { groq, GROQ_MODEL } from './groq';
import { connectDB } from './db';
import { Venue } from './models/venue';
import { Vendor } from './models/vendor';
import { Package } from './models/package';
import { enhancedCacheManager } from './enhanced-cache-manager';
import { escapeRegExp } from './utils/regex-utils';

// Groq client is now managed in lib/groq.ts

export interface WeddingContext {
  budget: number;
  guestCount: number;
  location: string;
  date: string;
  style: string;
  preferences: string[];
  specialRequirements: string[];
}

// Type definitions for AI search results
interface VenueResult {
  _id: string;
  name: string;
  location?: { city?: string; address?: string };
  capacity?: { max: number; min: number };
  pricing?: { basePrice: number };
  rating?: { average: number; count: number };
  images?: string[];
  [key: string]: unknown;
}

interface VendorResult {
  _id: string;
  businessName: string;
  category?: string;
  location?: { city?: string };
  rating?: { average: number; count: number };
  [key: string]: unknown;
}

interface PackageResult {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features?: string[];
  venues?: unknown[];
  vendors?: unknown[];
  rating?: number;
  matchScore?: number;
  personalizedFeatures?: string[];
  whyRecommended?: string[];
  [key: string]: unknown;
}

export interface AISearchResult {
  venues: VenueResult[];
  vendors: VendorResult[];
  packages: PackageResult[];
  recommendations: string[];
  budgetBreakdown: {
    venue: number;
    catering: number;
    photography: number;
    decoration: number;
    music: number;
    other: number;
  };
  timeline: {
    months: number;
    milestones: Array<{
      month: number;
      task: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  culturalInsights: string[];
  localTips: string[];
}

export class EnhancedAISearchService {
  private static instance: EnhancedAISearchService;

  private constructor() {}

  public static getInstance(): EnhancedAISearchService {
    if (!EnhancedAISearchService.instance) {
      EnhancedAISearchService.instance = new EnhancedAISearchService();
    }
    return EnhancedAISearchService.instance;
  }

  // Main AI search function
  async searchWeddingPlan(query: string, context: WeddingContext): Promise<AISearchResult> {
    const cacheKey = `ai_search:${JSON.stringify({ query, context })}`;
    
    // Try to get from cache first
    const cached = await enhancedCacheManager.get<AISearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Generate AI-powered search results
      const aiResponse = await this.generateAIResponse(query, context);
      
      // Search database for relevant venues, vendors, and packages
      const [venues, vendors, packages] = await Promise.all([
        this.searchVenues(context),
        this.searchVendors(context),
        this.searchPackages(context)
      ]);

      // Generate recommendations and insights
      const recommendations = await this.generateRecommendations(context, aiResponse);
      const budgetBreakdown = await this.generateBudgetBreakdown(context);
      const timeline = await this.generateTimeline(context);
      const culturalInsights = await this.generateCulturalInsights(context);
      const localTips = await this.generateLocalTips(context);

      const result: AISearchResult = {
        venues,
        vendors,
        packages,
        recommendations,
        budgetBreakdown,
        timeline,
        culturalInsights,
        localTips
      };

      // Cache the result for 1 hour
      await enhancedCacheManager.set(cacheKey, result, {
        ttl: 3600,
        tags: ['ai_search', 'wedding_plan']
      });

      return result;

    } catch (error) {
      console.error('AI search error:', error);
      throw new Error('Failed to generate wedding plan');
    }
  }

  // Generate AI response using Groq
  private async generateAIResponse(query: string, context: WeddingContext): Promise<string> {
    const prompt = this.buildWeddingPrompt(query, context);
    
    if (!groq) {
      console.warn('Groq API key not configured, using local AI response');
      return this.generateLocalAIResponse(query, context);
    }
    
    try {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: `You are WeddingLK AI, an expert wedding planning assistant specialized in Sri Lankan weddings. 
            You understand local customs (Poruwa ceremony, Kandyan traditions), venues, and vendors. Provide detailed, culturally 
            appropriate advice for wedding planning in Sri Lanka. Be helpful, professional, and insightful.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Groq API error:', error);
      // Fallback to local AI response
      return this.generateLocalAIResponse(query, context);
    }
  }


  // Build comprehensive wedding planning prompt
  private buildWeddingPrompt(query: string, context: WeddingContext): string {
    return `
    Wedding Planning Query: "${query}"
    
    Wedding Context:
    - Budget: LKR ${context.budget.toLocaleString()}
    - Guest Count: ${context.guestCount}
    - Location: ${context.location}
    - Date: ${context.date}
    - Style: ${context.style}
    - Preferences: ${context.preferences.join(', ')}
    - Special Requirements: ${context.specialRequirements.join(', ')}
    
    Please provide:
    1. Specific venue recommendations for Sri Lankan weddings
    2. Vendor suggestions (catering, photography, decoration, music)
    3. Cultural considerations and traditions
    4. Budget allocation advice
    5. Timeline recommendations
    6. Local tips and insights
    7. Any special considerations for the location and date
    
    Focus on practical, actionable advice suitable for Sri Lankan wedding planning.
    `;
  }

  // Fallback local AI response
  private generateLocalAIResponse(query: string, context: WeddingContext): string {
    const responses = [
      `Based on your ${context.guestCount}-guest wedding in ${context.location} with a budget of LKR ${context.budget.toLocaleString()}, I recommend focusing on venues that can accommodate your guest count comfortably.`,
      `For a ${context.style} wedding, consider traditional Sri Lankan elements like Kandyan dancing, traditional music, and local cuisine.`,
      `Your budget allows for a beautiful celebration. I suggest allocating 40% for venue, 30% for catering, 15% for photography, 10% for decoration, and 5% for other expenses.`,
      `Given your location in ${context.location}, consider local vendors who understand the area and can provide better value.`,
      `For your wedding date of ${context.date}, book vendors early as this is a popular wedding season in Sri Lanka.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Search venues based on context
  private async searchVenues(context: WeddingContext): Promise<VenueResult[]> {
    try {
      await connectDB();
      
      const venues = await Venue.find({
        $and: [
          { capacity: { $gte: context.guestCount } },
          { location: { $regex: escapeRegExp(context.location), $options: 'i' } },
          { priceRange: { $lte: context.budget * 0.4 } } // 40% of budget for venue
        ]
      })
      .limit(10)
      .sort({ rating: -1 });

      return venues.map((venue: unknown) => {
        const v = venue as {
          _id: unknown;
          name?: string;
          location?: { city?: string; address?: string };
          capacity?: { max: number; min: number };
          pricing?: { basePrice?: number };
          rating?: { average?: number; count?: number };
          amenities?: unknown[];
          images?: string[];
          description?: string;
        };
        return {
          _id: String(v._id || ''),
          name: v.name || '',
          location: v.location,
          capacity: v.capacity,
          priceRange: v.pricing?.basePrice || 0,
          rating: v.rating?.average || 0,
          amenities: v.amenities || [],
          images: v.images || [],
          description: v.description || ''
        } as unknown as VenueResult;
      });
    } catch (error) {
      console.error('Venue search error:', error);
      return [];
    }
  }

  // Search vendors based on context
  private async searchVendors(context: WeddingContext): Promise<VendorResult[]> {
    try {
      await connectDB();
      
      const vendors = await Vendor.find({
        $and: [
          { location: { $regex: escapeRegExp(context.location), $options: 'i' } },
          { isActive: true }
        ]
      })
      .limit(15)
      .sort({ rating: -1 });

      return vendors.map((vendor: unknown) => {
        const v = vendor as {
          _id: unknown;
          businessName?: string;
          category?: string;
          location?: { city?: string };
          rating?: { average?: number; count?: number };
          pricing?: { startingPrice?: number };
          services?: unknown[];
          images?: string[];
          description?: string;
        };
        return {
          _id: String(v._id || ''),
          businessName: v.businessName || '',
          category: v.category,
          location: v.location,
          rating: v.rating?.average || 0,
          priceRange: v.pricing?.startingPrice || 0,
          services: v.services || [],
          images: v.images || [],
          description: v.description || ''
        } as unknown as VendorResult;
      });
    } catch (error) {
      console.error('Vendor search error:', error);
      return [];
    }
  }

  // Search wedding packages based on context
  private async searchPackages(context: WeddingContext): Promise<PackageResult[]> {
    try {
      await connectDB();
      
      const packages = await Package.find({
        price: { $lte: context.budget * 1.2 }, // Allow 20% over budget for recommendations
        featured: true
      })
      .populate('venues', 'name rating images location capacity pricing')
      .populate('vendors', 'businessName category rating location services')
      .sort({ 'rating.average': -1 })
      .limit(6)
      .lean();

      return packages.map((pkg: unknown) => {
        const p = pkg as {
          _id: unknown;
          name?: string;
          description?: string;
          price?: number;
          originalPrice?: number;
          rating?: { average?: number };
          features?: string[];
          venues?: unknown[];
          vendors?: unknown[];
        };
        const packageResult: PackageResult = {
          _id: String(p._id || ''),
          name: p.name || '',
          description: p.description || '',
          price: p.price || 0,
          originalPrice: p.originalPrice || p.price || 0,
          rating: (typeof p.rating === 'object' && p.rating && 'average' in p.rating) ? ((p.rating as { average?: number }).average || 0) : (typeof p.rating === 'number' ? p.rating : 0),
          features: Array.isArray(p.features) ? p.features : [],
          venues: (Array.isArray(p.venues) ? p.venues : []) as unknown[],
          vendors: p.vendors || [],
          matchScore: 0,
          personalizedFeatures: [],
          whyRecommended: []
        };
        packageResult.matchScore = this.calculatePackageMatchScore(packageResult, context);
        packageResult.personalizedFeatures = this.generatePersonalizedFeatures(packageResult, context);
        packageResult.whyRecommended = this.generatePackageWhyRecommended(packageResult, context);
        return packageResult;
      });

    } catch (error) {
      console.error('Package search error:', error);
      return [];
    }
  }

  // Generate AI recommendations
  private async generateRecommendations(context: WeddingContext, aiResponse: string): Promise<string[]> {
    const recommendations = [
      `Book your venue 6-8 months in advance for ${context.date}`,
      `Consider a ${context.style} theme with traditional Sri Lankan elements`,
      `Allocate LKR ${(context.budget * 0.3).toLocaleString()} for catering`,
      `Hire a local photographer familiar with Sri Lankan wedding traditions`,
      `Plan for traditional ceremonies like Poruwa and Kandyan dancing`,
      `Consider weather backup plans for ${context.date}`,
      `Book accommodation for out-of-town guests`,
      `Plan transportation for guests between ceremony and reception venues`
    ];

    // Add AI-generated recommendations
    if (aiResponse.includes('photography')) {
      recommendations.push('Consider hiring a photographer who specializes in Sri Lankan weddings');
    }
    if (aiResponse.includes('catering')) {
      recommendations.push('Include traditional Sri Lankan dishes in your menu');
    }
    if (aiResponse.includes('music')) {
      recommendations.push('Book traditional musicians for cultural authenticity');
    }

    return recommendations.slice(0, 8);
  }

  // Generate budget breakdown
  private async generateBudgetBreakdown(context: WeddingContext): Promise<AISearchResult['budgetBreakdown']> {
    const total = context.budget;
    
    return {
      venue: Math.round(total * 0.4),
      catering: Math.round(total * 0.3),
      photography: Math.round(total * 0.15),
      decoration: Math.round(total * 0.1),
      music: Math.round(total * 0.03),
      other: Math.round(total * 0.02)
    };
  }

  // Generate wedding timeline
  private async generateTimeline(context: WeddingContext): Promise<AISearchResult['timeline']> {
    const weddingDate = new Date(context.date);
    const monthsUntilWedding = Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
    
    const milestones = [
      { month: Math.max(1, monthsUntilWedding - 8), task: 'Set budget and guest list', priority: 'high' as const },
      { month: Math.max(1, monthsUntilWedding - 6), task: 'Book venue and photographer', priority: 'high' as const },
      { month: Math.max(1, monthsUntilWedding - 4), task: 'Choose caterer and menu', priority: 'high' as const },
      { month: Math.max(1, monthsUntilWedding - 3), task: 'Book musicians and decorators', priority: 'medium' as const },
      { month: Math.max(1, monthsUntilWedding - 2), task: 'Send invitations', priority: 'high' as const },
      { month: Math.max(1, monthsUntilWedding - 1), task: 'Finalize details and fittings', priority: 'high' as const },
      { month: monthsUntilWedding, task: 'Wedding day!', priority: 'high' as const }
    ].filter(milestone => milestone.month > 0);

    return {
      months: monthsUntilWedding,
      milestones
    };
  }

  // Generate cultural insights
  private async generateCulturalInsights(context: WeddingContext): Promise<string[]> {
    const insights = [
      'Traditional Sri Lankan weddings often include Poruwa ceremony',
      'Kandyan dancing is a popular entertainment choice',
      'Traditional attire includes Kandyan saree and national dress',
      'Oil lamp lighting (Pahan Pooja) is a common tradition',
      'Traditional music includes drums, flutes, and string instruments',
      'Blessing from elders is an important part of the ceremony',
      'Traditional sweets and treats are served to guests',
      'Red and gold are popular wedding colors in Sri Lanka'
    ];

    // Add location-specific insights
    if (context.location.toLowerCase().includes('kandy')) {
      insights.push('Kandy offers beautiful temple venues for traditional ceremonies');
    }
    if (context.location.toLowerCase().includes('colombo')) {
      insights.push('Colombo has many modern venues with traditional elements');
    }
    if (context.location.toLowerCase().includes('galle')) {
      insights.push('Galle Fort provides a unique historical backdrop for weddings');
    }

    return insights.slice(0, 6);
  }

  // Generate local tips
  private async generateLocalTips(context: WeddingContext): Promise<string[]> {
    const tips = [
      'Book vendors early as popular dates fill up quickly',
      'Consider weather conditions for outdoor ceremonies',
      'Local vendors often provide better value than international ones',
      'Traditional venues may have specific requirements',
      'Plan for traffic and parking at popular venues',
      'Consider guest accommodation if venue is remote',
      'Check for local permits and regulations',
      'Traditional ceremonies may require specific timing'
    ];

    return tips.slice(0, 6);
  }

  // Get AI-powered venue recommendations
  async getVenueRecommendations(context: WeddingContext): Promise<VenueResult[]> {
    const cacheKey = `venue_recommendations:${JSON.stringify(context)}`;
    
    const cached = await enhancedCacheManager.get<VenueResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const venues = await this.searchVenues(context);
    
    // AI-powered ranking based on context
    const rankedVenues = venues.map(venue => ({
      ...venue,
      aiScore: this.calculateVenueScore(venue, context),
      aiReason: this.generateVenueReason(venue, context)
    })).sort((a, b) => b.aiScore - a.aiScore);

    await enhancedCacheManager.set(cacheKey, rankedVenues, {
      ttl: 1800,
      tags: ['venue_recommendations', 'ai_search']
    });

    return rankedVenues;
  }

  // Calculate AI score for venue
  private calculateVenueScore(venue: VenueResult, context: WeddingContext): number {
    let score = 0;
    
    // Capacity match
    if (venue.capacity && typeof venue.capacity === 'object' && 'max' in venue.capacity && 'min' in venue.capacity) {
      const capacity = venue.capacity as { max: number; min: number };
      if (capacity.max >= context.guestCount && capacity.max <= context.guestCount * 1.2) {
        score += 30;
      }
    }
    
    // Budget match
    const priceRange = typeof venue.priceRange === 'number' ? venue.priceRange : 0;
    if (priceRange <= context.budget * 0.4) {
      score += 25;
    }
    
    // Location match
    if (venue.location && typeof venue.location === 'object') {
      const loc = venue.location as { city?: string; address?: string };
      const locationStr = loc.city || loc.address || '';
      if (locationStr.toLowerCase().includes(context.location.toLowerCase())) {
        score += 20;
      }
    }
    
    // Rating
    const rating = typeof venue.rating === 'number' ? venue.rating : 0;
    score += rating * 5;
    
    // Amenities
    if (venue.amenities && Array.isArray(venue.amenities) && venue.amenities.length > 0) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  // Generate reason for venue recommendation
  private generateVenueReason(venue: VenueResult, context: WeddingContext): string {
    const reasons = [];
    
    if (venue.capacity && typeof venue.capacity === 'object' && 'max' in venue.capacity) {
      const capacity = venue.capacity as { max: number; min: number };
      if (capacity.max >= context.guestCount) {
        reasons.push(`Perfect capacity for your ${context.guestCount} guests`);
      }
    }
    
    const priceRange = typeof venue.priceRange === 'number' ? venue.priceRange : 0;
    if (priceRange <= context.budget * 0.4) {
      reasons.push(`Fits your budget of LKR ${context.budget.toLocaleString()}`);
    }
    
    const rating = typeof venue.rating === 'number' ? venue.rating : 0;
    if (rating >= 4.5) {
      reasons.push('Highly rated by previous couples');
    }
    
    if (venue.amenities && Array.isArray(venue.amenities) && venue.amenities.length > 0) {
      reasons.push('Excellent amenities and facilities');
    }
    
    return reasons.join(', ');
  }

  // Get AI-powered vendor recommendations
  async getVendorRecommendations(context: WeddingContext, category?: string): Promise<VendorResult[]> {
    const cacheKey = `vendor_recommendations:${JSON.stringify({ context, category })}`;
    
    const cached = await enhancedCacheManager.get<VendorResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const vendors = await this.searchVendors(context);
    const filteredVendors = category ? vendors.filter(v => v.category === category) : vendors;
    
    // AI-powered ranking
    const rankedVendors = filteredVendors.map(vendor => ({
      ...vendor,
      aiScore: this.calculateVendorScore(vendor, context),
      aiReason: this.generateVendorReason(vendor, context)
    })).sort((a, b) => b.aiScore - a.aiScore);

    await enhancedCacheManager.set(cacheKey, rankedVendors, {
      ttl: 1800,
      tags: ['vendor_recommendations', 'ai_search']
    });

    return rankedVendors;
  }

  // Calculate AI score for vendor
  private calculateVendorScore(vendor: VendorResult, context: WeddingContext): number {
    let score = 0;
    
    // Rating
    const rating = typeof vendor.rating === 'number' ? vendor.rating : 0;
    score += rating * 20;
    
    // Location match
    if (vendor.location && typeof vendor.location === 'object' && 'city' in vendor.location) {
      const loc = vendor.location as { city?: string };
      if (loc.city && loc.city.toLowerCase().includes(context.location.toLowerCase())) {
        score += 25;
      }
    }
    
    // Price range
    const priceRange = typeof vendor.priceRange === 'number' ? vendor.priceRange : 0;
    if (priceRange > 0 && priceRange <= context.budget * 0.3) {
      score += 20;
    }
    
    // Services match
    const services = Array.isArray(vendor.services) ? vendor.services : [];
    if (services.length > 0) {
      score += 15;
    }
    
    // Category relevance
    const relevantCategories = ['photography', 'catering', 'decoration', 'music'];
    const category = typeof vendor.category === 'string' ? vendor.category : '';
    if (category && relevantCategories.includes(category)) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  // Generate reason for vendor recommendation
  private generateVendorReason(vendor: VendorResult, context: WeddingContext): string {
    const reasons = [];
    
    const rating = typeof vendor.rating === 'number' ? vendor.rating : 0;
    if (rating >= 4.5) {
      reasons.push('Excellent reviews and ratings');
    }
    
    if (vendor.location && typeof vendor.location === 'object' && 'city' in vendor.location) {
      const loc = vendor.location as { city?: string };
      if (loc.city && loc.city.toLowerCase().includes(context.location.toLowerCase())) {
        reasons.push('Local vendor familiar with the area');
      }
    }
    
    if (vendor.services && Array.isArray(vendor.services) && vendor.services.length > 0) {
      reasons.push('Comprehensive service offerings');
    }
    
    return reasons.join(', ');
  }

  // Calculate match score for package
  private calculatePackageMatchScore(pkg: PackageResult, context: WeddingContext): number {
    let score = 0;
    
    // Budget match (40% weight)
    const budgetRatio = pkg.price / context.budget;
    if (budgetRatio <= 1) {
      score += 40;
    } else if (budgetRatio <= 1.2) {
      score += 30;
    } else {
      score += 20;
    }
    
    // Rating match (30% weight)
    const rating = typeof pkg.rating === 'number' ? pkg.rating : 0;
    score += rating * 6; // 5 stars = 30 points
    
    // Feature match (20% weight)
    const features = Array.isArray(pkg.features) ? pkg.features : [];
    const featureMatches = context.preferences.filter((pref: string) => 
      features.some((feature: unknown) => 
        typeof feature === 'string' && feature.toLowerCase().includes(pref.toLowerCase())
      )
    ).length;
    score += (featureMatches / Math.max(context.preferences.length, 1)) * 20;
    
    // Location match (10% weight)
    const venues = Array.isArray(pkg.venues) ? pkg.venues : [];
    const hasLocationMatch = venues.some((venue: unknown) => {
      if (typeof venue === 'object' && venue && 'location' in venue) {
        const v = venue as { location?: { city?: string } };
        return v.location?.city?.toLowerCase().includes(context.location.toLowerCase());
      }
      return false;
    });
    if (hasLocationMatch) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  // Generate personalized features for package
  private generatePersonalizedFeatures(pkg: PackageResult, context: WeddingContext): string[] {
    const features = [...(pkg.features || [])];
    
    // Add personalized features based on context
    if (context.guestCount > 200) {
      features.push(`Accommodates ${context.guestCount}+ guests`);
    }
    
    if (context.budget > 1000000) {
      features.push('Premium luxury experience');
    }
    
    if (context.preferences.includes('Traditional')) {
      features.push('Traditional Sri Lankan elements');
    }
    
    if (context.preferences.includes('Modern')) {
      features.push('Contemporary wedding styling');
    }
    
    return features.slice(0, 8); // Limit to 8 features
  }

  // Generate why recommended for package
  private generatePackageWhyRecommended(pkg: PackageResult, context: WeddingContext): string[] {
    const reasons = [];
    
    if (pkg.price <= context.budget) {
      reasons.push('Fits perfectly within your budget');
    }
    
    const rating = typeof pkg.rating === 'number' ? pkg.rating : 0;
    if (rating >= 4.5) {
      reasons.push('Highly rated by previous couples');
    }
    
    const features = Array.isArray(pkg.features) ? pkg.features : [];
    if (features.length > 6) {
      reasons.push('Comprehensive package with many inclusions');
    }
    
    const venues = Array.isArray(pkg.venues) ? pkg.venues : [];
    if (venues.length > 0) {
      reasons.push('Includes premium venue options');
    }
    
    return reasons;
  }
}

// Export singleton instance
export const enhancedAISearchService = EnhancedAISearchService.getInstance();
