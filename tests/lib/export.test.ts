import { describe, it, expect } from 'vitest';
import type { RunDetail } from '../../src/lib/schemas';
import { filterRuns, computeStats, exportToCSV, type QueryFilters } from '../../src/lib/export';

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

describe('Query Filtering', () => {
  const runs: RunDetail[] = [
    createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.85, 'task-1'),
    createMockRun('run-2', 'gpt-4o', '2026-04-05', 0.75, 'task-2'),
    createMockRun('run-3', 'claude-3', '2026-04-01', 0.90, 'task-1'),
    createMockRun('run-4', 'claude-3', '2026-04-10', 0.88, 'task-3'),
    createMockRun('run-5', 'gpt-4o', '2026-03-01', 0.70, 'task-1'),
  ];

  it('should filter by model', () => {
    const filters: QueryFilters = { model: 'gpt-4o' };
    const filtered = filterRuns(runs, filters);
    expect(filtered).toHaveLength(3);
    expect(filtered.every(r => r.model === 'gpt-4o')).toBe(true);
  });

  it('should filter by task', () => {
    const filters: QueryFilters = { task: 'task-1' };
    const filtered = filterRuns(runs, filters);
    expect(filtered).toHaveLength(3);
    expect(filtered.every(r => r.task_id === 'task-1')).toBe(true);
  });

  it('should filter by date range', () => {
    const filters: QueryFilters = {
      startDate: '2026-04-01',
      endDate: '2026-04-05',
    };
    const filtered = filterRuns(runs, filters);
    expect(filtered).toHaveLength(3);
  });

  it('should filter by score range', () => {
    const filters: QueryFilters = {
      minScore: 0.80,
      maxScore: 0.90,
    };
    const filtered = filterRuns(runs, filters);
    expect(filtered).toHaveLength(3);
    expect(filtered.every(r => r.total_score >= 0.80 && r.total_score <= 0.90)).toBe(true);
  });

  it('should combine multiple filters', () => {
    const filters: QueryFilters = {
      model: 'gpt-4o',
      minScore: 0.75,
    };
    const filtered = filterRuns(runs, filters);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(r => r.model === 'gpt-4o' && r.total_score >= 0.75)).toBe(true);
  });

  it('should return all runs when no filters provided', () => {
    const filtered = filterRuns(runs, {});
    expect(filtered).toHaveLength(runs.length);
  });
});

describe('Summary Statistics', () => {
  it('should compute mean correctly', () => {
    const scores = [0.80, 0.85, 0.90, 0.75];
    const stats = computeStats(scores);
    expect(stats.mean).toBeCloseTo(0.825, 3);
  });

  it('should compute median correctly for odd count', () => {
    const scores = [0.80, 0.90, 0.70];
    const stats = computeStats(scores);
    expect(stats.median).toBeCloseTo(0.80, 3);
  });

  it('should compute median correctly for even count', () => {
    const scores = [0.80, 0.90, 0.70, 0.85];
    const stats = computeStats(scores);
    expect(stats.median).toBeCloseTo(0.825, 3);
  });

  it('should compute p95 correctly', () => {
    const scores = Array.from({ length: 100 }, (_, i) => i / 100);
    const stats = computeStats(scores);
    expect(stats.p95).toBeCloseTo(0.94, 2);
  });

  it('should handle single score', () => {
    const scores = [0.85];
    const stats = computeStats(scores);
    expect(stats.mean).toBe(stats.median);
    expect(stats.p95).toBe(0.85);
  });
});

describe('CSV Export', () => {
  const runs: RunDetail[] = [
    createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.85, 'task-1'),
    createMockRun('run-2', 'gpt-4o', '2026-04-05', 0.75, 'task-2'),
  ];

  it('should generate valid CSV with headers', () => {
    const csv = exportToCSV(runs);
    const lines = csv.split('\n');
    expect(lines[0]).toContain('id');
    expect(lines[0]).toContain('model');
    expect(lines[0]).toContain('total_score');
  });

  it('should include all run data rows', () => {
    const csv = exportToCSV(runs);
    const lines = csv.split('\n').filter(l => l.length > 0);
    expect(lines.length).toBe(runs.length + 1);
  });

  it('should escape CSV special characters', () => {
    const runsWithSpecial: RunDetail[] = [
      { ...createMockRun('run-1', 'gpt-4o', '2026-04-01', 0.85), model: 'gpt-4o, mini' },
    ];
    const csv = exportToCSV(runsWithSpecial);
    expect(csv).toContain('"gpt-4o, mini"');
  });

  it('should handle empty array', () => {
    const csv = exportToCSV([]);
    const lines = csv.split('\n').filter(l => l.length > 0);
    expect(lines.length).toBe(1);
    expect(lines[0]).toContain('id');
  });
});