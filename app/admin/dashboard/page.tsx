import React from 'react';
import { Metadata } from 'next';
import { PerformanceMonitoringDashboard } from '@/components/organisms/performance-monitoring-dashboard';
import { MetaAdsAnalyticsDashboard } from '@/components/organisms/meta-ads-analytics-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Target, 
  DollarSign, 
  Server, 
  TrendingUp, 
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard - WeddingLK',
  description: 'Comprehensive monitoring and analytics dashboard for WeddingLK administrators',
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor performance, optimize campaigns, and track business metrics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-lg font-semibold text-green-600">Healthy</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-green-600">+2 this week</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$24,580</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-xs text-green-600">+8% this week</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="scaling" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Scaling
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <PerformanceMonitoringDashboard />
          </TabsContent>

          <TabsContent value="campaigns">
            <MetaAdsAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Analytics
                </CardTitle>
                <CardDescription>
                  Track payment success rates, revenue trends, and conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive payment analytics and conversion tracking will be available here.
                  </p>
                  <p className="text-sm text-gray-500">
                    Features: Revenue trends, payment success rates, conversion metrics, refund analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scaling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Infrastructure Scaling
                </CardTitle>
                <CardDescription>
                  Monitor resource utilization and get scaling recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Scaling Monitor</h3>
                  <p className="text-gray-600 mb-4">
                    Real-time infrastructure monitoring and automated scaling recommendations.
                  </p>
                  <p className="text-sm text-gray-500">
                    Features: CPU/Memory monitoring, auto-scaling, capacity planning, performance alerts
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Recent system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">System Performance Optimal</p>
                    <p className="text-sm text-green-700">All systems running smoothly</p>
                  </div>
                  <span className="text-xs text-green-600 ml-auto">2 min ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">High Memory Usage</p>
                    <p className="text-sm text-yellow-700">Memory usage at 85% - consider scaling</p>
                  </div>
                  <span className="text-xs text-yellow-600 ml-auto">15 min ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Campaign Performance Improved</p>
                    <p className="text-sm text-blue-700">ROAS increased by 15% after optimization</p>
                  </div>
                  <span className="text-xs text-blue-600 ml-auto">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
