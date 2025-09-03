import { connectDB } from './db'
import { User, Vendor, Venue, Booking, Payment } from './models'

interface LocalizationConfig {
  language: string
  currency: string
  timezone: string
  dateFormat: string
  numberFormat: string
  addressFormat: string
  phoneFormat: string
}

interface SupportedRegion {
  code: string
  name: string
  languages: string[]
  currencies: string[]
  timezones: string[]
  dateFormats: string[]
  numberFormats: string[]
  addressFormats: string[]
  phoneFormats: string[]
  culturalPreferences: CulturalPreferences
  legalRequirements: LegalRequirements
  marketData: MarketData
}

interface CulturalPreferences {
  weddingTraditions: string[]
  colorPreferences: string[]
  giftPreferences: string[]
  celebrationStyles: string[]
  dietaryRestrictions: string[]
  religiousConsiderations: string[]
  seasonalPreferences: string[]
}

interface LegalRequirements {
  marriageLaws: string[]
  vendorLicensing: string[]
  taxRequirements: string[]
  dataProtection: string[]
  importRestrictions: string[]
  businessRegistration: string[]
}

interface MarketData {
  population: number
  weddingMarketSize: number
  averageWeddingCost: number
  popularVenues: string[]
  trendingServices: string[]
  competition: string[]
  opportunities: string[]
}

interface CurrencyExchange {
  fromCurrency: string
  toCurrency: string
  rate: number
  lastUpdated: Date
  source: string
}

interface TranslationCache {
  key: string
  language: string
  translation: string
  lastUpdated: Date
}

class InternationalExpansionService {
  private supportedRegions: Map<string, SupportedRegion> = new Map()
  private exchangeRates: Map<string, CurrencyExchange> = new Map()
  private translationCache: Map<string, TranslationCache> = new Map()
  private defaultConfig: LocalizationConfig = {
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    addressFormat: 'US',
    phoneFormat: 'US'
  }

  constructor() {
    this.initializeSupportedRegions()
  }

