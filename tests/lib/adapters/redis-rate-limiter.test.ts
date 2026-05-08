import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RedisRateLimiter } from '../../../src/lib/adapters/redis-rate-limiter';
import { resetRedisClient, createRedisClient } from '../../../src/lib/redis-client';

vi.mock('../../../src/lib/redis-client');

const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
  del: vi.fn(),
  ping: vi.fn(),
  ttl: vi.fn(),
  keys: vi.fn(),
  hset: vi.fn(),
  hgetall: vi.fn(),
  zadd: vi.fn(),
  zrange: vi.fn(),
};

describe('RedisRateLimiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRedisClient();

    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    mockRedis.incr.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);
    mockRedis.del.mockResolvedValue(1);
    mockRedis.ping.mockResolvedValue('PONG');
    mockRedis.ttl.mockResolvedValue(3600);

    vi.mocked(createRedisClient).mockResolvedValue(mockRedis);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkLimit', () => {
    it('should allow first request and set expiry', async () => {
      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result = await limiter.checkLimit('test-key');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
      expect(mockRedis.set).toHaveBeenCalledWith('rl:test-key', 1, 'EX', 3600);
    });

    it('should track request count across calls', async () => {
      mockRedis.get.mockResolvedValue('5');
      mockRedis.incr.mockResolvedValue(6);

      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result = await limiter.checkLimit('test-key');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(94);
      expect(mockRedis.incr).toHaveBeenCalledWith('rl:test-key');
    });

    it('should block when limit exceeded', async () => {
      mockRedis.get.mockResolvedValue('100');
      mockRedis.ttl.mockResolvedValue(1800);

      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result = await limiter.checkLimit('test-key');

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should fall back to in-memory when Redis unavailable', async () => {
      vi.mocked(createRedisClient).mockResolvedValue(null);

      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result1 = await limiter.checkLimit('fallback-key');
      const result2 = await limiter.checkLimit('fallback-key');

      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(99);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(98);
    });
  });

  describe('reset', () => {
    it('should delete the key from Redis', async () => {
      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      await limiter.reset('test-key');

      expect(mockRedis.del).toHaveBeenCalledWith('rl:test-key');
    });
  });

  describe('getRateLimitStatus', () => {
    it('should return null when key does not exist', async () => {
      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result = await limiter.getRateLimitStatus('nonexistent');

      expect(result).toBeNull();
    });

    it('should return status when key exists', async () => {
      mockRedis.get.mockResolvedValue('25');

      const limiter = new RedisRateLimiter({ maxRequests: 100, windowMs: 3600000 });
      await limiter.connect();
      const result = await limiter.getRateLimitStatus('test-key');

      expect(result).toEqual({
        count: 25,
        remaining: 75,
        resetAt: expect.any(Number),
      });
    });
  });
});