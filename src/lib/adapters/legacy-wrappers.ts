import { RedisRateLimiter } from './redis-rate-limiter';
import { RedisScheduleStore } from './redis-schedule-store';

let rateLimiterInstance: RedisRateLimiter | null = null;
let scheduleStoreInstance: RedisScheduleStore | null = null;

export function getRateLimitAdapter() {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RedisRateLimiter({ maxRequests: 100, windowMs: 60 * 60 * 1000 });
  }
  return rateLimiterInstance;
}

export function getScheduleStoreAdapter() {
  if (!scheduleStoreInstance) {
    scheduleStoreInstance = new RedisScheduleStore();
  }
  return scheduleStoreInstance;
}

export const checkRateLimit = async (key: string) => {
  const adapter = getRateLimitAdapter();
  await adapter.connect();
  return adapter.checkLimit(key);
};

export const resetRateLimit = async (key: string) => {
  const adapter = getRateLimitAdapter();
  await adapter.connect();
  return adapter.reset(key);
};

export const getRateLimitStatus = async (key: string) => {
  const adapter = getRateLimitAdapter();
  await adapter.connect();
  return adapter.getRateLimitStatus(key);
};