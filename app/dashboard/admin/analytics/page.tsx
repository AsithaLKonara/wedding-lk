'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsMetrics {
  totalUsers: number;
  totalVendors: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  monthlyGrowth: {
    users: number;
    vendors: number;
    bookings: number;
    revenue: number;
  };
}

interface RealTimeData {
  activeUsers: number;
  recentBookings: number;
  pendingPayments: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [metricsRes, realTimeRes, chartRes] = await Promise.all([
        fetch('/api/analytics?type=overview'),
        fetch('/api/analytics?type=realtime'),
        fetch(`/api/analytics?type=charts&timeRange=${timeRange}`)
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data);
      }

      if (realTimeRes.ok) {
        const realTimeData = await realTimeRes.json();
        setRealTimeData(realTimeData.data);
      }

      if (chartRes.ok) {
        const chartData = await chartRes.json();
        setChartData(chartData.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getSystemHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your platform performance and user activity</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalUsers.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(metrics?.monthlyGrowth.users || 0)}
                  <span className={getGrowthColor(metrics?.monthlyGrowth.users || 0)}>
                    {Math.abs(metrics?.monthlyGrowth.users || 0).toFixed(1)}%
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalVendors.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(metrics?.monthlyGrowth.vendors || 0)}
                  <span className={getGrowthColor(metrics?.monthlyGrowth.vendors || 0)}>
                    {Math.abs(metrics?.monthlyGrowth.vendors || 0).toFixed(1)}%
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalBookings.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(metrics?.monthlyGrowth.bookings || 0)}
                  <span className={getGrowthColor(metrics?.monthlyGrowth.bookings || 0)}>
                    {Math.abs(metrics?.monthlyGrowth.bookings || 0).toFixed(1)}%
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  LKR {metrics?.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(metrics?.monthlyGrowth.revenue || 0)}
                  <span className={getGrowthColor(metrics?.monthlyGrowth.revenue || 0)}>
                    {Math.abs(metrics?.monthlyGrowth.revenue || 0).toFixed(1)}%
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Rating</CardTitle>
                <CardDescription>Overall platform rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{metrics?.averageRating}</span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                <CardDescription>Users to bookings conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.conversionRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Venues</CardTitle>
                <CardDescription>Available venues on platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalVenues.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeData?.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Last hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Bookings</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeData?.recentBookings}</div>
                <p className="text-xs text-muted-foreground">Last hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeData?.pendingPayments}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                {getSystemHealthIcon(realTimeData?.systemHealth || 'healthy')}
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={realTimeData?.systemHealth === 'healthy' ? 'default' : 'destructive'}
                    className={getSystemHealthColor(realTimeData?.systemHealth || 'healthy')}
                  >
                    {realTimeData?.systemHealth || 'healthy'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Charts</CardTitle>
              <CardDescription>Visual representation of platform data</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData ? (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would be implemented here</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Data available: {chartData.labels.length} data points
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and optimization insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Database Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Query Response Time</span>
                      <Badge variant="default">45ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection Pool</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate</span>
                      <Badge variant="default">87%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">API Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <Badge variant="default">120ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <Badge variant="default">99.2%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <Badge variant="destructive">0.8%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


