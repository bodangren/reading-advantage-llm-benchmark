export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string | number, ex?: 'EX', seconds?: number): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  del(key: string): Promise<number>;
  ttl(key: string): Promise<number>;
  ping(): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
  hset(key: string, data: Record<string, string>): Promise<number>;
  hgetall(key: string): Promise<Record<string, string> | null>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zrange(key: string, min: number, max: number): Promise<string[]>;
}

let redisClient: RedisClient | null = null;

export async function createRedisClient(): Promise<RedisClient | null> {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? `upstash://${process.env.UPSTASH_REDIS_REST_URL}`
      : null);

  if (!redisUrl) return null;

  try {
    if (redisUrl.startsWith('upstash://')) {
      const { Redis } = await import('@upstash/redis');
      const client = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      redisClient = {
        get: (key) => client.get<string>(key),
        set: (key, value) => client.set(key, value),
        incr: (key) => client.incr(key),
        expire: (key, seconds) => client.expire(key, seconds),
        del: (key) => client.del(key),
        ttl: (key) => client.ttl(key),
        ping: () => client.ping(),
        keys: (pattern) => client.keys(pattern),
        hset: (key, data) => client.hset(key, data) as Promise<number>,
        hgetall: (key) => client.hgetall<Record<string, string>>(key),
        zadd: (key, score, member) => client.zadd(key, { score, member }) as Promise<number>,
        zrange: (key, min, max) => client.zrange(key, min, max) as Promise<string[]>,
      };
    } else {
      const Redis = (await import('ioredis')).default;
      const client = new Redis(redisUrl);
      await client.ping();
      redisClient = {
        get: (key) => client.get(key),
        set: (key, value, _ex, seconds) => client.set(key, value, 'EX', seconds ?? 0),
        incr: (key) => client.incr(key),
        expire: (key, seconds) => client.expire(key, seconds),
        del: (key) => client.del(key),
        ttl: (key) => client.ttl(key),
        ping: () => client.ping() as Promise<unknown>,
        keys: (pattern) => client.keys(pattern),
        hset: (key, data) => client.hset(key, data),
        hgetall: async (key) => {
          const result = await client.hgetall(key);
          return Object.keys(result).length > 0 ? result : null;
        },
        zadd: (key, score, member) => client.zadd(key, score, member),
        zrange: async (key, min, max) => {
          const result = await client.zrange(key, min, max);
          return Array.isArray(result) ? result : [];
        },
      };
    }
    return redisClient;
  } catch {
    return null;
  }
}

export function resetRedisClient(): void {
  redisClient = null;
}