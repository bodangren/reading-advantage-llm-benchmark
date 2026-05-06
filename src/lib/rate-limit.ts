interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 100;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

export function getRateLimitStatus(key: string): { count: number; remaining: number; resetAt: number } | null {
  const entry = rateLimitStore.get(key);
  if (!entry) return null;
  const now = Date.now();
  if (now > entry.resetAt) return null;
  return {
    count: entry.count,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}