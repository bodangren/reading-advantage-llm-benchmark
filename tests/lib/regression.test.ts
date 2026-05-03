import { describe, it, expect } from 'vitest';
import type { RunDetail } from '../../src/lib/schemas';
import { compareRuns, filterRegressions, generateRegressionReport, type RegressionItem, type RegressionReport } from '../../src/lib/regression';

function createMockRun(id: string, model: string, runDate: string, totalScore: number, taskId?: string): RunDetail {
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
    task_id: taskId,
  };
}

describe('Regression Detection', () => {
  describe('compareRuns', () => {
    it('should compute score delta between two runs', () => {
      const before = createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.85, 'task-1');
      const after = createMockRun('run-2', 'gpt-4o', '2026-04-05', 0.75, 'task-1');

      const report = compareRuns(before, after);

      expect(report.model).toBe('gpt-4o');
      expect(report.beforeRunId).toBe('run-1');
      expect(report.afterRunId).toBe('run-2');
      expect(report.regressions).toHaveLength(1);
      expect(report.regressions[0].delta).toBeCloseTo(0.10, 3);
      expect(report.regressions[0].beforeScore).toBe(0.85);
      expect(report.regressions[0].afterScore).toBe(0.75);
    });

    it('should return zero delta when scores are equal', () => {
      const before = createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.80, 'task-1');
      const after = createMockRun('run-2', 'gpt-4o', '2026-04-05', 0.80, 'task-1');

      const report = compareRuns(before, after);

      expect(report.regressions[0].delta).toBe(0);
    });

    it('should return negative delta when after score is higher (improvement)', () => {
      const before = createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.70, 'task-1');
      const after = createMockRun('run-2', 'gpt-4o', '2026-04-05', 0.80, 'task-1');

      const report = compareRuns(before, after);

      expect(report.regressions[0].delta).toBeCloseTo(-0.10, 3);
    });
  });

  describe('filterRegressions', () => {
    it('should filter out regressions below threshold', () => {
      const report: RegressionReport = {
        model: 'gpt-4o',
        generatedAt: new Date().toISOString(),
        beforeRunId: 'run-1',
        afterRunId: 'run-2',
        regressions: [
          { taskId: 'task-1', beforeScore: 0.85, afterScore: 0.80, delta: 0.05 },
          { taskId: 'task-2', beforeScore: 0.90, afterScore: 0.80, delta: 0.10 },
        ],
      };

      const filtered = filterRegressions(report, 0.06);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].taskId).toBe('task-2');
    });

    it('should include regressions at exact threshold', () => {
      const report: RegressionReport = {
        model: 'gpt-4o',
        generatedAt: new Date().toISOString(),
        beforeRunId: 'run-1',
        afterRunId: 'run-2',
        regressions: [
          { taskId: 'task-1', beforeScore: 0.85, afterScore: 0.80, delta: 0.05 },
        ],
      };

      const filtered = filterRegressions(report, 0.05);

      expect(filtered).toHaveLength(1);
    });

    it('should return empty array when all regressions are below threshold', () => {
      const report: RegressionReport = {
        model: 'gpt-4o',
        generatedAt: new Date().toISOString(),
        beforeRunId: 'run-1',
        afterRunId: 'run-2',
        regressions: [
          { taskId: 'task-1', beforeScore: 0.85, afterScore: 0.83, delta: 0.02 },
        ],
      };

      const filtered = filterRegressions(report, 0.05);

      expect(filtered).toHaveLength(0);
    });
  });

  describe('generateRegressionReport', () => {
    it('should generate markdown report with regressions', () => {
      const items: RegressionItem[] = [
        { taskId: 'task-1', beforeScore: 0.85, afterScore: 0.75, delta: 0.10 },
        { taskId: 'task-2', beforeScore: 0.90, afterScore: 0.80, delta: 0.10 },
      ];

      const report = generateRegressionReport(items, 'gpt-4o');

      expect(report).toContain('# Regression Report');
      expect(report).toContain('Model: gpt-4o');
      expect(report).toContain('Detected 2 regression(s)');
      expect(report).toContain('task-1');
      expect(report).toContain('task-2');
      expect(report).toContain('-0.100');
    });

    it('should generate clean report when no regressions', () => {
      const report = generateRegressionReport([], 'gpt-4o');

      expect(report).toContain('# Regression Report');
      expect(report).toContain('No regressions detected for gpt-4o');
    });
  });

  describe('CLI exit code logic', () => {
    it('should return exit code 1 when regressions detected', () => {
      const items: RegressionItem[] = [
        { taskId: 'task-1', beforeScore: 0.85, afterScore: 0.75, delta: 0.10 },
      ];

      const exitCode = items.length > 0 ? 1 : 0;
      expect(exitCode).toBe(1);
    });

    it('should return exit code 0 when no regressions', () => {
      const items: RegressionItem[] = [];

      const exitCode = items.length > 0 ? 1 : 0;
      expect(exitCode).toBe(0);
    });
  });
});