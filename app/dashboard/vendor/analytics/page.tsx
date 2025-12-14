'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Building2,
  Users,
  Eye,
  MessageSquare,
  Award,
  Target
} from 'lucide-react';

interface VendorAnalytics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  topVenues: Array<{ name: string; bookings: number; revenue: number }>;
  recentReviews: Array<{ rating: number; comment: string; date: Date }>;
}

export default function VendorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchVendorAnalytics();
  }, [timeRange]);

  const fetchVendorAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/vendor');
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vendor analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthIcon = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthColor = (current: number, previous: number) => {
    const growth = getGrowthPercentage(current, previous);
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
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
          <h1 className="text-3xl font-bold">Vendor Analytics</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
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
          <Button onClick={fetchVendorAnalytics} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalBookings.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(analytics?.monthlyBookings || 0, (analytics?.totalBookings || 0) - (analytics?.monthlyBookings || 0))}
                  <span className={getGrowthColor(analytics?.monthlyBookings || 0, (analytics?.totalBookings || 0) - (analytics?.monthlyBookings || 0))}>
                    {Math.abs(getGrowthPercentage(analytics?.monthlyBookings || 0, (analytics?.totalBookings || 0) - (analytics?.monthlyBookings || 0))).toFixed(1)}%
                  </span>
                  <span>this month</span>
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
                  LKR {analytics?.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getGrowthIcon(analytics?.monthlyRevenue || 0, (analytics?.totalRevenue || 0) - (analytics?.monthlyRevenue || 0))}
                  <span className={getGrowthColor(analytics?.monthlyRevenue || 0, (analytics?.totalRevenue || 0) - (analytics?.monthlyRevenue || 0))}>
                    {Math.abs(getGrowthPercentage(analytics?.monthlyRevenue || 0, (analytics?.totalRevenue || 0) - (analytics?.monthlyRevenue || 0))).toFixed(1)}%
                  </span>
                  <span>this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold ${getRatingColor(analytics?.averageRating || 0)}`}>
                    {analytics?.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>Based on {analytics?.recentReviews.length || 0} reviews</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.monthlyBookings.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>Current month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                <CardDescription>Revenue generated this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  LKR {analytics?.monthlyRevenue.toLocaleString()}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Target</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
                <CardDescription>Based on recent reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics?.averageRating.toFixed(1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Rating</span>
                      <span>{Math.round((analytics?.averageRating || 0) * 20)}%</span>
                    </div>
                    <Progress value={(analytics?.averageRating || 0) * 20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution across your venues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topVenues.map((venue, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{venue.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">LKR {venue.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{venue.bookings} bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue chart would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.recentReviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="font-semibold">{review.rating}/5</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Venues</CardTitle>
              <CardDescription>Your best performing venues by bookings and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topVenues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{venue.name}</h3>
                        <p className="text-sm text-gray-500">{venue.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        LKR {venue.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


