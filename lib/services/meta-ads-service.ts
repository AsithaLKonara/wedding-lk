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
  date: string;
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
}
