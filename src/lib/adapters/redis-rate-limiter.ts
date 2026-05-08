import { RedisClient, createRedisClient } from '../redis-client';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export class RedisRateLimiter {
  private redis: RedisClient | null = null;
  private config: RateLimitConfig;
  private useFallback = false;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.redis = await createRedisClient();
    this.useFallback = !this.redis;
  }

  async checkLimit(key: string): Promise<RateLimitResult> {
    if (!this.redis || this.useFallback) {
      return this.checkLimitMemory(key);
    }

    const now = Date.now();
    const redisKey = `rl:${key}`;

    try {
      const current = await this.redis.get(redisKey);

      if (!current) {
        const resetAt = now + this.config.windowMs;
        await this.redis.set(redisKey, 1, 'EX', Math.ceil(this.config.windowMs / 1000));
        return { allowed: true, remaining: this.config.maxRequests - 1, resetAt };
      }

      const count = parseInt(current, 10);

      if (count >= this.config.maxRequests) {
        const ttl = await this.redis.ttl(redisKey);
        const resetAt = now + (ttl > 0 ? ttl * 1000 : this.config.windowMs);
        return { allowed: false, remaining: 0, resetAt };
      }

      await this.redis.incr(redisKey);
      const ttl = await this.redis.ttl(redisKey);
      const resetAt = now + (ttl > 0 ? ttl * 1000 : this.config.windowMs);

      return { allowed: true, remaining: this.config.maxRequests - count - 1, resetAt };
    } catch {
      return this.checkLimitMemory(key);
    }
  }

  private checkLimitMemory(key: string): RateLimitResult {
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.config.windowMs;
      memoryStore.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.config.maxRequests - 1, resetAt };
    }

    if (entry.count >= this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: this.config.maxRequests - entry.count, resetAt: entry.resetAt };
  }

  async reset(key: string): Promise<void> {
    if (this.redis && !this.useFallback) {
      await this.redis.del(`rl:${key}`);
    }
    memoryStore.delete(key);
  }

  async getRateLimitStatus(key: string): Promise<{ count: number; remaining: number; resetAt: number } | null> {
    if (this.redis && !this.useFallback) {
      try {
        const redisKey = `rl:${key}`;
        const current = await this.redis.get(redisKey);
        if (!current) return null;

        const ttl = await this.redis.ttl(redisKey);
        const now = Date.now();
        const count = parseInt(current, 10);

        return {
          count,
          remaining: this.config.maxRequests - count,
          resetAt: now + (ttl > 0 ? ttl * 1000 : this.config.windowMs),
        };
      } catch {
        // Fall through to memory
      }
    }

    const entry = memoryStore.get(key);
    if (!entry) return null;
    const now = Date.now();
    if (now > entry.resetAt) return null;

    return {
      count: entry.count,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }
}

export function createRateLimitAdapter(config?: RateLimitConfig): RedisRateLimiter {
  return new RedisRateLimiter(config ?? { maxRequests: 100, windowMs: 60 * 60 * 1000 });
}