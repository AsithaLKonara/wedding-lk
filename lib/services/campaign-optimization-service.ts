import { MetaAdsService, MetaAdsInsights } from './meta-ads-service';
import { MetaAdsCampaign } from '@/lib/models/metaAds';

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  condition: (metrics: any) => boolean;
  action: (campaignId: string, metaAdsService: MetaAdsService) => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
}

export interface OptimizationResult {
  campaignId: string;
  appliedRules: Array<{
    ruleId: string;
    ruleName: string;
    action: string;
    impact: string;
  }>;
  metrics: {
    before: any;
    after: any;
  };
  timestamp: string;
}

export class CampaignOptimizationService {
  private optimizationRules: OptimizationRule[] = [];

  constructor() {
    this.initializeOptimizationRules();
  }

  private initializeOptimizationRules() {
    this.optimizationRules = [
      // CTR Optimization Rules
      {
        id: 'low_ctr_optimization',
        name: 'Low CTR Optimization',
        description: 'Optimize campaigns with CTR below 1%',
        condition: (metrics) => metrics.ctr < 1.0,
        action: async (campaignId, metaAdsService) => {
          // Pause low-performing ad sets and create new ones with different creatives
          console.log(`Optimizing campaign ${campaignId} for low CTR`);
          // Implementation would pause low-performing ad sets and create new ones
        },
        priority: 'high',
        enabled: true
      },

      // CPC Optimization Rules
      {
        id: 'high_cpc_optimization',
        name: 'High CPC Optimization',
        description: 'Optimize campaigns with CPC above $2.00',
        condition: (metrics) => metrics.cpc > 2.0,
        action: async (campaignId, metaAdsService) => {
          // Refine targeting to reduce CPC
          console.log(`Optimizing campaign ${campaignId} for high CPC`);
          // Implementation would refine targeting criteria
        },
        priority: 'high',
        enabled: true
      },

      // Budget Optimization Rules
      {
        id: 'budget_reallocation',
        name: 'Budget Reallocation',
        description: 'Reallocate budget from low-performing to high-performing campaigns',
        condition: (metrics) => metrics.spend > 100 && metrics.conversions === 0,
        action: async (campaignId, metaAdsService) => {
          // Reduce budget for campaigns with no conversions
          console.log(`Reallocating budget for campaign ${campaignId}`);
          // Implementation would reduce budget and reallocate to better performers
        },
        priority: 'medium',
        enabled: true
      },

      // Reach Optimization Rules
      {
        id: 'low_reach_optimization',
        name: 'Low Reach Optimization',
        description: 'Optimize campaigns with low reach',
        condition: (metrics) => metrics.reach < 1000,
        action: async (campaignId, metaAdsService) => {
          // Broaden targeting to increase reach
          console.log(`Optimizing campaign ${campaignId} for low reach`);
          // Implementation would broaden targeting criteria
        },
        priority: 'medium',
        enabled: true
      },

      // Frequency Optimization Rules
      {
        id: 'high_frequency_optimization',
        name: 'High Frequency Optimization',
        description: 'Optimize campaigns with high frequency (above 3)',
        condition: (metrics) => metrics.frequency > 3,
        action: async (campaignId, metaAdsService) => {
          // Increase audience size to reduce frequency
          console.log(`Optimizing campaign ${campaignId} for high frequency`);
          // Implementation would expand audience or create lookalike audiences
        },
        priority: 'medium',
        enabled: true
      },

      // ROAS Optimization Rules
      {
        id: 'low_roas_optimization',
        name: 'Low ROAS Optimization',
        description: 'Optimize campaigns with ROAS below 2.0',
        condition: (metrics) => metrics.roas < 2.0,
        action: async (campaignId, metaAdsService) => {
          // Optimize for better ROAS
          console.log(`Optimizing campaign ${campaignId} for low ROAS`);
          // Implementation would adjust bidding strategy and targeting
        },
        priority: 'high',
        enabled: true
      }
    ];
  }

