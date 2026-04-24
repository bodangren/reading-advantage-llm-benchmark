import { describe, it, expect } from 'vitest';
import { compareModels, rankModels } from '@/lib/comparison';

describe('Comparison Engine', () => {
  describe('compareModels', () => {
    it('identifies winner in two-model comparison', () => {
      const results = [
        { model: 'gpt-4o', rawScore: 85, normalizedScore: 85 },
        { model: 'claude-3', rawScore: 92, normalizedScore: 92 },
      ];
      const taskId = 'task-1';
      const compared = compareModels(results, taskId);
      expect(compared[0].winner).toBe(false);
      expect(compared[1].winner).toBe(true);
      expect(compared[0].delta).toBe(-7);
      expect(compared[1].delta).toBe(0);
    });

    it('handles tie case', () => {
      const results = [
        { model: 'model-a', rawScore: 80, normalizedScore: 80 },
        { model: 'model-b', rawScore: 80, normalizedScore: 80 },
      ];
      const taskId = 'task-1';
      const compared = compareModels(results, taskId);
      expect(compared[0].winner).toBe(false);
      expect(compared[1].winner).toBe(false);
      expect(compared[0].delta).toBe(0);
      expect(compared[1].delta).toBe(0);
    });

    it('computes correct delta for 3+ models', () => {
      const results = [
        { model: 'model-a', rawScore: 70, normalizedScore: 70 },
        { model: 'model-b', rawScore: 85, normalizedScore: 85 },
        { model: 'model-c', rawScore: 92, normalizedScore: 92 },
      ];
      const taskId = 'task-1';
      const compared = compareModels(results, taskId);
      expect(compared[0].delta).toBe(-22);
      expect(compared[1].delta).toBe(-7);
      expect(compared[2].delta).toBe(0);
      expect(compared[2].winner).toBe(true);
    });
  });

  describe('rankModels', () => {
    it('assigns rank 1 to highest score', () => {
      const scores = [
        { model: 'model-a', normalizedScore: 70 },
        { model: 'model-b', normalizedScore: 92 },
        { model: 'model-c', normalizedScore: 85 },
      ];
      const ranked = rankModels(scores);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[0].model).toBe('model-b');
      expect(ranked[1].rank).toBe(2);
      expect(ranked[2].rank).toBe(3);
    });

    it('handles ties with same rank', () => {
      const scores = [
        { model: 'model-a', normalizedScore: 85 },
        { model: 'model-b', normalizedScore: 85 },
        { model: 'model-c', normalizedScore: 70 },
      ];
      const ranked = rankModels(scores);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].rank).toBe(1);
      expect(ranked[2].rank).toBe(3);
    });
  });
});