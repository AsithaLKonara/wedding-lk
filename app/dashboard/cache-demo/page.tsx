'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Shield, Zap, BarChart3, RefreshCw } from 'lucide-react';

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  memoryUsage: string;
  layerStats: Record<string, { hits: number; misses: number; size: number }>;
}

interface LoadBalancerStats {
  totalInstances: number;
  healthyInstances: number;
  unhealthyInstances: number;
  averageResponseTime: number;
  strategy: string;
}

interface SecurityHealth {
  status: string;
  checks: Record<string, boolean>;
  recommendations: string[];
}

export default function CacheDemoPage() {
  const [loading, setLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loadBalancerStats, setLoadBalancerStats] = useState<LoadBalancerStats | null>(null);
  const [securityHealth, setSecurityHealth] = useState<SecurityHealth | null>(null);
  const [demoData, setDemoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsResponse, healthResponse] = await Promise.all([
        fetch('/api/cache-demo?action=stats'),
        fetch('/api/cache-demo?action=health')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCacheStats(statsData.stats);
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setLoadBalancerStats(healthData.loadBalancer.stats);
        setSecurityHealth(healthData.security);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/cache-demo?action=demo');
      const data = await response.json();

      if (response.ok) {
        setDemoData(data.data);
        setSuccess('Demo data generated and cached successfully!');
        await fetchAllData(); // Refresh stats
      } else {
        setError(data.error || 'Demo failed');
      }
    } catch (err) {
      setError('Demo request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCacheTest = async (key: string, value: string) => {
    setLoading(true);
    setError(null);

    try {
      // Set data
      const setResponse = await fetch('/api/cache-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set',
          key,
          value,
          ttl: 300,
          tags: ['test']
        })
      });

      if (setResponse.ok) {
        // Get data
        const getResponse = await fetch(`/api/cache-demo?action=get&key=${key}`);
        const getData = await getResponse.json();

        if (getResponse.ok) {
          setSuccess(`Cache test successful! Set and retrieved: ${getData.data}`);
        } else {
          setError('Failed to retrieve cached data');
        }
      } else {
        setError('Failed to cache data');
      }
    } catch (err) {
      setError('Cache test failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cache-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invalidate',
          tags: ['test', 'demo']
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cache invalidated successfully!');
        await fetchAllData(); // Refresh stats
      } else {
        setError(data.error || 'Invalidation failed');
      }
    } catch (err) {
      setError('Invalidation request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cache & Load Balancing Demo</h1>
          <p className="text-muted-foreground">
            Explore WeddingLK's enhanced caching, load balancing, and security features
          </p>
        </div>
        <Button onClick={fetchAllData} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cache">Cache Management</TabsTrigger>
          <TabsTrigger value="loadbalancer">Load Balancer</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cache Performance</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {cacheStats ? `${cacheStats.hitRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hit Rate
                </p>
                <div className="mt-2">
                  <Badge variant="outline">
                    {cacheStats ? `${cacheStats.totalRequests} requests` : '0 requests'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Load Balancer</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadBalancerStats ? `${loadBalancerStats.healthyInstances}/${loadBalancerStats.totalInstances}` : '0/0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Healthy Instances
                </p>
                <div className="mt-2">
                  <Badge variant="outline">
                    {loadBalancerStats ? `${loadBalancerStats.averageResponseTime}ms` : '0ms'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityHealth ? securityHealth.status : 'unknown'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Security Health
                </p>
                <div className="mt-2">
                  <Badge variant={securityHealth?.status === 'secure' ? 'default' : 'destructive'}>
                    {securityHealth ? Object.values(securityHealth.checks).filter(Boolean).length : 0} checks passed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
              <CardDescription>
                Real-time cache performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cacheStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Requests</p>
                      <p className="text-2xl font-bold">{cacheStats.totalRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cache Hits</p>
                      <p className="text-2xl font-bold text-green-600">{cacheStats.hits}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cache Misses</p>
                      <p className="text-2xl font-bold text-red-600">{cacheStats.misses}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hit Rate</p>
                      <p className="text-2xl font-bold">{cacheStats.hitRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Layer Statistics</h4>
                    <div className="space-y-2">
                      {Object.entries(cacheStats.layerStats).map(([layer, stats]) => (
                        <div key={layer} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="font-medium capitalize">{layer}</span>
                          <div className="flex gap-4">
                            <Badge variant="outline">Hits: {stats.hits}</Badge>
                            <Badge variant="outline">Misses: {stats.misses}</Badge>
                            <Badge variant="outline">Size: {stats.size}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading cache statistics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loadbalancer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Load Balancer Status</CardTitle>
              <CardDescription>
                Current load balancer configuration and health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadBalancerStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Instances</p>
                      <p className="text-2xl font-bold">{loadBalancerStats.totalInstances}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Healthy</p>
                      <p className="text-2xl font-bold text-green-600">{loadBalancerStats.healthyInstances}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unhealthy</p>
                      <p className="text-2xl font-bold text-red-600">{loadBalancerStats.unhealthyInstances}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avg Response</p>
                      <p className="text-2xl font-bold">{loadBalancerStats.averageResponseTime}ms</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Strategy</p>
                    <Badge variant="outline">{loadBalancerStats.strategy}</Badge>
                  </div>
                </div>
              ) : (
                <p>Loading load balancer statistics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Health Check</CardTitle>
              <CardDescription>
                Current security configuration and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityHealth ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={securityHealth.status === 'secure' ? 'default' : 'destructive'}>
                      {securityHealth.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Object.values(securityHealth.checks).filter(Boolean).length} of {Object.keys(securityHealth.checks).length} checks passed
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Security Checks</h4>
                    <div className="space-y-2">
                      {Object.entries(securityHealth.checks).map(([check, passed]) => (
                        <div key={check} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="font-medium">{check}</span>
                          <Badge variant={passed ? 'default' : 'destructive'}>
                            {passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {securityHealth.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {securityHealth.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading security health check...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cache Demo</CardTitle>
                <CardDescription>
                  Test the enhanced caching system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleDemo} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                  Generate Demo Data
                </Button>

                <div className="space-y-2">
                  <Input placeholder="Cache key" id="cache-key" />
                  <Input placeholder="Cache value" id="cache-value" />
                  <Button 
                    onClick={() => {
                      const key = (document.getElementById('cache-key') as HTMLInputElement)?.value;
                      const value = (document.getElementById('cache-value') as HTMLInputElement)?.value;
                      if (key && value) handleCacheTest(key, value);
                    }}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    Test Cache
                  </Button>
                </div>

                <Button onClick={handleInvalidate} disabled={loading} variant="destructive" className="w-full">
                  Invalidate Cache
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Data</CardTitle>
                <CardDescription>
                  Generated demo data from cache
                </CardDescription>
              </CardHeader>
              <CardContent>
                {demoData ? (
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium">Venues</h4>
                      <p className="text-sm text-muted-foreground">
                        {demoData.venues?.length || 0} venues loaded
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Vendors</h4>
                      <p className="text-sm text-muted-foreground">
                        {demoData.vendors?.length || 0} vendors loaded
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Users</h4>
                      <p className="text-sm text-muted-foreground">
                        {demoData.users?.length || 0} users loaded
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Generated: {new Date(demoData.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No demo data generated yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
