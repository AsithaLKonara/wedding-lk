/**
 * Upstash Redis Service
 * Uses REST API for better compatibility with Upstash Redis Cloud
 */

interface UpstashConfig {
  url: string;
  token: string;
}

class UpstashRedisService {
  private static instance: UpstashRedisService;
  private config: UpstashConfig | null = null;
  private isConnected: boolean = false;

  private constructor() {
    this.initializeUpstash();
  }

  public static getInstance(): UpstashRedisService {
    if (!UpstashRedisService.instance) {
      UpstashRedisService.instance = new UpstashRedisService();
    }
    return UpstashRedisService.instance;
  }

  private initializeUpstash() {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl || redisUrl.includes('your-redis-url')) {
      console.log('⚠️ Upstash Redis not configured - using memory cache only');
      return;
    }

    try {
      // Parse Redis URL to extract credentials
      const url = new URL(redisUrl);
      const password = url.password;
      const hostname = url.hostname;
      
      // Upstash REST API URL (no port needed for REST API)
      const restUrl = `https://${hostname}`;
      
      this.config = {
        url: restUrl,
        token: password
      };

      console.log('✅ Upstash Redis configured successfully');
      this.isConnected = true;
    } catch (error) {
      console.error('❌ Failed to initialize Upstash Redis:', error);
      this.isConnected = false;
    }
  }

  public async isReady(): Promise<boolean> {
    return this.isConnected && this.config !== null;
  }

  private async makeRequest(command: string, ...args: any[]): Promise<any> {
    if (!this.config) {
      throw new Error('Upstash Redis not configured');
    }

    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([command, ...args])
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Upstash Redis request failed:', error);
      throw error;
    }
  }

  public async get(key: string): Promise<any> {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.makeRequest('GET', key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Upstash GET error:', error);
      return null;
    }
  }

  public async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      await this.makeRequest('SETEX', key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Upstash SET error:', error);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.makeRequest('DEL', key);
      return result > 0;
    } catch (error) {
      console.error('Upstash DEL error:', error);
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.makeRequest('EXISTS', key);
      return result === 1;
    } catch (error) {
      console.error('Upstash EXISTS error:', error);
      return false;
    }
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.makeRequest('EXPIRE', key, ttl);
      return result === 1;
    } catch (error) {
      console.error('Upstash EXPIRE error:', error);
      return false;
    }
  }

  // Hash operations
  public async hget(key: string, field: string): Promise<any> {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.makeRequest('HGET', key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Upstash HGET error:', error);
      return null;
    }
  }

  public async hset(key: string, field: string, value: any): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      await this.makeRequest('HSET', key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Upstash HSET error:', error);
      return false;
    }
  }

  public async hgetall(key: string): Promise<Record<string, any>> {
    if (!this.isConnected) return {};
    
    try {
      const data = await this.makeRequest('HGETALL', key);
      const result: Record<string, any> = {};
      
      for (let i = 0; i < data.length; i += 2) {
        try {
          result[data[i]] = JSON.parse(data[i + 1]);
        } catch {
          result[data[i]] = data[i + 1];
        }
      }
      
      return result;
    } catch (error) {
      console.error('Upstash HGETALL error:', error);
      return {};
    }
  }

  // List operations
  public async lpush(key: string, ...values: any[]): Promise<number> {
    if (!this.isConnected) return 0;
    
    try {
      const stringValues = values.map(v => JSON.stringify(v));
      return await this.makeRequest('LPUSH', key, ...stringValues);
    } catch (error) {
      console.error('Upstash LPUSH error:', error);
      return 0;
    }
  }

  public async rpop(key: string): Promise<any> {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.makeRequest('RPOP', key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Upstash RPOP error:', error);
      return null;
    }
  }

  public async lrange(key: string, start: number, stop: number): Promise<any[]> {
    if (!this.isConnected) return [];
    
    try {
      const data = await this.makeRequest('LRANGE', key, start, stop);
      return data.map((item: any) => {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      });
    } catch (error) {
      console.error('Upstash LRANGE error:', error);
      return [];
    }
  }

  // Set operations
  public async sadd(key: string, ...members: any[]): Promise<number> {
    if (!this.isConnected) return 0;
    
    try {
      const stringMembers = members.map(m => JSON.stringify(m));
      return await this.makeRequest('SADD', key, ...stringMembers);
    } catch (error) {
      console.error('Upstash SADD error:', error);
      return 0;
    }
  }

  public async smembers(key: string): Promise<any[]> {
    if (!this.isConnected) return [];
    
    try {
      const data = await this.makeRequest('SMEMBERS', key);
      return data.map((item: any) => {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      });
    } catch (error) {
      console.error('Upstash SMEMBERS error:', error);
      return [];
    }
  }

  // Sorted set operations
  public async zadd(key: string, score: number, member: any): Promise<number> {
    if (!this.isConnected) return 0;
    
    try {
      return await this.makeRequest('ZADD', key, score, JSON.stringify(member));
    } catch (error) {
      console.error('Upstash ZADD error:', error);
      return 0;
    }
  }

  public async zrange(key: string, start: number, stop: number, withScores: boolean = false): Promise<any[]> {
    if (!this.isConnected) return [];
    
    try {
      const args = withScores ? [key, start, stop, 'WITHSCORES'] : [key, start, stop];
      const data = await this.makeRequest('ZRANGE', ...args);
      
      if (withScores) {
        const result: any[] = [];
        for (let i = 0; i < data.length; i += 2) {
          try {
            result.push({
              member: JSON.parse(data[i]),
              score: parseFloat(data[i + 1])
            });
          } catch {
            result.push({
              member: data[i],
              score: parseFloat(data[i + 1])
            });
          }
        }
        return result;
      } else {
        return data.map((item: any) => {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        });
      }
    } catch (error) {
      console.error('Upstash ZRANGE error:', error);
      return [];
    }
  }

  public async zrevrange(key: string, start: number, stop: number, withScores: boolean = false): Promise<any[]> {
    if (!this.isConnected) return [];
    
    try {
      const args = withScores ? [key, start, stop, 'WITHSCORES'] : [key, start, stop];
      const data = await this.makeRequest('ZREVRANGE', ...args);
      
      if (withScores) {
        const result: any[] = [];
        for (let i = 0; i < data.length; i += 2) {
          try {
            result.push({
              member: JSON.parse(data[i]),
              score: parseFloat(data[i + 1])
            });
          } catch {
            result.push({
              member: data[i],
              score: parseFloat(data[i + 1])
            });
          }
        }
        return result;
      } else {
        return data.map((item: any) => {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        });
      }
    } catch (error) {
      console.error('Upstash ZREVRANGE error:', error);
      return [];
    }
  }

  public async close(): Promise<void> {
    // Upstash REST API doesn't require connection closing
    this.isConnected = false;
  }
}

export default UpstashRedisService;
