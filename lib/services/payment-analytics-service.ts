import { connectDB } from '@/lib/db';
import { Payment } from '@/lib/models/Payment';
import { MetaAdsCampaign } from '@/lib/models/metaAds';

export interface PaymentAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  conversionRate: number;
  refundRate: number;
  paymentMethodBreakdown: Array<{
    method: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  revenueByType: Array<{
    type: string;
    revenue: number;
    transactions: number;
    percentage: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    transactions: number;
    successRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    transactions: number;
    growth: number;
  }>;
}

export interface ConversionMetrics {
  campaignId: string;
  campaignName: string;
  totalSpent: number;
  totalRevenue: number;
  conversions: number;
  roas: number;
  costPerConversion: number;
  conversionRate: number;
  revenuePerConversion: number;
}

export interface PaymentInsights {
  topPerformingCampaigns: ConversionMetrics[];
  paymentTrends: {
    weeklyGrowth: number;
    monthlyGrowth: number;
    seasonalPatterns: string[];
  };
  recommendations: Array<{
    type: 'optimization' | 'budget' | 'targeting' | 'payment';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    action: string;
  }>;
  riskFactors: Array<{
    type: 'high_refund_rate' | 'low_conversion' | 'payment_failures' | 'fraud_risk';
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
}

export class PaymentAnalyticsService {
  // Get comprehensive payment analytics
  async getPaymentAnalytics(
    vendorId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<PaymentAnalytics> {
    try {
      await connectDB();

      const defaultDateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
      };

      const range = dateRange || defaultDateRange;

      // Build query
      const query: any = {
        createdAt: { $gte: range.start, $lte: range.end }
      };

      if (vendorId) {
        query.$or = [
          { userId: vendorId },
          { user: vendorId }
        ];
      }

      // Get all payments in date range
      const payments = await Payment.find(query).sort({ createdAt: -1 });

      // Calculate basic metrics
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalTransactions = payments.length;
      const successfulTransactions = payments.filter(p => p.status === 'completed').length;
      const refundedTransactions = payments.filter(p => p.status === 'refunded').length;

      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
      const refundRate = totalTransactions > 0 ? (refundedTransactions / totalTransactions) * 100 : 0;
      const averageTransactionValue = successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0;

      // Payment method breakdown
      const methodStats = this.calculatePaymentMethodBreakdown(payments);
      
      // Revenue by type
      const typeStats = this.calculateRevenueByType(payments);
      
      // Daily revenue
      const dailyRevenue = this.calculateDailyRevenue(payments);
      
      // Monthly trends
      const monthlyTrends = this.calculateMonthlyTrends(payments);

      return {
        totalRevenue,
        totalTransactions,
        successRate,
        averageTransactionValue,
        conversionRate: successRate, // Same as success rate for now
        refundRate,
        paymentMethodBreakdown: methodStats,
        revenueByType: typeStats,
        dailyRevenue,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw new Error('Failed to fetch payment analytics');
    }
  }

  // Get conversion metrics for campaigns
  async getConversionMetrics(
    vendorId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<ConversionMetrics[]> {
    try {
      await connectDB();

      const defaultDateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      };

      const range = dateRange || defaultDateRange;

      // Get campaigns with payments
      const campaigns = await MetaAdsCampaign.find({
        vendorId: vendorId || { $exists: true },
        createdAt: { $gte: range.start, $lte: range.end }
      });

      const conversionMetrics: ConversionMetrics[] = [];

      for (const campaign of campaigns) {
        // Get payments for this campaign
        const campaignPayments = await Payment.find({
          $or: [
            { userId: campaign.vendorId },
            { user: campaign.vendorId }
          ],
          'metadata.campaignId': campaign._id.toString(),
          status: 'completed',
          createdAt: { $gte: range.start, $lte: range.end }
        });

        const totalSpent = campaign.budget || 0;
        const totalRevenue = campaignPayments.reduce((sum, p) => sum + p.amount, 0);
        const conversions = campaignPayments.length;
        const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;
        const costPerConversion = conversions > 0 ? totalSpent / conversions : 0;
        const conversionRate = totalSpent > 0 ? (conversions / (totalSpent / 50)) * 100 : 0; // Assuming $50 average order value
        const revenuePerConversion = conversions > 0 ? totalRevenue / conversions : 0;

        conversionMetrics.push({
          campaignId: campaign._id.toString(),
          campaignName: campaign.name,
          totalSpent,
          totalRevenue,
          conversions,
          roas,
          costPerConversion,
          conversionRate,
          revenuePerConversion
        });
      }

      return conversionMetrics.sort((a, b) => b.roas - a.roas);
    } catch (error) {
      console.error('Error fetching conversion metrics:', error);
      throw new Error('Failed to fetch conversion metrics');
    }
  }

  // Get payment insights and recommendations
  async getPaymentInsights(
    vendorId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<PaymentInsights> {
    try {
      const analytics = await this.getPaymentAnalytics(vendorId, dateRange);
      const conversionMetrics = await this.getConversionMetrics(vendorId, dateRange);

      // Top performing campaigns
      const topPerformingCampaigns = conversionMetrics.slice(0, 5);

      // Calculate trends
      const weeklyGrowth = this.calculateWeeklyGrowth(analytics.dailyRevenue);
      const monthlyGrowth = this.calculateMonthlyGrowth(analytics.monthlyTrends);
      const seasonalPatterns = this.identifySeasonalPatterns(analytics.dailyRevenue);

      // Generate recommendations
      const recommendations = this.generateRecommendations(analytics, conversionMetrics);

      // Identify risk factors
      const riskFactors = this.identifyRiskFactors(analytics, conversionMetrics);

      return {
        topPerformingCampaigns,
        paymentTrends: {
          weeklyGrowth,
          monthlyGrowth,
          seasonalPatterns
        },
        recommendations,
        riskFactors
      };
    } catch (error) {
      console.error('Error fetching payment insights:', error);
      throw new Error('Failed to fetch payment insights');
    }
  }

  // Helper methods
  private calculatePaymentMethodBreakdown(payments: any[]) {
    const methodStats: { [key: string]: { count: number; revenue: number } } = {};

    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const method = payment.paymentMethod || 'unknown';
        if (!methodStats[method]) {
          methodStats[method] = { count: 0, revenue: 0 };
        }
        methodStats[method].count++;
        methodStats[method].revenue += payment.amount;
      }
    });

