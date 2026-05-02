import { describe, it, expect } from 'vitest';
import { filterByTrack, normalizeScore } from '../../src/lib/utils';

describe('Leaderboard Filtering', () => {
  describe('filterByTrack', () => {
    const mockLeaderboardEntries = [
      { model: 'gpt-5', score: 0.92, track: 'native' as const },
      { model: 'claude-sonnet', score: 0.88, track: 'native' as const },
      { model: 'gpt-4', score: 0.85, track: 'fixed' as const },
      { model: 'gemini-pro', score: 0.82, track: 'fixed' as const },
      { model: 'unknown-model', score: 0.75 },
    ];

    it('should filter entries by track type', () => {
      const nativeEntries = filterByTrack(mockLeaderboardEntries, 'native');
      expect(nativeEntries).toHaveLength(2);
      expect(nativeEntries.map(e => e.model)).toEqual(['gpt-5', 'claude-sonnet']);

      const fixedEntries = filterByTrack(mockLeaderboardEntries, 'fixed');
      expect(fixedEntries).toHaveLength(2);
      expect(fixedEntries.map(e => e.model)).toEqual(['gpt-4', 'gemini-pro']);
    });

    it('should return empty array when no matches found', () => {
      const entries = filterByTrack(mockLeaderboardEntries, 'native');
      const filtered = entries.filter(e => e.model === 'nonexistent');
      expect(filtered).toHaveLength(0);
    });

    it('should sort by score descending', () => {
      const nativeEntries = filterByTrack(mockLeaderboardEntries, 'native');
      expect(nativeEntries[0].model).toBe('gpt-5');
      expect(nativeEntries[1].model).toBe('claude-sonnet');
    });
  });

  describe('normalizeScore', () => {
    it('should convert 0-1 scale to 0-100', () => {
      expect(normalizeScore(0.85)).toBe(85);
      expect(normalizeScore(0.5)).toBe(50);
      expect(normalizeScore(1.0)).toBe(100);
    });

    it('should pass through 0-100 scale values', () => {
      expect(normalizeScore(85)).toBe(85);
      expect(normalizeScore(100)).toBe(100);
    });

    it('should handle edge cases', () => {
      expect(normalizeScore(0)).toBe(0);
      expect(normalizeScore(0.01)).toBe(1);
    });
  });
});