  private initializeSupportedRegions() {
    // North America
    this.supportedRegions.set('US', {
      code: 'US',
      name: 'United States',
      languages: ['en'],
      currencies: ['USD'],
      timezones: ['UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4'],
      dateFormats: ['MM/DD/YYYY', 'MM-DD-YYYY'],
      numberFormats: ['en-US'],
      addressFormats: ['US'],
      phoneFormats: ['US'],
      culturalPreferences: {
        weddingTraditions: ['White dress', 'Something borrowed', 'First dance', 'Bouquet toss'],
        colorPreferences: ['White', 'Ivory', 'Blush', 'Navy', 'Gold'],
        giftPreferences: ['Registry gifts', 'Cash gifts', 'Honeymoon fund'],
        celebrationStyles: ['Formal', 'Casual', 'Traditional', 'Modern'],
        dietaryRestrictions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'],
        religiousConsiderations: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Buddhist'],
        seasonalPreferences: ['Spring', 'Summer', 'Fall', 'Winter']
      },
      legalRequirements: {
        marriageLaws: ['Age 18+', 'Valid ID', 'Marriage license', 'Witnesses required'],
        vendorLicensing: ['Business license', 'Insurance required', 'Tax registration'],
        taxRequirements: ['Sales tax', 'Income tax', 'Business tax'],
        dataProtection: ['GDPR compliance', 'CCPA compliance', 'Privacy policy required'],
        importRestrictions: ['Food restrictions', 'Flower restrictions', 'Alcohol restrictions'],
        businessRegistration: ['LLC', 'Corporation', 'Sole proprietorship']
      },
      marketData: {
        population: 331000000,
        weddingMarketSize: 72000000000,
        averageWeddingCost: 28000,
        popularVenues: ['Hotel ballrooms', 'Outdoor gardens', 'Historic buildings', 'Beach resorts'],
        trendingServices: ['Live streaming', 'Virtual planning', 'Eco-friendly options', 'Micro-weddings'],
        competition: ['The Knot', 'WeddingWire', 'Zola'],
        opportunities: ['Technology integration', 'Sustainability focus', 'Personalization']
      }
    })

    // Europe
    this.supportedRegions.set('UK', {
      code: 'UK',
      name: 'United Kingdom',
      languages: ['en'],
      currencies: ['GBP'],
      timezones: ['UTC+0', 'UTC+1'],
      dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
      numberFormats: ['en-GB'],
      addressFormats: ['UK'],
      phoneFormats: ['UK'],
      culturalPreferences: {
        weddingTraditions: ['Church ceremony', 'Reception', 'Wedding breakfast', 'Evening party'],
        colorPreferences: ['White', 'Cream', 'Blush', 'Navy', 'Burgundy'],
        giftPreferences: ['Wedding list', 'Cash gifts', 'Charitable donations'],
        celebrationStyles: ['Traditional', 'Formal', 'Elegant', 'Classic'],
        dietaryRestrictions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'],
        religiousConsiderations: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Sikh'],
        seasonalPreferences: ['Spring', 'Summer', 'Autumn', 'Winter']
      },
      legalRequirements: {
        marriageLaws: ['Age 16+', 'Notice of marriage', 'Civil ceremony', 'Religious ceremony'],
        vendorLicensing: ['Business registration', 'Insurance required', 'VAT registration'],
        taxRequirements: ['VAT', 'Income tax', 'Corporation tax'],
        dataProtection: ['GDPR compliance', 'Data protection act', 'Privacy policy required'],
        importRestrictions: ['EU regulations', 'Customs requirements', 'Documentation needed'],
        businessRegistration: ['Limited company', 'Partnership', 'Sole trader']
      },
      marketData: {
        population: 67000000,
        weddingMarketSize: 10000000000,
        averageWeddingCost: 31000,
        popularVenues: ['Historic castles', 'Country houses', 'City hotels', 'Garden venues'],
        trendingServices: ['Eco-weddings', 'Intimate ceremonies', 'Weekend celebrations', 'Destination weddings'],
        competition: ['Hitched', 'Wedding Ideas', 'You & Your Wedding'],
        opportunities: ['Heritage venues', 'Sustainable options', 'Luxury market']
      }
    })

    // Asia
    this.supportedRegions.set('IN', {
      code: 'IN',
      name: 'India',
      languages: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'],
      currencies: ['INR'],
      timezones: ['UTC+5:30'],
      dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
      numberFormats: ['en-IN'],
      addressFormats: ['IN'],
      phoneFormats: ['IN'],
      culturalPreferences: {
        weddingTraditions: ['Mehendi ceremony', 'Sangeet', 'Haldi ceremony', 'Wedding ceremony', 'Reception'],
        colorPreferences: ['Red', 'Gold', 'Pink', 'Orange', 'Green', 'Purple'],
        giftPreferences: ['Gold jewelry', 'Cash gifts', 'Traditional items', 'Household items'],
        celebrationStyles: ['Grand', 'Traditional', 'Colorful', 'Multi-day'],
        dietaryRestrictions: ['Vegetarian', 'Vegan', 'Jain', 'Halal', 'Kosher'],
        religiousConsiderations: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist'],
        seasonalPreferences: ['October to December', 'February to April']
      },
      legalRequirements: {
        marriageLaws: ['Age 18+', 'Marriage registration', 'Document verification', 'Witnesses required'],
        vendorLicensing: ['Business registration', 'GST registration', 'Professional licenses'],
        taxRequirements: ['GST', 'Income tax', 'Professional tax'],
        dataProtection: ['PDPB compliance', 'Privacy policy required', 'Data localization'],
        importRestrictions: ['Customs duties', 'Import licenses', 'Documentation required'],
        businessRegistration: ['Private limited', 'Partnership', 'Proprietorship']
      },
      marketData: {
        population: 1380000000,
        weddingMarketSize: 50000000000,
        averageWeddingCost: 15000,
        popularVenues: ['Palace hotels', 'Beach resorts', 'Garden venues', 'Heritage properties'],
        trendingServices: ['Destination weddings', 'Luxury packages', 'Cultural experiences', 'Digital planning'],
        competition: ['Weddingz.in', 'WedMeGood', 'Bridal Asia'],
        opportunities: ['Luxury market', 'Cultural tourism', 'Technology integration']
      }
    })

    // Australia
    this.supportedRegions.set('AU', {
      code: 'AU',
      name: 'Australia',
      languages: ['en'],
      currencies: ['AUD'],
      timezones: ['UTC+8', 'UTC+9:30', 'UTC+10', 'UTC+10:30', 'UTC+11'],
      dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
      numberFormats: ['en-AU'],
      addressFormats: ['AU'],
      phoneFormats: ['AU'],
      culturalPreferences: {
        weddingTraditions: ['Beach ceremonies', 'Outdoor celebrations', 'BBQ receptions', 'Casual style'],
        colorPreferences: ['White', 'Cream', 'Blue', 'Green', 'Coral'],
        giftPreferences: ['Registry gifts', 'Cash gifts', 'Honeymoon fund', 'Charitable donations'],
        celebrationStyles: ['Casual', 'Outdoor', 'Beach', 'Modern'],
        dietaryRestrictions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'],
        religiousConsiderations: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Buddhist'],
        seasonalPreferences: ['Spring', 'Summer', 'Autumn', 'Winter']
      },
      legalRequirements: {
        marriageLaws: ['Age 18+', 'Notice of intended marriage', 'Civil ceremony', 'Religious ceremony'],
        vendorLicensing: ['Business registration', 'Insurance required', 'GST registration'],
        taxRequirements: ['GST', 'Income tax', 'Business tax'],
        dataProtection: ['Privacy act compliance', 'Privacy policy required', 'Data security'],
        importRestrictions: ['Customs requirements', 'Quarantine regulations', 'Documentation needed'],
        businessRegistration: ['Company', 'Partnership', 'Sole trader']
      },
      marketData: {
        population: 25000000,
        weddingMarketSize: 8000000000,
        averageWeddingCost: 36000,
        popularVenues: ['Beach venues', 'Vineyards', 'Botanical gardens', 'Historic buildings'],
        trendingServices: ['Eco-weddings', 'Adventure weddings', 'Indigenous experiences', 'Sustainable options'],
        competition: ['Easy Weddings', 'Wedding.com.au', 'Bride Online'],
        opportunities: ['Eco-tourism', 'Indigenous culture', 'Adventure tourism']
      }
    })

    // Sri Lanka
    this.supportedRegions.set('LK', {
      code: 'LK',
      name: 'Sri Lanka',
      languages: ['en', 'si', 'ta'],
      currencies: ['LKR'],
      timezones: ['UTC+5:30'],
      dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
      numberFormats: ['en-LK'],
      addressFormats: ['LK'],
      phoneFormats: ['LK'],
      culturalPreferences: {
        weddingTraditions: ['Poruwa ceremony', 'Traditional rituals', 'Cultural performances', 'Family celebrations'],
        colorPreferences: ['Red', 'Gold', 'White', 'Pink', 'Purple'],
        giftPreferences: ['Traditional items', 'Cash gifts', 'Jewelry', 'Household items'],
        celebrationStyles: ['Traditional', 'Cultural', 'Family-oriented', 'Multi-day'],
        dietaryRestrictions: ['Vegetarian', 'Vegan', 'Buddhist', 'Hindu', 'Muslim'],
        religiousConsiderations: ['Buddhist', 'Hindu', 'Muslim', 'Christian'],
        seasonalPreferences: ['December to April', 'July to September']
      },
      legalRequirements: {
        marriageLaws: ['Age 18+', 'Marriage registration', 'Document verification', 'Witnesses required'],
        vendorLicensing: ['Business registration', 'Tax registration', 'Professional licenses'],
        taxRequirements: ['VAT', 'Income tax', 'Business tax'],
        dataProtection: ['Privacy protection', 'Data security', 'Privacy policy required'],
        importRestrictions: ['Customs duties', 'Import permits', 'Documentation required'],
        businessRegistration: ['Private limited', 'Partnership', 'Sole proprietorship']
      },
      marketData: {
        population: 22000000,
        weddingMarketSize: 2000000000,
        averageWeddingCost: 8000,
        popularVenues: ['Beach resorts', 'Heritage hotels', 'Garden venues', 'Cultural sites'],
        trendingServices: ['Destination weddings', 'Cultural experiences', 'Luxury packages', 'Eco-tourism'],
        competition: ['WeddingLK', 'Wedding Bells', 'Perfect Weddings'],
        opportunities: ['Cultural tourism', 'Luxury market', 'Sustainable tourism']
      }
    })
  }