    const totalRevenue = Object.values(methodStats).reduce((sum, stat) => sum + stat.revenue, 0);

    return Object.entries(methodStats).map(([method, stats]) => ({
      method,
      count: stats.count,
      revenue: stats.revenue,
      percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
    }));
  }

  private calculateRevenueByType(payments: any[]) {
    const typeStats: { [key: string]: { revenue: number; transactions: number } } = {};

    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const type = payment.type || 'booking';
        if (!typeStats[type]) {
          typeStats[type] = { revenue: 0, transactions: 0 };
        }
        typeStats[type].revenue += payment.amount;
        typeStats[type].transactions++;
      }
    });

    const totalRevenue = Object.values(typeStats).reduce((sum, stat) => sum + stat.revenue, 0);

    return Object.entries(typeStats).map(([type, stats]) => ({
      type,
      revenue: stats.revenue,
      transactions: stats.transactions,
      percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
    }));
  }

  private calculateDailyRevenue(payments: any[]) {
    const dailyStats: { [key: string]: { revenue: number; transactions: number; successful: number } } = {};

    payments.forEach(payment => {
      const date = payment.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { revenue: 0, transactions: 0, successful: 0 };
      }
      dailyStats[date].transactions++;
      if (payment.status === 'completed') {
        dailyStats[date].revenue += payment.amount;
        dailyStats[date].successful++;
      }
    });

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      revenue: stats.revenue,
      transactions: stats.transactions,
      successRate: stats.transactions > 0 ? (stats.successful / stats.transactions) * 100 : 0
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateMonthlyTrends(payments: any[]) {
    const monthlyStats: { [key: string]: { revenue: number; transactions: number } } = {};

    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const month = payment.createdAt.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyStats[month]) {
          monthlyStats[month] = { revenue: 0, transactions: 0 };
        }
        monthlyStats[month].revenue += payment.amount;
        monthlyStats[month].transactions++;
      }
    });

    const sortedMonths = Object.keys(monthlyStats).sort();
    
    return sortedMonths.map((month, index) => {
      const currentStats = monthlyStats[month];
      const previousStats = index > 0 ? monthlyStats[sortedMonths[index - 1]] : null;
      
      const growth = previousStats && previousStats.revenue > 0 
        ? ((currentStats.revenue - previousStats.revenue) / previousStats.revenue) * 100 
        : 0;

      return {
        month,
        revenue: currentStats.revenue,
        transactions: currentStats.transactions,
        growth
      };
    });
  }

  private calculateWeeklyGrowth(dailyRevenue: any[]) {
    if (dailyRevenue.length < 14) return 0;
    
    const lastWeek = dailyRevenue.slice(-7);
    const previousWeek = dailyRevenue.slice(-14, -7);
    
    const lastWeekRevenue = lastWeek.reduce((sum, day) => sum + day.revenue, 0);
    const previousWeekRevenue = previousWeek.reduce((sum, day) => sum + day.revenue, 0);
    
    return previousWeekRevenue > 0 ? ((lastWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 : 0;
  }

  private calculateMonthlyGrowth(monthlyTrends: any[]) {
    if (monthlyTrends.length < 2) return 0;
    
    const lastMonth = monthlyTrends[monthlyTrends.length - 1];
    const previousMonth = monthlyTrends[monthlyTrends.length - 2];
    
    return lastMonth.growth;
  }

  private identifySeasonalPatterns(dailyRevenue: any[]) {
    const patterns: string[] = [];
    
    // Simple pattern detection
    const weekendRevenue = dailyRevenue.filter((_, index) => index % 7 >= 5);
    const weekdayRevenue = dailyRevenue.filter((_, index) => index % 7 < 5);
    
    const avgWeekendRevenue = weekendRevenue.reduce((sum, day) => sum + day.revenue, 0) / weekendRevenue.length;
    const avgWeekdayRevenue = weekdayRevenue.reduce((sum, day) => sum + day.revenue, 0) / weekdayRevenue.length;
    
    if (avgWeekendRevenue > avgWeekdayRevenue * 1.2) {
      patterns.push('Higher weekend revenue');
    }
    
    return patterns;
  }

  private generateRecommendations(analytics: PaymentAnalytics, conversionMetrics: ConversionMetrics[]) {
    const recommendations: PaymentInsights['recommendations'] = [];

    // Low success rate recommendation
    if (analytics.successRate < 90) {
      recommendations.push({
        type: 'payment',
        priority: 'high',
        title: 'Improve Payment Success Rate',
        description: `Your payment success rate is ${analytics.successRate.toFixed(1)}%, below the industry average of 95%.`,
        impact: 'High - More successful payments mean more revenue',
        action: 'Review payment gateway configuration and add alternative payment methods'
      });
    }

    // High refund rate recommendation
    if (analytics.refundRate > 5) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        title: 'Reduce Refund Rate',
        description: `Your refund rate is ${analytics.refundRate.toFixed(1)}%, above the industry average of 3%.`,
        impact: 'High - Lower refunds improve profitability',
        action: 'Improve product descriptions and customer service to reduce refunds'
      });
    }

    // Low ROAS recommendation
    const avgRoas = conversionMetrics.reduce((sum, c) => sum + c.roas, 0) / conversionMetrics.length;
    if (avgRoas < 2.0) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: 'Improve Return on Ad Spend',
        description: `Your average ROAS is ${avgRoas.toFixed(1)}x, below the target of 4.0x.`,
        impact: 'Medium - Better ROAS means more profitable campaigns',
        action: 'Optimize targeting and bidding strategies to improve ROAS'
      });
    }

    return recommendations;
  }

  private identifyRiskFactors(analytics: PaymentAnalytics, conversionMetrics: ConversionMetrics[]) {
    const riskFactors: PaymentInsights['riskFactors'] = [];

    // High refund rate risk
    if (analytics.refundRate > 10) {
      riskFactors.push({
        type: 'high_refund_rate',
        severity: 'high',
        description: `Refund rate of ${analytics.refundRate.toFixed(1)}% indicates potential issues`,
        recommendation: 'Investigate refund causes and improve product quality'
      });
    }

    // Low conversion risk
    const avgConversionRate = conversionMetrics.reduce((sum, c) => sum + c.conversionRate, 0) / conversionMetrics.length;
    if (avgConversionRate < 1.0) {
      riskFactors.push({
        type: 'low_conversion',
        severity: 'medium',
        description: `Low conversion rate of ${avgConversionRate.toFixed(1)}%`,
        recommendation: 'Optimize landing pages and ad targeting'
      });
    }

    // Payment failure risk
    if (analytics.successRate < 85) {
      riskFactors.push({
        type: 'payment_failures',
        severity: 'high',
        description: `High payment failure rate of ${(100 - analytics.successRate).toFixed(1)}%`,
        recommendation: 'Review payment gateway configuration and add backup payment methods'
      });
    }

    return riskFactors;
  }
}
