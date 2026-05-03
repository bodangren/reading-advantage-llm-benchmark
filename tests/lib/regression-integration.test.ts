import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compareRuns, filterRegressions, generateRegressionReport } from '../../src/lib/regression';
import type { RunDetail } from '../../src/lib/schemas';

function createMockRun(id: string, model: string, runDate: string, totalScore: number): RunDetail {
  return {
    id,
    model,
    harness: 'opencode',
    harness_version: '1.0.0',
    benchmark_version: '1.0',
    run_date: runDate,
    wall_time_seconds: 100,
    total_score: totalScore,
    scores: {
      functional_correctness: Math.round(totalScore * 40),
      integration_quality: Math.round(totalScore * 25),
      regression_safety: Math.round(totalScore * 20),
      minimality: Math.round(totalScore * 10),
      process_quality: Math.round(totalScore * 5),
    },
    test_results: [],
    artifacts: [],
    task_id: 'test-task',
  };
}

describe('Regression CLI Integration Tests', () => {
  describe('asf benchmark regress flow', () => {
    it('computes regression between two runs and generates report', () => {
      const beforeRun = createMockRun('run-before', 'gpt-4o', '2026-04-01', 0.85);
      const afterRun = createMockRun('run-after', 'gpt-4o', '2026-04-05', 0.75);

      const report = compareRuns(beforeRun, afterRun);
      const threshold = 0.05;
      const filtered = filterRegressions(report, threshold);
      const markdown = generateRegressionReport(filtered, 'gpt-4o');

      expect(filtered).toHaveLength(1);
      expect(filtered[0].delta).toBeCloseTo(0.10, 3);
      expect(markdown).toContain('# Regression Report');
      expect(markdown).toContain('Detected 1 regression(s)');
      expect(markdown).toContain('gpt-4o');
    });

    it('returns exit code 1 when regressions detected', () => {
      const beforeRun = createMockRun('run-before', 'gpt-4o', '2026-04-01', 0.85);
      const afterRun = createMockRun('run-after', 'gpt-4o', '2026-04-05', 0.75);

      const report = compareRuns(beforeRun, afterRun);
      const threshold = 0.05;
      const filtered = filterRegressions(report, threshold);

      const exitCode = filtered.length > 0 ? 1 : 0;
      expect(exitCode).toBe(1);
    });

    it('returns exit code 0 when no regressions', () => {
      const beforeRun = createMockRun('run-before', 'gpt-4o', '2026-04-01', 0.75);
      const afterRun = createMockRun('run-after', 'gpt-4o', '2026-04-05', 0.85);

      const report = compareRuns(beforeRun, afterRun);
      const threshold = 0.05;
      const filtered = filterRegressions(report, threshold);

      const exitCode = filtered.length > 0 ? 1 : 0;
      expect(exitCode).toBe(0);
    });

    it('respects threshold when filtering regressions', () => {
      const beforeRun = createMockRun('run-before', 'gpt-4o', '2026-04-01', 0.82);
      const afterRun = createMockRun('run-after', 'gpt-4o', '2026-04-05', 0.80);

      const report = compareRuns(beforeRun, afterRun);
      const threshold = 0.05;
      const filtered = filterRegressions(report, threshold);

      expect(filtered).toHaveLength(0);
      const exitCode = filtered.length > 0 ? 1 : 0;
      expect(exitCode).toBe(0);
    });

    it('generates clean report markdown when no regressions', () => {
      const beforeRun = createMockRun('run-before', 'gpt-4o', '2026-04-01', 0.75);
      const afterRun = createMockRun('run-after', 'gpt-4o', '2026-04-05', 0.80);

      const report = compareRuns(beforeRun, afterRun);
      const threshold = 0.05;
      const filtered = filterRegressions(report, threshold);
      const markdown = generateRegressionReport(filtered, 'gpt-4o');

      expect(markdown).toContain('No regressions detected');
    });

    it('handles multiple tasks in a run comparison', () => {
      const beforeRuns: RunDetail[] = [
        createMockRun('run-before-1', 'gpt-4o', '2026-04-01', 0.90),
        createMockRun('run-before-2', 'claude-3', '2026-04-01', 0.85),
      ];
      const afterRuns: RunDetail[] = [
        createMockRun('run-after-1', 'gpt-4o', '2026-04-05', 0.80),
        createMockRun('run-after-2', 'claude-3', '2026-04-05', 0.83),
      ];

      for (let i = 0; i < beforeRuns.length; i++) {
        const report = compareRuns(beforeRuns[i], afterRuns[i]);
        const threshold = 0.03;
        const filtered = filterRegressions(report, threshold);

        if (i === 0) {
          expect(filtered.length).toBeGreaterThan(0);
        }
      }
    });
  });
});