import axios from 'axios';

export interface MetaAdsCampaign {
  id: string;
  name: string;
  objective: 'CONVERSIONS' | 'TRAFFIC' | 'REACH' | 'BRAND_AWARENESS';
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  budget: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MetaAdsAdSet {
  id: string;
  campaignId: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  budget: number;
  optimizationGoal: 'CONVERSIONS' | 'CLICKS' | 'IMPRESSIONS' | 'REACH';
  targeting: {
    ageMin: number;
    ageMax: number;
    genders: number[];
    geoLocations: {
      countries: string[];
      regions?: string[];
      cities?: string[];
    };
    interests: string[];
    behaviors: string[];
    demographics: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MetaAdsCreative {
  id: string;
  adSetId: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  creative: {
    title: string;
    body: string;
    callToActionType: 'BOOK_NOW' | 'LEARN_MORE' | 'SHOP_NOW' | 'SIGN_UP';
    imageUrl?: string;
    videoUrl?: string;
    linkUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MetaAdsMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille
  roas: number; // Return on ad spend
  reach?: number;
  frequency?: number;
  videoViews?: number;
  videoViewRate?: number;
  costPerVideoView?: number;
  linkClicks?: number;
  costPerLinkClick?: number;
  landingPageViews?: number;
  costPerLandingPageView?: number;
  addToCart?: number;
  costPerAddToCart?: number;
  purchases?: number;
  costPerPurchase?: number;
  date: string;
}

export interface MetaAdsInsights {
  campaignId: string;
  adSetId?: string;
  creativeId?: string;
  metrics: MetaAdsMetrics;
  breakdown?: {
    byAge?: Array<{ age: string; metrics: MetaAdsMetrics }>;
    byGender?: Array<{ gender: string; metrics: MetaAdsMetrics }>;
    byCountry?: Array<{ country: string; metrics: MetaAdsMetrics }>;
    byRegion?: Array<{ region: string; metrics: MetaAdsMetrics }>;
    byCity?: Array<{ city: string; metrics: MetaAdsMetrics }>;
    byInterest?: Array<{ interest: string; metrics: MetaAdsMetrics }>;
    byDevice?: Array<{ device: string; metrics: MetaAdsMetrics }>;
    byPlatform?: Array<{ platform: string; metrics: MetaAdsMetrics }>;
  };
  trends?: {
    daily: Array<{ date: string; metrics: MetaAdsMetrics }>;
    weekly: Array<{ week: string; metrics: MetaAdsMetrics }>;
    monthly: Array<{ month: string; metrics: MetaAdsMetrics }>;
  };
  recommendations?: Array<{
    type: 'optimization' | 'budget' | 'targeting' | 'creative';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    action: string;
  }>;
}

export class MetaAdsService {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // Create a new campaign
  async createCampaign(campaignData: Partial<MetaAdsCampaign>): Promise<MetaAdsCampaign> {
    try {
      const response = await axios.post(`${this.baseUrl}/act_${process.env.META_ADS_ACCOUNT_ID}/campaigns`, {
        name: campaignData.name,
        objective: campaignData.objective || 'CONVERSIONS',
        status: campaignData.status || 'PAUSED',
        daily_budget: campaignData.dailyBudget,
        lifetime_budget: campaignData.lifetimeBudget,
        start_time: campaignData.startTime,
        end_time: campaignData.endTime,
        access_token: this.accessToken
      });

      return {
        id: response.data.id,
        name: campaignData.name!,
        objective: campaignData.objective!,
        status: campaignData.status!,
        budget: campaignData.budget!,
        dailyBudget: campaignData.dailyBudget,
        lifetimeBudget: campaignData.lifetimeBudget,
        startTime: campaignData.startTime!,
        endTime: campaignData.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating Meta Ads campaign:', error);
      throw new Error('Failed to create Meta Ads campaign');
    }
  }

  // Create an ad set
  async createAdSet(adSetData: Partial<MetaAdsAdSet>): Promise<MetaAdsAdSet> {
    try {
      const response = await axios.post(`${this.baseUrl}/act_${process.env.META_ADS_ACCOUNT_ID}/adsets`, {
        name: adSetData.name,
        campaign_id: adSetData.campaignId,
        status: adSetData.status || 'PAUSED',
        daily_budget: adSetData.budget,
        optimization_goal: adSetData.optimizationGoal || 'CONVERSIONS',
        targeting: JSON.stringify(adSetData.targeting),
        access_token: this.accessToken
      });

      return {
        id: response.data.id,
        campaignId: adSetData.campaignId!,
        name: adSetData.name!,
        status: adSetData.status!,
        budget: adSetData.budget!,
        optimizationGoal: adSetData.optimizationGoal!,
        targeting: adSetData.targeting!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating Meta Ads ad set:', error);
      throw new Error('Failed to create Meta Ads ad set');
    }
  }

  // Create an ad creative
  async createAdCreative(creativeData: Partial<MetaAdsCreative>): Promise<MetaAdsCreative> {
    try {
      const response = await axios.post(`${this.baseUrl}/act_${process.env.META_ADS_ACCOUNT_ID}/ads`, {
        name: creativeData.name,
        adset_id: creativeData.adSetId,
        status: creativeData.status || 'PAUSED',
        creative: JSON.stringify(creativeData.creative),
        access_token: this.accessToken
      });

      return {
        id: response.data.id,
        adSetId: creativeData.adSetId!,
        name: creativeData.name!,
        status: creativeData.status!,
        creative: creativeData.creative!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating Meta Ads creative:', error);
      throw new Error('Failed to create Meta Ads creative');
    }
  }

  // Get campaign metrics
  async getCampaignMetrics(campaignId: string, dateRange: { start: string; end: string }): Promise<MetaAdsMetrics[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${campaignId}/insights`, {
        params: {
          fields: 'impressions,clicks,spend,conversions,ctr,cpc,cpm,roas',
          time_range: JSON.stringify({
            since: dateRange.start,
            until: dateRange.end
          }),
          access_token: this.accessToken
        }
      });

      return response.data.data.map((metric: any) => ({
        impressions: parseInt(metric.impressions || '0'),
        clicks: parseInt(metric.clicks || '0'),
        spend: parseFloat(metric.spend || '0'),
        conversions: parseInt(metric.conversions || '0'),
        ctr: parseFloat(metric.ctr || '0'),
        cpc: parseFloat(metric.cpc || '0'),
        cpm: parseFloat(metric.cpm || '0'),
        roas: parseFloat(metric.roas || '0'),
        date: metric.date_start
      }));
    } catch (error) {
      console.error('Error fetching Meta Ads metrics:', error);
      throw new Error('Failed to fetch Meta Ads metrics');
    }
  }

  // Update campaign status
  async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED'): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${campaignId}`, {
        status,
        access_token: this.accessToken
      });
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw new Error('Failed to update campaign status');
    }
  }

  // Get all campaigns
  async getCampaigns(): Promise<MetaAdsCampaign[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/act_${process.env.META_ADS_ACCOUNT_ID}/campaigns`, {
        params: {
          fields: 'id,name,objective,status,daily_budget,lifetime_budget,start_time,end_time,created_time,updated_time',
          access_token: this.accessToken
        }
      });

      return response.data.data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        budget: campaign.daily_budget || campaign.lifetime_budget || 0,
        dailyBudget: campaign.daily_budget,
        lifetimeBudget: campaign.lifetime_budget,
        startTime: campaign.start_time,
        endTime: campaign.end_time,
        createdAt: campaign.created_time,
        updatedAt: campaign.updated_time
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns');
    }
  }

  // Generate targeting suggestions based on package data
  generateTargetingSuggestions(packageData: any): any {
    const suggestions = {
      ageMin: 25,
      ageMax: 45,
      genders: [1, 2], // Both male and female
      geoLocations: {
        countries: ['LK'], // Sri Lanka
        regions: [],
        cities: []
      },
      interests: [],
      behaviors: [],
      demographics: []
    };

    // Add location-based targeting
    if (packageData.location) {
      suggestions.geoLocations.cities.push(packageData.location);
    }

    // Add interest-based targeting based on package category
    if (packageData.category) {
      switch (packageData.category.toLowerCase()) {
        case 'photography':
          suggestions.interests.push('Photography', 'Wedding Photography', 'Portrait Photography');
          break;
        case 'catering':
          suggestions.interests.push('Food', 'Cooking', 'Restaurants', 'Wedding Catering');
          break;
        case 'venue':
          suggestions.interests.push('Wedding Venues', 'Event Planning', 'Wedding Planning');
          break;
        case 'music':
          suggestions.interests.push('Music', 'Wedding Music', 'Live Music', 'DJ');
          break;
        case 'decoration':
          suggestions.interests.push('Wedding Decorations', 'Event Decorations', 'Flower Arrangements');
          break;
        default:
          suggestions.interests.push('Wedding Planning', 'Wedding Services');
      }
    }

    // Add behavior-based targeting
    suggestions.behaviors.push('Wedding Planning', 'Event Planning', 'Online Shoppers');

    return suggestions;
  }

  // Validate access token
  async validateAccessToken(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get comprehensive campaign insights
  async getCampaignInsights(campaignId: string, dateRange?: { start: string; end: string }): Promise<MetaAdsInsights> {
    try {
      const defaultDateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        end: new Date().toISOString().split('T')[0] // Today
      };

      const range = dateRange || defaultDateRange;
      
      const fields = [
        'impressions', 'clicks', 'spend', 'conversions', 'ctr', 'cpc', 'cpm', 'roas',
        'reach', 'frequency', 'video_views', 'video_view_rate', 'cost_per_video_view',
        'link_clicks', 'cost_per_link_click', 'landing_page_views', 'cost_per_landing_page_view',
        'add_to_cart', 'cost_per_add_to_cart', 'purchases', 'cost_per_purchase'
      ].join(',');

      const response = await axios.get(`${this.baseUrl}/${campaignId}/insights`, {
        params: {
          fields,
          time_range: JSON.stringify(range),
          level: 'campaign',
          breakdowns: 'age,gender,country,region,city,interest,device_platform',
          access_token: this.accessToken
        }
      });

      const insights = response.data.data[0] || {};
      
      return {
        campaignId,
        metrics: {
          impressions: parseInt(insights.impressions || '0'),
          clicks: parseInt(insights.clicks || '0'),
          spend: parseFloat(insights.spend || '0'),
          conversions: parseInt(insights.conversions || '0'),
          ctr: parseFloat(insights.ctr || '0'),
          cpc: parseFloat(insights.cpc || '0'),
          cpm: parseFloat(insights.cpm || '0'),
          roas: parseFloat(insights.roas || '0'),
          reach: parseInt(insights.reach || '0'),
          frequency: parseFloat(insights.frequency || '0'),
          videoViews: parseInt(insights.video_views || '0'),
          videoViewRate: parseFloat(insights.video_view_rate || '0'),
          costPerVideoView: parseFloat(insights.cost_per_video_view || '0'),
          linkClicks: parseInt(insights.link_clicks || '0'),
          costPerLinkClick: parseFloat(insights.cost_per_link_click || '0'),
          landingPageViews: parseInt(insights.landing_page_views || '0'),
          costPerLandingPageView: parseFloat(insights.cost_per_landing_page_view || '0'),
          addToCart: parseInt(insights.add_to_cart || '0'),
          costPerAddToCart: parseFloat(insights.cost_per_add_to_cart || '0'),
          purchases: parseInt(insights.purchases || '0'),
          costPerPurchase: parseFloat(insights.cost_per_purchase || '0'),
          date: range.end
        },
        recommendations: this.generateRecommendations(insights)
      };
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      throw new Error('Failed to fetch campaign insights');
    }
  }

  // Get campaign trends over time
  async getCampaignTrends(campaignId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<MetaAdsInsights['trends']> {
    try {
      const dateRange = this.getDateRangeForPeriod(period);
      
      const response = await axios.get(`${this.baseUrl}/${campaignId}/insights`, {
        params: {
          fields: 'impressions,clicks,spend,conversions,ctr,cpc,cpm,roas',
          time_range: JSON.stringify(dateRange),
          level: 'campaign',
          time_increment: period === 'daily' ? '1' : period === 'weekly' ? '7' : '30',
          access_token: this.accessToken
        }
      });

      const trends = response.data.data.map((item: any) => ({
        date: item.date_start,
        metrics: {
          impressions: parseInt(item.impressions || '0'),
          clicks: parseInt(item.clicks || '0'),
          spend: parseFloat(item.spend || '0'),
          conversions: parseInt(item.conversions || '0'),
          ctr: parseFloat(item.ctr || '0'),
          cpc: parseFloat(item.cpc || '0'),
          cpm: parseFloat(item.cpm || '0'),
          roas: parseFloat(item.roas || '0'),
          date: item.date_start
        }
      }));

      return { [period]: trends };
    } catch (error) {
      console.error('Error fetching campaign trends:', error);
      throw new Error('Failed to fetch campaign trends');
    }
  }

  // Generate AI-powered recommendations
  private generateRecommendations(metrics: any): MetaAdsInsights['recommendations'] {
    const recommendations: MetaAdsInsights['recommendations'] = [];

    const impressions = parseInt(metrics.impressions || '0');
    const clicks = parseInt(metrics.clicks || '0');
    const spend = parseFloat(metrics.spend || '0');
    const conversions = parseInt(metrics.conversions || '0');
    const ctr = parseFloat(metrics.ctr || '0');
    const cpc = parseFloat(metrics.cpc || '0');
    const cpm = parseFloat(metrics.cpm || '0');

    // CTR optimization
    if (ctr < 1.0) {
      recommendations.push({
        type: 'creative',
        priority: 'high',
        title: 'Improve Click-Through Rate',
        description: `Your CTR of ${ctr.toFixed(2)}% is below industry average. Consider updating your ad creative.`,
        impact: 'High - Better CTR leads to more traffic and lower costs',
        action: 'A/B test new ad creatives with compelling headlines and visuals'
      });
    }

    // Cost optimization
    if (cpc > 2.0) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        title: 'Reduce Cost Per Click',
        description: `Your CPC of $${cpc.toFixed(2)} is high. Consider optimizing your targeting.`,
        impact: 'High - Lower CPC means more clicks for the same budget',
        action: 'Refine targeting to reach more qualified audiences'
      });
    }

    // Budget optimization
    if (spend > 0 && conversions === 0) {
      recommendations.push({
        type: 'budget',
        priority: 'medium',
        title: 'Optimize Budget Allocation',
        description: 'No conversions detected despite spending. Consider adjusting budget or targeting.',
        impact: 'Medium - Better budget allocation can improve ROI',
        action: 'Review targeting criteria and consider increasing budget for better reach'
      });
    }

    // Reach optimization
    if (impressions < 1000) {
      recommendations.push({
        type: 'targeting',
        priority: 'medium',
        title: 'Increase Reach',
        description: 'Low impression count suggests narrow targeting. Consider expanding audience.',
        impact: 'Medium - More reach can lead to more conversions',
        action: 'Broaden targeting criteria or increase budget'
      });
    }

    return recommendations;
  }

  // Get date range for different periods
  private getDateRangeForPeriod(period: 'daily' | 'weekly' | 'monthly'): { start: string; end: string } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'daily':
        start.setDate(end.getDate() - 7); // Last 7 days
        break;
      case 'weekly':
        start.setDate(end.getDate() - 30); // Last 30 days
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 6); // Last 6 months
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  // Get account-level insights
  async getAccountInsights(): Promise<MetaAdsInsights> {
    try {
      const response = await axios.get(`${this.baseUrl}/act_${process.env.META_ADS_ACCOUNT_ID}/insights`, {
        params: {
          fields: 'impressions,clicks,spend,conversions,ctr,cpc,cpm,roas,reach,frequency',
          time_range: JSON.stringify({
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }),
          level: 'account',
          access_token: this.accessToken
        }
      });

      const insights = response.data.data[0] || {};
      
      return {
        campaignId: 'account',
        metrics: {
          impressions: parseInt(insights.impressions || '0'),
          clicks: parseInt(insights.clicks || '0'),
          spend: parseFloat(insights.spend || '0'),
          conversions: parseInt(insights.conversions || '0'),
          ctr: parseFloat(insights.ctr || '0'),
          cpc: parseFloat(insights.cpc || '0'),
          cpm: parseFloat(insights.cpm || '0'),
          roas: parseFloat(insights.roas || '0'),
          reach: parseInt(insights.reach || '0'),
          frequency: parseFloat(insights.frequency || '0'),
          date: new Date().toISOString().split('T')[0]
        }
      };
    } catch (error) {
      console.error('Error fetching account insights:', error);
      throw new Error('Failed to fetch account insights');
    }
  }
}