  // Analyze campaign and apply optimization rules
  async optimizeCampaign(
    campaignId: string, 
    metaAdsService: MetaAdsService,
    insights: MetaAdsInsights
  ): Promise<OptimizationResult> {
    const appliedRules: OptimizationResult['appliedRules'] = [];
    const beforeMetrics = { ...insights.metrics };

    // Apply enabled optimization rules
    for (const rule of this.optimizationRules) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(insights.metrics)) {
          await rule.action(campaignId, metaAdsService);
          
          appliedRules.push({
            ruleId: rule.id,
            ruleName: rule.name,
            action: rule.description,
            impact: this.calculateImpact(rule, insights.metrics)
          });
        }
      } catch (error) {
        console.error(`Error applying optimization rule ${rule.id}:`, error);
      }
    }

    // Get updated metrics after optimization
    const updatedInsights = await metaAdsService.getCampaignInsights(campaignId);
    const afterMetrics = updatedInsights.metrics;

    return {
      campaignId,
      appliedRules,
      metrics: {
        before: beforeMetrics,
        after: afterMetrics
      },
      timestamp: new Date().toISOString()
    };
  }

  // Calculate the potential impact of an optimization rule
  private calculateImpact(rule: OptimizationRule, metrics: any): string {
    switch (rule.id) {
      case 'low_ctr_optimization':
        return `Expected CTR improvement: ${((1.5 - metrics.ctr) * 100).toFixed(1)}%`;
      case 'high_cpc_optimization':
        return `Expected CPC reduction: $${((metrics.cpc - 1.5) * 0.3).toFixed(2)}`;
      case 'budget_reallocation':
        return `Expected conversion increase: ${Math.round(metrics.spend * 0.05)} more conversions`;
      case 'low_reach_optimization':
        return `Expected reach increase: ${Math.round(metrics.reach * 2)} more people`;
      case 'high_frequency_optimization':
        return `Expected frequency reduction: ${(metrics.frequency * 0.5).toFixed(1)}`;
      case 'low_roas_optimization':
        return `Expected ROAS improvement: ${(2.5 - metrics.roas).toFixed(1)}x`;
      default:
        return 'Performance improvement expected';
    }
  }

  // Get optimization recommendations for a campaign
  async getOptimizationRecommendations(
    campaignId: string,
    metaAdsService: MetaAdsService
  ): Promise<Array<{
    ruleId: string;
    ruleName: string;
    description: string;
    priority: string;
    impact: string;
    action: string;
  }>> {
    const insights = await metaAdsService.getCampaignInsights(campaignId);
    const recommendations = [];

    for (const rule of this.optimizationRules) {
      if (!rule.enabled) continue;

      if (rule.condition(insights.metrics)) {
        recommendations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          description: rule.description,
          priority: rule.priority,
          impact: this.calculateImpact(rule, insights.metrics),
          action: this.getActionDescription(rule)
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  }

  private getActionDescription(rule: OptimizationRule): string {
    switch (rule.id) {
      case 'low_ctr_optimization':
        return 'Update ad creatives with more compelling headlines and visuals';
      case 'high_cpc_optimization':
        return 'Refine targeting to reach more qualified audiences';
      case 'budget_reallocation':
        return 'Reduce budget and reallocate to higher-performing campaigns';
      case 'low_reach_optimization':
        return 'Broaden targeting criteria or increase budget';
      case 'high_frequency_optimization':
        return 'Expand audience size or create lookalike audiences';
      case 'low_roas_optimization':
        return 'Adjust bidding strategy and optimize for conversions';
      default:
        return 'Apply optimization rule';
    }
  }

  // Enable/disable optimization rules
  toggleRule(ruleId: string, enabled: boolean): void {
    const rule = this.optimizationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  // Get all optimization rules
  getOptimizationRules(): OptimizationRule[] {
    return this.optimizationRules;
  }

  // Add custom optimization rule
  addCustomRule(rule: OptimizationRule): void {
    this.optimizationRules.push(rule);
  }

  // Remove optimization rule
  removeRule(ruleId: string): void {
    this.optimizationRules = this.optimizationRules.filter(r => r.id !== ruleId);
  }

  // Batch optimize multiple campaigns
  async batchOptimizeCampaigns(
    campaignIds: string[],
    metaAdsService: MetaAdsService
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];

    for (const campaignId of campaignIds) {
      try {
        const insights = await metaAdsService.getCampaignInsights(campaignId);
        const result = await this.optimizeCampaign(campaignId, metaAdsService, insights);
        results.push(result);
      } catch (error) {
        console.error(`Error optimizing campaign ${campaignId}:`, error);
      }
    }

    return results;
  }

  // Get optimization summary
  async getOptimizationSummary(
    campaignIds: string[],
    metaAdsService: MetaAdsService
  ): Promise<{
    totalCampaigns: number;
    optimizedCampaigns: number;
    totalRulesApplied: number;
    averageImprovement: {
      ctr: number;
      cpc: number;
      roas: number;
    };
  }> {
    const results = await this.batchOptimizeCampaigns(campaignIds, metaAdsService);
    
    let totalRulesApplied = 0;
    let ctrImprovements = 0;
    let cpcImprovements = 0;
    let roasImprovements = 0;
    let improvementCount = 0;

    results.forEach(result => {
      totalRulesApplied += result.appliedRules.length;
      
      if (result.appliedRules.length > 0) {
        const ctrDiff = result.metrics.after.ctr - result.metrics.before.ctr;
        const cpcDiff = result.metrics.before.cpc - result.metrics.after.cpc;
        const roasDiff = result.metrics.after.roas - result.metrics.before.roas;
        
        ctrImprovements += ctrDiff;
        cpcImprovements += cpcDiff;
        roasImprovements += roasDiff;
        improvementCount++;
      }
    });

    return {
      totalCampaigns: campaignIds.length,
      optimizedCampaigns: results.filter(r => r.appliedRules.length > 0).length,
      totalRulesApplied,
      averageImprovement: {
        ctr: improvementCount > 0 ? ctrImprovements / improvementCount : 0,
        cpc: improvementCount > 0 ? cpcImprovements / improvementCount : 0,
        roas: improvementCount > 0 ? roasImprovements / improvementCount : 0
      }
    };
  }
}
