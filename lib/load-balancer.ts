// Load Balancer for WeddingLK
// Provides intelligent load balancing and health monitoring

export interface LoadBalancerConfig {
  instances: string[];
  strategy: 'round-robin' | 'least-connections' | 'weighted' | 'ip-hash';
  healthCheck: {
    enabled: boolean;
    interval: number; // milliseconds
    timeout: number; // milliseconds
    path: string;
  };
  failover: {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number;
  };
}

export interface InstanceHealth {
  instance: string;
  isHealthy: boolean;
  responseTime: number;
  lastChecked: Date;
  consecutiveFailures: number;
  weight: number;
}

export class LoadBalancer {
  private config: LoadBalancerConfig;
  private healthStatus: Map<string, InstanceHealth> = new Map();
  private currentIndex: number = 0;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: LoadBalancerConfig) {
    this.config = config;
    this.initializeHealthStatus();
    this.startHealthChecks();
  }

  private initializeHealthStatus(): void {
    this.config.instances.forEach(instance => {
      this.healthStatus.set(instance, {
        instance,
        isHealthy: true,
        responseTime: 0,
        lastChecked: new Date(),
        consecutiveFailures: 0,
        weight: 1
      });
    });
  }

  // Get next healthy instance based on strategy
  getNextInstance(): string | null {
    const healthyInstances = this.getHealthyInstances();
    
    if (healthyInstances.length === 0) {
      console.warn('⚠️ No healthy instances available');
      return null;
    }

    switch (this.config.strategy) {
      case 'round-robin':
        return this.roundRobinSelection(healthyInstances);
      case 'least-connections':
        return this.leastConnectionsSelection(healthyInstances);
      case 'weighted':
        return this.weightedSelection(healthyInstances);
      case 'ip-hash':
        return this.ipHashSelection(healthyInstances);
      default:
        return this.roundRobinSelection(healthyInstances);
    }
  }

  // Round-robin selection
  private roundRobinSelection(instances: string[]): string {
    const instance = instances[this.currentIndex % instances.length];
    this.currentIndex++;
    return instance;
  }

  // Least connections selection (simplified - would need connection tracking)
  private leastConnectionsSelection(instances: string[]): string {
    // In a real implementation, you'd track active connections per instance
    // For now, use round-robin as fallback
    return this.roundRobinSelection(instances);
  }

  // Weighted selection based on instance health and performance
  private weightedSelection(instances: string[]): string {
    const weights = instances.map(instance => {
      const health = this.healthStatus.get(instance);
      return health ? health.weight : 1;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < instances.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return instances[i];
      }
    }

    return instances[0]; // Fallback
  }

  // IP hash selection for session affinity
  private ipHashSelection(instances: string[]): string {
    // In a real implementation, you'd hash the client IP
    // For now, use round-robin as fallback
    return this.roundRobinSelection(instances);
  }

  // Get all healthy instances
  private getHealthyInstances(): string[] {
    return Array.from(this.healthStatus.entries())
      .filter(([_, health]) => health.isHealthy)
      .map(([instance, _]) => instance);
  }

  // Start health checks
  private startHealthChecks(): void {
    if (!this.config.healthCheck.enabled) return;
    
    // Skip health checks during build process
    if (process.env.NODE_ENV === 'production' && process.env.SKIP_HEALTH_CHECKS === 'true') {
      console.log('🏥 Load balancer health checks disabled for build');
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheck.interval);

    console.log('🏥 Load balancer health checks started');
  }

  // Perform health checks on all instances
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = this.config.instances.map(instance => 
      this.checkInstanceHealth(instance)
    );

    await Promise.allSettled(healthCheckPromises);
  }

  // Check health of a single instance
  private async checkInstanceHealth(instance: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheck.timeout);

      const response = await fetch(`${instance}${this.config.healthCheck.path}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'WeddingLK-HealthCheck/1.0'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const health = this.healthStatus.get(instance);
      if (health) {
        health.isHealthy = response.ok;
        health.responseTime = responseTime;
        health.lastChecked = new Date();
        
        if (response.ok) {
          health.consecutiveFailures = 0;
          // Adjust weight based on response time
          health.weight = Math.max(0.1, 1 - (responseTime / 1000));
        } else {
          health.consecutiveFailures++;
        }
      }

    } catch (error) {
      const health = this.healthStatus.get(instance);
      if (health) {
        health.isHealthy = false;
        health.responseTime = Date.now() - startTime;
        health.lastChecked = new Date();
        health.consecutiveFailures++;
      }

      console.warn(`❌ Health check failed for ${instance}:`, error);
    }
  }

  // Get health status of all instances
  getHealthStatus(): InstanceHealth[] {
    return Array.from(this.healthStatus.values());
  }

  // Get load balancer statistics
  getStats(): {
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
    averageResponseTime: number;
    strategy: string;
  } {
    const instances = Array.from(this.healthStatus.values());
    const healthyInstances = instances.filter(i => i.isHealthy);
    const averageResponseTime = healthyInstances.length > 0 
      ? healthyInstances.reduce((sum, i) => sum + i.responseTime, 0) / healthyInstances.length
      : 0;

    return {
      totalInstances: instances.length,
      healthyInstances: healthyInstances.length,
      unhealthyInstances: instances.length - healthyInstances.length,
      averageResponseTime,
      strategy: this.config.strategy
    };
  }

  // Mark instance as unhealthy (for manual intervention)
  markInstanceUnhealthy(instance: string): void {
    const health = this.healthStatus.get(instance);
    if (health) {
      health.isHealthy = false;
      health.consecutiveFailures = this.config.failover.maxRetries;
      console.log(`🚫 Manually marked instance as unhealthy: ${instance}`);
    }
  }

  // Mark instance as healthy (for manual intervention)
  markInstanceHealthy(instance: string): void {
    const health = this.healthStatus.get(instance);
    if (health) {
      health.isHealthy = true;
      health.consecutiveFailures = 0;
      console.log(`✅ Manually marked instance as healthy: ${instance}`);
    }
  }

  // Add new instance
  addInstance(instance: string): void {
    if (!this.config.instances.includes(instance)) {
      this.config.instances.push(instance);
      this.healthStatus.set(instance, {
        instance,
        isHealthy: true,
        responseTime: 0,
        lastChecked: new Date(),
        consecutiveFailures: 0,
        weight: 1
      });
      console.log(`➕ Added new instance: ${instance}`);
    }
  }

  // Remove instance
  removeInstance(instance: string): void {
    const index = this.config.instances.indexOf(instance);
    if (index > -1) {
      this.config.instances.splice(index, 1);
      this.healthStatus.delete(instance);
      console.log(`➖ Removed instance: ${instance}`);
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<LoadBalancerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart health checks if interval changed
    if (newConfig.healthCheck?.interval) {
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
      this.startHealthChecks();
    }
    
    console.log('🔧 Load balancer configuration updated');
  }

  // Stop health checks and cleanup
  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    console.log('🛑 Load balancer stopped');
  }
}

// Default configuration for WeddingLK
export const defaultLoadBalancerConfig: LoadBalancerConfig = {
  instances: [
    process.env.APP_INSTANCE_1 || 'http://localhost:3000',
    process.env.APP_INSTANCE_2 || 'http://localhost:3001',
    process.env.APP_INSTANCE_3 || 'http://localhost:3002'
  ],
  strategy: 'round-robin',
  healthCheck: {
    enabled: true,
    interval: 30000, // 30 seconds
    timeout: 5000,   // 5 seconds
    path: '/api/health'
  },
  failover: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000
  }
};

// Export singleton instance
export const loadBalancer = new LoadBalancer(defaultLoadBalancerConfig);
