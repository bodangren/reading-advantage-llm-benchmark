import { describe, it, expect } from 'vitest';
import {
  aggregateLeaderboardEntries,
  aggregateByModel,
  getAverageScore,
  getBestScore,
  formatLeaderboardSummary,
} from '../../../src/lib/pipeline/aggregation';
import { PipelineResult } from '../../../src/lib/pipeline';

describe('Pipeline Aggregation', () => {
  const mockPipelineResult: PipelineResult = {
    pipeline_version: '1.0.0',
    dataset_version: '2026-04-23',
    started_at: '2026-04-23T10:00:00Z',
    completed_at: '2026-04-23T10:05:00Z',
    status: 'success',
    model_results: [
      {
        model_id: 'gemini-2.5-pro',
        provider: 'google',
        status: 'success',
        run: {
          id: 'run-1',
          model: 'gemini-2.5-pro',
          provider: 'google',
          harness: 'opencode',
          benchmark_version: '1.0.0',
          dataset_version: '2026-04-23',
          score: 0.92,
          subscores: { functional: 0.95, performance: 0.89 },
          date: '2026-04-23T10:02:00Z',
        },
      },
      {
        model_id: 'gpt-5',
        provider: 'openai',
        status: 'success',
        run: {
          id: 'run-2',
          model: 'gpt-5',
          provider: 'openai',
          harness: 'opencode',
          benchmark_version: '1.0.0',
          dataset_version: '2026-04-23',
          score: 0.88,
          date: '2026-04-23T10:03:00Z',
        },
      },
      {
        model_id: 'claude-4',
        provider: 'anthropic',
        status: 'failed',
        error: 'API error',
      },
      {
        model_id: 'disabled-model',
        status: 'skipped',
      },
    ],
  };

  describe('aggregateLeaderboardEntries', () => {
    it('should aggregate successful runs to leaderboard entries', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);

      expect(entries).toHaveLength(2);
    });

    it('should map run data to leaderboard entry fields correctly', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);
      const geminiEntry = entries.find(e => e.model === 'gemini-2.5-pro');

      expect(geminiEntry).toBeDefined();
      expect(geminiEntry!.model).toBe('gemini-2.5-pro');
      expect(geminiEntry!.provider).toBe('google');
      expect(geminiEntry!.harness).toBe('opencode');
      expect(geminiEntry!.score).toBe(0.92);
      expect(geminiEntry!.subscores).toEqual({ functional: 0.95, performance: 0.89 });
      expect(geminiEntry!.dataset_version).toBe('2026-04-23');
    });

    it('should exclude failed runs', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);
      const failedEntry = entries.find(e => e.model === 'claude-4');

      expect(failedEntry).toBeUndefined();
    });

    it('should exclude skipped runs', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);
      const skippedEntry = entries.find(e => e.model === 'disabled-model');

      expect(skippedEntry).toBeUndefined();
    });

    it('should handle empty pipeline result', () => {
      const emptyResult: PipelineResult = {
        pipeline_version: '1.0.0',
        dataset_version: '2026-04-23',
        started_at: '2026-04-23T10:00:00Z',
        completed_at: '2026-04-23T10:05:00Z',
        status: 'failed',
        model_results: [],
        error: 'No models to evaluate',
      };

      const entries = aggregateLeaderboardEntries(emptyResult);
      expect(entries).toHaveLength(0);
    });

    it('should use provider from model result if run does not have it', () => {
      const resultWithOnlyModelProvider: PipelineResult = {
        ...mockPipelineResult,
        model_results: [
          {
            model_id: 'test-model',
            provider: 'test-provider',
            status: 'success',
            run: {
              id: 'run-1',
              model: 'test-model',
              harness: 'opencode',
              benchmark_version: '1.0.0',
              dataset_version: '2026-04-23',
              score: 0.85,
            },
          },
        ],
      };

      const entries = aggregateLeaderboardEntries(resultWithOnlyModelProvider);
      expect(entries[0].provider).toBe('test-provider');
    });
  });

  describe('aggregateByModel', () => {
    it('should group entries by model', () => {
      const resultWithMultipleRuns: PipelineResult = {
        ...mockPipelineResult,
        model_results: [
          {
            model_id: 'gemini-2.5-pro',
            provider: 'google',
            status: 'success',
            run: {
              id: 'run-1',
              model: 'gemini-2.5-pro',
              harness: 'opencode',
              benchmark_version: '1.0.0',
              dataset_version: '2026-04-23',
              score: 0.92,
            },
          },
          {
            model_id: 'gemini-2.5-pro',
            provider: 'google',
            status: 'success',
            run: {
              id: 'run-2',
              model: 'gemini-2.5-pro',
              harness: 'opencode',
              benchmark_version: '1.0.0',
              dataset_version: '2026-04-23',
              score: 0.88,
            },
          },
        ],
      };

      const byModel = aggregateByModel(resultWithMultipleRuns);

      expect(byModel.get('gemini-2.5-pro')).toHaveLength(2);
    });
  });

  describe('getAverageScore', () => {
    it('should calculate average score correctly', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);
      const avg = getAverageScore(entries);

      expect(avg).toBeCloseTo(0.9);
    });

    it('should return null for empty entries', () => {
      const avg = getAverageScore([]);
      expect(avg).toBeNull();
    });
  });

  describe('getBestScore', () => {
    it('should return the entry with highest score', () => {
      const entries = aggregateLeaderboardEntries(mockPipelineResult);
      const best = getBestScore(entries);

      expect(best!.model).toBe('gemini-2.5-pro');
      expect(best!.score).toBe(0.92);
    });

    it('should return null for empty entries', () => {
      const best = getBestScore([]);
      expect(best).toBeNull();
    });
  });

  describe('formatLeaderboardSummary', () => {
    it('should format summary correctly', () => {
      const summary = formatLeaderboardSummary(mockPipelineResult);

      expect(summary.total_models).toBe(4);
      expect(summary.successful_runs).toBe(2);
      expect(summary.failed_runs).toBe(1);
      expect(summary.skipped_runs).toBe(1);
      expect(summary.aggregated_entries).toBe(2);
      expect(summary.dataset_version).toBe('2026-04-23');
    });
  });
});