import { describe, it, expect } from 'vitest';
import { normalizeScore, isScoreNormalized } from '../../src/lib/scoreNormalizer';

describe('Score Normalizer', () => {
  describe('normalizeScore', () => {
    it('should convert 0-1 scale to 0-100', () => {
      const result = normalizeScore(0.82);
      expect(result.scale).toBe('0-1');
      expect(result.raw).toBe(0.82);
      expect(result.normalized).toBe(82);
    });

    it('should pass through 0-100 scale scores', () => {
      const result = normalizeScore(85);
      expect(result.scale).toBe('0-100');
      expect(result.raw).toBe(85);
      expect(result.normalized).toBe(85);
    });

    it('should handle 0 score', () => {
      const result = normalizeScore(0);
      expect(result.scale).toBe('0-1');
      expect(result.normalized).toBe(0);
    });

    it('should handle 1 score (maximum 0-1)', () => {
      const result = normalizeScore(1);
      expect(result.scale).toBe('0-1');
      expect(result.normalized).toBe(100);
    });

    it('should handle scores above 1 as 0-100 scale', () => {
      const result = normalizeScore(50);
      expect(result.scale).toBe('0-100');
      expect(result.normalized).toBe(50);
    });

    it('should handle decimal precision for 0-1 scores', () => {
      const result = normalizeScore(0.333);
      expect(result.normalized).toBe(33.3);
    });

    it('should handle edge case at threshold (exactly 1)', () => {
      const result = normalizeScore(1);
      expect(result.normalized).toBe(100);
    });

    it('should correctly identify 0-1 scale scores', () => {
      expect(isScoreNormalized(0.5)).toBe(false);
      expect(isScoreNormalized(0)).toBe(false);
      expect(isScoreNormalized(1)).toBe(false);
    });

    it('should correctly identify 0-100 scale scores', () => {
      expect(isScoreNormalized(50)).toBe(true);
      expect(isScoreNormalized(100)).toBe(true);
      expect(isScoreNormalized(0)).toBe(false);
      expect(isScoreNormalized(150)).toBe(true);
    });
  });
});