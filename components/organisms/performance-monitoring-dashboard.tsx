'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Database, 
  Globe, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Server,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PerformanceStats {
  apiStats: {
    totalCalls: number;
    averageResponseTime: number;
    slowCalls: number;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string; calls: number; avgDuration: number }>;
  };
  dbStats: {
    totalOperations: number;
    averageOperationTime: number;
    slowOperations: number;
    topCollections: Array<{ collection: string; operations: number; avgDuration: number }>;
  };
  serverInfo: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    nodeVersion: string;
    platform: string;
  };
  timestamp: string;
}

export function PerformanceMonitoringDashboard() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    fetchPerformanceStats();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPerformanceStats, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchPerformanceStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/monitoring/performance');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch performance stats');
      }

      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-100 text-green-800';
    if (value <= thresholds.warning) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Performance Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchPerformanceStats} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data</h3>
            <p className="text-gray-600">Performance monitoring is not available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { apiStats, dbStats, serverInfo } = stats;

  // Prepare chart data
  const endpointData = apiStats.topEndpoints.slice(0, 5).map(endpoint => ({
    endpoint: endpoint.endpoint.split(' ')[1] || endpoint.endpoint, // Remove HTTP method
    calls: endpoint.calls,
    avgDuration: endpoint.avgDuration
  }));

  const collectionData = dbStats.topCollections.slice(0, 5).map(collection => ({
    collection: collection.collection,
    operations: collection.operations,
    avgDuration: collection.avgDuration
  }));

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
          <p className="text-gray-600">Real-time application performance metrics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Auto Refresh:</label>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
          
          <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">1m</SelectItem>
              <SelectItem value="300">5m</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchPerformanceStats} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(apiStats.totalCalls)}</p>
                <Badge className={getPerformanceBadge(apiStats.errorRate, { good: 0.01, warning: 0.05 })}>
                  {apiStats.errorRate.toFixed(2)}% errors
                </Badge>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(apiStats.averageResponseTime, { good: 200, warning: 500 })}`}>
                  {apiStats.averageResponseTime}ms
                </p>
                <Badge className={getPerformanceBadge(apiStats.slowCalls, { good: 0, warning: 10 })}>
                  {apiStats.slowCalls} slow calls
                </Badge>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DB Operations</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dbStats.totalOperations)}</p>
                <Badge className={getPerformanceBadge(dbStats.averageOperationTime, { good: 50, warning: 100 })}>
                  {dbStats.averageOperationTime}ms avg
                </Badge>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Server Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{formatUptime(serverInfo.uptime)}</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {serverInfo.platform}
                </Badge>
              </div>
              <Server className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">RSS:</span>
                <span className="font-medium">{formatBytes(serverInfo.memoryUsage.rss)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Heap Used:</span>
                <span className="font-medium">{formatBytes(serverInfo.memoryUsage.heapUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Heap Total:</span>
                <span className="font-medium">{formatBytes(serverInfo.memoryUsage.heapTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">External:</span>
                <span className="font-medium">{formatBytes(serverInfo.memoryUsage.external)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <div className="flex items-center gap-2">
                  {apiStats.averageResponseTime <= 200 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : apiStats.averageResponseTime <= 500 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{apiStats.averageResponseTime}ms</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <div className="flex items-center gap-2">
                  {apiStats.errorRate <= 0.01 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : apiStats.errorRate <= 0.05 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{(apiStats.errorRate * 100).toFixed(2)}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">DB Performance</span>
                <div className="flex items-center gap-2">
                  {dbStats.averageOperationTime <= 50 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : dbStats.averageOperationTime <= 100 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{dbStats.averageOperationTime}ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Node Version:</span>
                <span className="font-medium">{serverInfo.nodeVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Platform:</span>
                <span className="font-medium">{serverInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="font-medium text-xs">
                  {new Date(stats.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top API Endpoints</CardTitle>
                <CardDescription>Most frequently called endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={endpointData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
                <CardDescription>Average response times by endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={endpointData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDuration" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Operations</CardTitle>
                <CardDescription>Operations by collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={collectionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ collection, percent }) => `${collection} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="operations"
                    >
                      {collectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Performance</CardTitle>
                <CardDescription>Average operation times by collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="collection" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDuration" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Track performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trend Analysis</h3>
                <p className="text-gray-600">Historical performance data will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
