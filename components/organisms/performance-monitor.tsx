import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Clock, 
  HardDrive, 
  Network, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  errorRate: number;
  userExperienceScore: number;
}

interface PerformanceMonitorProps {
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    errorRate: 0,
    userExperienceScore: 0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(collectMetrics, 5000); // Collect every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const collectMetrics = async () => {
    try {
      // Page load time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

      // API response time (average of recent requests)
      const apiEntries = performance.getEntriesByType('resource').filter(
        entry => entry.name.includes('/api/')
      );
      const apiResponseTime = apiEntries.length > 0 
        ? apiEntries.reduce((sum, entry) => sum + entry.duration, 0) / apiEntries.length 
        : 0;

      // Memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

      // Network latency (simulated)
      const networkLatency = Math.random() * 100 + 20; // 20-120ms

      // Cache hit rate (simulated)
      const cacheHitRate = Math.random() * 30 + 70; // 70-100%

      // Error rate (simulated)
      const errorRate = Math.random() * 5; // 0-5%

      // Calculate user experience score
      const userExperienceScore = calculateUserExperienceScore({
        pageLoadTime,
        apiResponseTime,
        memoryUsage,
        networkLatency,
        cacheHitRate,
        errorRate,
        userExperienceScore: 0, // Add this to satisfy the interface
      });

      setMetrics({
        pageLoadTime,
        apiResponseTime,
        memoryUsage,
        networkLatency,
        cacheHitRate,
        errorRate,
        userExperienceScore,
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  };

  const calculateUserExperienceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;

    // Deduct points for poor performance
    if (metrics.pageLoadTime > 3000) score -= 20;
    if (metrics.apiResponseTime > 1000) score -= 15;
    if (metrics.memoryUsage > 80) score -= 10;
    if (metrics.networkLatency > 100) score -= 10;
    if (metrics.cacheHitRate < 80) score -= 5;
    if (metrics.errorRate > 2) score -= 10;

    return Math.max(0, score);
  };

  const getPerformanceStatus = (score: number): { label: string; color: string; icon: React.ReactNode } => {
    if (score >= 90) {
      return { label: 'Excellent', color: 'bg-green-100 text-green-800', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (score >= 70) {
      return { label: 'Good', color: 'bg-blue-100 text-blue-800', icon: <Activity className="h-4 w-4" /> };
    } else if (score >= 50) {
      return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4" /> };
    } else {
      return { label: 'Poor', color: 'bg-red-100 text-red-800', icon: <TrendingDown className="h-4 w-4" /> };
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      collectMetrics();
    }
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const performanceStatus = getPerformanceStatus(metrics.userExperienceScore);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={performanceStatus.color}>
            {performanceStatus.icon}
            <span className="ml-1">{performanceStatus.label}</span>
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMonitoring}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isMonitoring ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Experience Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">User Experience Score</span>
            <span className="font-medium">{Math.round(metrics.userExperienceScore)}/100</span>
          </div>
          <Progress value={metrics.userExperienceScore} className="h-2" />
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Page Load Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Page Load</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(metrics.pageLoadTime)}</div>
            <div className="text-xs text-muted-foreground">
              {metrics.pageLoadTime < 1000 ? 'Fast' : metrics.pageLoadTime < 3000 ? 'Normal' : 'Slow'}
            </div>
          </div>

          {/* API Response Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">API Response</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(metrics.apiResponseTime)}</div>
            <div className="text-xs text-muted-foreground">
              {metrics.apiResponseTime < 500 ? 'Fast' : metrics.apiResponseTime < 1000 ? 'Normal' : 'Slow'}
            </div>
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(metrics.memoryUsage)}%</div>
            <div className="text-xs text-muted-foreground">
              {metrics.memoryUsage < 50 ? 'Low' : metrics.memoryUsage < 80 ? 'Normal' : 'High'}
            </div>
          </div>

          {/* Network Latency */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Network className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(metrics.networkLatency)}ms</div>
            <div className="text-xs text-muted-foreground">
              {metrics.networkLatency < 50 ? 'Fast' : metrics.networkLatency < 100 ? 'Normal' : 'Slow'}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
            <div className="text-lg font-semibold">{Math.round(metrics.cacheHitRate)}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Error Rate</div>
            <div className="text-lg font-semibold">{metrics.errorRate.toFixed(2)}%</div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <span>Status: {isMonitoring ? 'Monitoring' : 'Stopped'}</span>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <Button
              variant={isMonitoring ? 'destructive' : 'default'}
              size="sm"
              onClick={toggleMonitoring}
              className="flex-1"
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collectMetrics}
              className="flex-1"
            >
              Update Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor; 