  // Localization Management
  async getLocalizationConfig(userId: string, regionCode: string): Promise<LocalizationConfig> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const region = this.supportedRegions.get(regionCode)
      if (!region) {
        throw new Error(`Unsupported region: ${regionCode}`)
      }

      // Get user preferences or use region defaults
      const userPreferences = user.localizationPreferences?.[regionCode] || {}
      
      const config: LocalizationConfig = {
        language: userPreferences.language || region.languages[0],
        currency: userPreferences.currency || region.currencies[0],
        timezone: userPreferences.timezone || region.timezones[0],
        dateFormat: userPreferences.dateFormat || region.dateFormats[0],
        numberFormat: userPreferences.numberFormat || region.numberFormats[0],
        addressFormat: userPreferences.addressFormat || region.addressFormats[0],
        phoneFormat: userPreferences.phoneFormat || region.phoneFormats[0]
      }

      return config
    } catch (error) {
      console.error('Error getting localization config:', error)
      return this.defaultConfig
    }
  }

  async updateLocalizationConfig(
    userId: string,
    regionCode: string,
    config: Partial<LocalizationConfig>
  ): Promise<void> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const region = this.supportedRegions.get(regionCode)
      if (!region) {
        throw new Error(`Unsupported region: ${regionCode}`)
      }

      // Validate configuration against region support
      const validatedConfig = this.validateConfiguration(config, region)
      
      // Update user preferences
      const currentPreferences = user.localizationPreferences || {}
      currentPreferences[regionCode] = {
        ...currentPreferences[regionCode],
        ...validatedConfig
      }

      await User.findByIdAndUpdate(userId, {
        localizationPreferences: currentPreferences
      })
    } catch (error) {
      console.error('Error updating localization config:', error)
      throw new Error('Failed to update localization config')
    }
  }

  // Currency Management
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const cacheKey = `${fromCurrency}_${toCurrency}`
      const cached = this.exchangeRates.get(cacheKey)
      
      // Check if cached rate is still valid (less than 1 hour old)
      if (cached && Date.now() - cached.lastUpdated.getTime() < 60 * 60 * 1000) {
        return cached.rate
      }

      // Fetch new exchange rate from API
      const rate = await this.fetchExchangeRate(fromCurrency, toCurrency)
      
      // Cache the new rate
      this.exchangeRates.set(cacheKey, {
        fromCurrency,
        toCurrency,
        rate,
        lastUpdated: new Date(),
        source: 'exchange_rate_api'
      })
      
      return rate
    } catch (error) {
      console.error('Error getting exchange rate:', error)
      // Return cached rate if available, otherwise return 1
      const cached = this.exchangeRates.get(`${fromCurrency}_${toCurrency}`)
      return cached ? cached.rate : 1
    }
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    try {
      if (fromCurrency === toCurrency) {
        return amount
      }

      const rate = await this.getExchangeRate(fromCurrency, toCurrency)
      return amount * rate
    } catch (error) {
      console.error('Error converting currency:', error)
      return amount
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    const currencies = new Set<string>()
    
    for (const region of this.supportedRegions.values()) {
      region.currencies.forEach(currency => currencies.add(currency))
    }
    
    return Array.from(currencies)
  }

  // Language and Translation
  async translateText(
    text: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<string> {
    try {
      if (fromLanguage === toLanguage) {
        return text
      }

      const cacheKey = `${text}_${fromLanguage}_${toLanguage}`
      const cached = this.translationCache.get(cacheKey)
      
      // Check if cached translation is still valid (less than 24 hours old)
      if (cached && Date.now() - cached.lastUpdated.getTime() < 24 * 60 * 60 * 1000) {
        return cached.translation
      }

      // Translate text using translation service
      const translation = await this.translateWithService(text, fromLanguage, toLanguage)
      
      // Cache the translation
      this.translationCache.set(cacheKey, {
        key: cacheKey,
        language: toLanguage,
        translation,
        lastUpdated: new Date()
      })
      
      return translation
    } catch (error) {
      console.error('Error translating text:', error)
      return text
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    const languages = new Set<string>()
    
    for (const region of this.supportedRegions.values()) {
      region.languages.forEach(language => languages.add(language))
    }
    
    return Array.from(languages)
  }

  // Regional Adaptations
  async adaptContentForRegion(
    content: string,
    regionCode: string,
    contentType: 'wedding' | 'vendor' | 'venue' | 'general'
  ): Promise<string> {
    try {
      const region = this.supportedRegions.get(regionCode)
      if (!region) {
        return content
      }

      let adaptedContent = content

      // Adapt based on cultural preferences
      adaptedContent = this.adaptCulturalContent(adaptedContent, region.culturalPreferences, contentType)
      
      // Adapt based on legal requirements
      adaptedContent = this.adaptLegalContent(adaptedContent, region.legalRequirements, contentType)
      
      // Adapt based on market data
      adaptedContent = this.adaptMarketContent(adaptedContent, region.marketData, contentType)

      return adaptedContent
    } catch (error) {
      console.error('Error adapting content for region:', error)
      return content
    }
  }

  async getRegionalRecommendations(
    regionCode: string,
    category: 'venue' | 'vendor' | 'service'
  ): Promise<string[]> {
    try {
      const region = this.supportedRegions.get(regionCode)
      if (!region) {
        return []
      }

      switch (category) {
        case 'venue':
          return region.marketData.popularVenues
        case 'vendor':
          return region.marketData.trendingServices
        case 'service':
          return region.marketData.trendingServices
        default:
          return []
      }
    } catch (error) {
      console.error('Error getting regional recommendations:', error)
      return []
    }
  }

  // Market Analysis
  async getMarketAnalysis(regionCode: string): Promise<MarketData> {
    try {
      const region = this.supportedRegions.get(regionCode)
      if (!region) {
        throw new Error(`Unsupported region: ${regionCode}`)
      }

      return region.marketData
    } catch (error) {
      console.error('Error getting market analysis:', error)
      throw new Error('Failed to get market analysis')
    }
  }

  async compareMarkets(regionCodes: string[]): Promise<Record<string, MarketData>> {
    try {
      const comparison: Record<string, MarketData> = {}
      
      for (const code of regionCodes) {
        const region = this.supportedRegions.get(code)
        if (region) {
          comparison[code] = region.marketData
        }
      }
      
      return comparison
    } catch (error) {
      console.error('Error comparing markets:', error)
      throw new Error('Failed to compare markets')
    }
  }

  // Business Expansion Support
  async getExpansionRecommendations(
    currentRegion: string,
    targetRegions: string[]
  ): Promise<Record<string, any>> {
    try {
      const recommendations: Record<string, any> = {}
      
      for (const targetRegion of targetRegions) {
        const currentMarket = this.supportedRegions.get(currentRegion)?.marketData
        const targetMarket = this.supportedRegions.get(targetRegion)?.marketData
        
        if (currentMarket && targetMarket) {
          recommendations[targetRegion] = {
            marketSize: targetMarket.weddingMarketSize,
            averageCost: targetMarket.averageWeddingCost,
            opportunities: targetMarket.opportunities,
            competition: targetMarket.competition,
            marketGap: targetMarket.weddingMarketSize - currentMarket.weddingMarketSize,
            costDifference: targetMarket.averageWeddingCost - currentMarket.averageWeddingCost
          }
        }
      }
      
      return recommendations
    } catch (error) {
      console.error('Error getting expansion recommendations:', error)
      throw new Error('Failed to get expansion recommendations')
    }
  }

  // Utility Methods
  private validateConfiguration(
    config: Partial<LocalizationConfig>,
    region: SupportedRegion
  ): Partial<LocalizationConfig> {
    const validated: Partial<LocalizationConfig> = {}
    
    if (config.language && region.languages.includes(config.language)) {
      validated.language = config.language
    }
    
    if (config.currency && region.currencies.includes(config.currency)) {
      validated.currency = config.currency
    }
    
    if (config.timezone && region.timezones.includes(config.timezone)) {
      validated.timezone = config.timezone
    }
    
    if (config.dateFormat && region.dateFormats.includes(config.dateFormat)) {
      validated.dateFormat = config.dateFormat
    }
    
    if (config.numberFormat && region.numberFormats.includes(config.numberFormat)) {
      validated.numberFormat = config.numberFormat
    }
    
    if (config.addressFormat && region.addressFormats.includes(config.addressFormat)) {
      validated.addressFormat = config.addressFormat
    }
    
    if (config.phoneFormat && region.phoneFormats.includes(config.phoneFormat)) {
      validated.phoneFormat = config.phoneFormat
    }
    
    return validated
  }

  private async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // This would integrate with a real exchange rate API
      // For now, return mock rates
      const mockRates: Record<string, number> = {
        'USD_LKR': 320.0,
        'USD_INR': 83.0,
        'USD_AUD': 1.5,
        'USD_GBP': 0.8,
        'LKR_USD': 0.0031,
        'INR_USD': 0.012,
        'AUD_USD': 0.67,
        'GBP_USD': 1.25
      }
      
      const key = `${fromCurrency}_${toCurrency}`
      return mockRates[key] || 1.0
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      return 1.0
    }
  }

  private async translateWithService(
    text: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<string> {
    try {
      // This would integrate with a real translation service
      // For now, return mock translations
      const mockTranslations: Record<string, string> = {
        'en_hi': 'शादी की योजना',
        'en_ta': 'திருமண திட்டமிடல்',
        'en_si': 'විවාහ සැලසුම්',
        'hi_en': 'Wedding Planning',
        'ta_en': 'Wedding Planning',
        'si_en': 'Wedding Planning'
      }
      
      const key = `${fromLanguage}_${toLanguage}`
      return mockTranslations[key] || text
    } catch (error) {
      console.error('Error translating with service:', error)
      return text
    }
  }

  private adaptCulturalContent(
    content: string,
    preferences: CulturalPreferences,
    contentType: string
  ): string {
    let adapted = content
    
    // Adapt based on cultural preferences
    if (contentType === 'wedding') {
      adapted = adapted.replace(/traditional/g, 'culturally appropriate')
      adapted = adapted.replace(/modern/g, 'contemporary')
    }
    
    return adapted
  }

  private adaptLegalContent(
    content: string,
    requirements: LegalRequirements,
    contentType: string
  ): string {
    let adapted = content
    
    // Adapt based on legal requirements
    if (contentType === 'vendor') {
      adapted = adapted.replace(/licensed/g, 'properly registered')
      adapted = adapted.replace(/insured/g, 'adequately protected')
    }
    
    return adapted
  }

  private adaptMarketContent(
    content: string,
    marketData: MarketData,
    contentType: string
  ): string {
    let adapted = content
    
    // Adapt based on market data
    if (contentType === 'venue') {
      adapted = adapted.replace(/luxury/g, 'premium')
      adapted = adapted.replace(/affordable/g, 'value-conscious')
    }
    
    return adapted
  }

  // Public Methods
  public getSupportedRegions(): string[] {
    return Array.from(this.supportedRegions.keys())
  }

  public getRegionInfo(regionCode: string): SupportedRegion | null {
    return this.supportedRegions.get(regionCode) || null
  }

  public isRegionSupported(regionCode: string): boolean {
    return this.supportedRegions.has(regionCode)
  }

  public getRegionLanguages(regionCode: string): string[] {
    const region = this.supportedRegions.get(regionCode)
    return region ? region.languages : []
  }

  public getRegionCurrencies(regionCode: string): string[] {
    const region = this.supportedRegions.get(regionCode)
    return region ? region.currencies : []
  }

  public getRegionTimezones(regionCode: string): string[] {
    const region = this.supportedRegions.get(regionCode)
    return region ? region.timezones : []
  }

  public clearCache(): void {
    this.exchangeRates.clear()
    this.translationCache.clear()
  }

  public getCacheStats(): Record<string, number> {
    return {
      exchangeRates: this.exchangeRates.size,
      translations: this.translationCache.size
    }
  }
}

export const internationalExpansionService = new InternationalExpansionService() 