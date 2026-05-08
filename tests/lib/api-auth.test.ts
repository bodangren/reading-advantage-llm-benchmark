import { describe, it, expect, beforeEach } from 'vitest';
import { validateApiKey, validateDemoKey, isValidApiKey, addApiKey } from '../../src/lib/api-keys';
import { checkRateLimit, resetRateLimit } from '../../src/lib/rate-limit';
import { validateAuth } from '../../src/lib/api-auth';
import { NextRequest } from 'next/server';

describe('API Key Validation', () => {
  describe('validateApiKey', () => {
    it('should return false for unknown keys', () => {
      expect(validateApiKey('unknown_key')).toBe(false);
    });

    it('should return true for added keys', () => {
      addApiKey('test_key_123', 'Test Key');
      expect(validateApiKey('test_key_123')).toBe(true);
    });
  });

  describe('validateDemoKey', () => {
    it('should return true for demo keys', () => {
      expect(validateDemoKey('demo_key_for_testing_12345')).toBe(true);
      expect(validateDemoKey('another_demo_key_67890')).toBe(true);
    });

    it('should return false for non-demo keys', () => {
      expect(validateDemoKey('not_a_demo_key')).toBe(false);
    });
  });

  describe('isValidApiKey', () => {
    it('should return false for null/undefined/empty', () => {
      expect(isValidApiKey(null)).toBe(false);
      expect(isValidApiKey(undefined)).toBe(false);
      expect(isValidApiKey('')).toBe(false);
    });

    it('should return true for valid demo keys', () => {
      expect(isValidApiKey('demo_key_for_testing_12345')).toBe(true);
    });
  });
});

describe('Rate Limiting', () => {
  const testKey = 'rate_limit_test_key';

  beforeEach(() => {
    resetRateLimit(testKey);
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit(testKey);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });

    it('should track request count', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit(testKey);
      }
      const result = checkRateLimit(testKey);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(94);
    });

    it('should allow exactly 100 requests', () => {
      for (let i = 0; i < 99; i++) {
        checkRateLimit(testKey);
      }
      const result = checkRateLimit(testKey);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('should block on 101st request', () => {
      for (let i = 0; i < 100; i++) {
        checkRateLimit(testKey);
      }
      const result = checkRateLimit(testKey);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});

describe('Auth Middleware', () => {
  describe('validateAuth', () => {
    it('should reject requests without API key', async () => {
      const request = new NextRequest('http://localhost/api/leaderboard');
      const result = await validateAuth(request);

      expect(result.allowed).toBe(false);
      expect(result.status).toBe(401);
    });

    it('should accept requests with valid demo key', async () => {
      const request = new NextRequest('http://localhost/api/leaderboard');
      request.headers.set('x-api-key', 'demo_key_for_testing_12345');
      const result = await validateAuth(request);

      expect(result.allowed).toBe(true);
    });

    it('should rate limit after exceeding quota', async () => {
      const testRateKey = 'rate_limit_reject_key';
      resetRateLimit(testRateKey);
      addApiKey(testRateKey, 'Rate Limit Test');

      const request = new NextRequest('http://localhost/api/leaderboard');
      request.headers.set('x-api-key', testRateKey);

      for (let i = 0; i < 100; i++) {
        checkRateLimit(testRateKey);
      }

      const result = await validateAuth(request);
      expect(result.allowed).toBe(false);
      expect(result.status).toBe(429);
    });
  });
});