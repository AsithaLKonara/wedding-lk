'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, Users, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardData {
  overview: {
    health: {
      status: string;
      errorRate: number;
      averageResponseTime: number;
      uptime: number;
    };
    totalUsers: number;
    totalBookings: number;
    totalVendors: number;
    totalVenues: number;
    totalRevenue: number;
    conversionRate: number;
    averageBookingValue: number;
  };
  api: {
    totalRequests: number;
    errorCount: number;
    successRate: number;
    averageResponseTime: number;
    endpointStats: Array<{
      endpoint: string;
      method: string;
      count: number;
      errors: number;
      averageResponseTime: number;
    }>;
    recentErrors: Array<{
      timestamp: string;
      endpoint: string;
      method: string;
      statusCode: number;
      error: string;
    }>;
  };
  business: {
    totalUsers: number;
    activeUsers: number;
    totalBookings: number;
    totalRevenue: number;
    conversionRate: number;
    averageBookingValue: number;
    trends: {
      users: Array<{ timestamp: string; value: number }>;
      bookings: Array<{ timestamp: string; value: number }>;
      revenue: Array<{ timestamp: string; value: number }>;
    };
  };
  lastUpdated: string;
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(24);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/monitoring/dashboard?hours=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchDashboardData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time platform health and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={1}>Last Hour</option>
            <option value={24}>Last 24 Hours</option>
            <option value={168}>Last Week</option>
          </select>
          <Button onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getHealthStatusIcon(data.overview.health.status)}
            <span className="ml-2">System Health</span>
            <Badge className={`ml-2 ${getHealthStatusColor(data.overview.health.status)}`}>
              {data.overview.health.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.overview.health.errorRate}%
              </div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.overview.health.averageResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatUptime(data.overview.health.uptime)}
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.api.successRate}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.business.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {data.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: LKR {data.overview.averageBookingValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors & Venues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.totalVenues} venues available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>API Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.api.totalRequests.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.api.errorCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.api.averageResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>

          {/* Top Endpoints */}
          <div>
            <h4 className="font-semibold mb-3">Top Endpoints</h4>
            <div className="space-y-2">
              {data.api.endpointStats.slice(0, 5).map((endpoint, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{endpoint.method}</span>
                    <span className="ml-2 text-gray-600">{endpoint.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>{endpoint.count} requests</span>
                    <span className="text-red-600">{endpoint.errors} errors</span>
                    <span>{endpoint.averageResponseTime}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {data.api.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.api.recentErrors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-red-800">
                        {error.method} {error.endpoint}
                      </div>
                      <div className="text-sm text-red-600">{error.error}</div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Status: {error.statusCode}</div>
                      <div>{new Date(error.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
