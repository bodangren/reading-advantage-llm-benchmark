import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import { getAllRuns, getRunById, validateRun } from '../../src/lib/runs';

vi.mock('fs/promises');

describe('Runs Data Utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllRuns', () => {
    it('should read directory, parse, and validate runs', async () => {
      const mockRun = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        provider: 'OpenAI',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        dataset_version: '2026-04-07',
        task_id: 'task_import_game_v1',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        diff: '--- a/src/import_game.ts',
        test_results: [],
        artifacts: []
      };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['blb-run-001.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRun));

      const runs = await getAllRuns();
      expect(runs).toHaveLength(1);
      expect(runs[0].id).toBe('blb-run-001');
      expect(runs[0].total_score).toBe(0.82);
    });

    it('should return empty array on directory read error', async () => {
      vi.mocked(fs.readdir).mockRejectedValueOnce(new Error('Directory not found'));
      const runs = await getAllRuns();
      expect(runs).toEqual([]);
    });

    it('should return empty array when no valid runs found', async () => {
      vi.mocked(fs.readdir).mockResolvedValueOnce(['invalid.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile).mockResolvedValueOnce('invalid-json');
      const runs = await getAllRuns();
      expect(runs).toEqual([]);
    });

    it('should filter out runs with invalid schema', async () => {
      const validRun = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        test_results: [],
        artifacts: []
      };
      const invalidRun = { id: 'invalid-run' };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['valid.json', 'invalid.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(validRun))
        .mockResolvedValueOnce(JSON.stringify(invalidRun));

      const runs = await getAllRuns();
      expect(runs).toHaveLength(1);
      expect(runs[0].id).toBe('blb-run-001');
    });

    it('should sort runs by run_date descending (newest first)', async () => {
      const olderRun = {
        id: 'run-old',
        model: 'gpt-4',
        harness: 'opencode',
        harness_version: '1.0',
        benchmark_version: '1.0',
        run_date: '2026-04-01T10:00:00Z',
        wall_time_seconds: 100,
        total_score: 0.75,
        scores: {
          functional_correctness: 30,
          integration_quality: 20,
          regression_safety: 15,
          minimality: 7,
          process_quality: 3
        },
        test_results: [],
        artifacts: []
      };
      const newerRun = {
        id: 'run-new',
        model: 'gpt-5',
        harness: 'opencode',
        harness_version: '1.0',
        benchmark_version: '1.0',
        run_date: '2026-04-10T10:00:00Z',
        wall_time_seconds: 100,
        total_score: 0.85,
        scores: {
          functional_correctness: 34,
          integration_quality: 24,
          regression_safety: 17,
          minimality: 7,
          process_quality: 3
        },
        test_results: [],
        artifacts: []
      };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['older.json', 'newer.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(olderRun))
        .mockResolvedValueOnce(JSON.stringify(newerRun));

      const runs = await getAllRuns();
      expect(runs[0].id).toBe('run-new');
      expect(runs[1].id).toBe('run-old');
    });
  });

  describe('getRunById', () => {
    it('should return run if found', async () => {
      const mockRun = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        test_results: [],
        artifacts: []
      };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['blb-run-001.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRun));

      const run = await getRunById('blb-run-001');
      expect(run?.id).toBe('blb-run-001');
      expect(run?.total_score).toBe(0.82);
    });

    it('should return null if run not found', async () => {
      const mockRun = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        test_results: [],
        artifacts: []
      };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['blb-run-001.json'] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRun));

      const run = await getRunById('nonexistent-run');
      expect(run).toBeNull();
    });
  });

  describe('validateRun', () => {
    it('should validate a valid run', () => {
      const validRun = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        test_results: [],
        artifacts: []
      };

      const result = validateRun(validRun);
      expect(result.id).toBe('blb-run-001');
    });

    it('should throw on invalid run', () => {
      const invalidRun = { id: 'invalid' };
      expect(() => validateRun(invalidRun)).toThrow();
    });

    it('should validate run with full test results and artifacts', () => {
      const runWithDetails = {
        id: 'blb-run-001',
        model: 'gpt-5.4',
        harness: 'opencode',
        harness_version: '1.2.0',
        benchmark_version: '1.0',
        run_date: '2026-04-08T14:30:00Z',
        wall_time_seconds: 145.7,
        total_score: 0.82,
        scores: {
          functional_correctness: 32,
          integration_quality: 22,
          regression_safety: 16,
          minimality: 8,
          process_quality: 4
        },
        diff: '--- a/src/file.ts\n+++ b/src/file.ts',
        test_results: [
          {
            suite: 'unit',
            name: 'test should pass',
            status: 'pass',
            duration_ms: 10
          },
          {
            suite: 'unit',
            name: 'test should fail',
            status: 'fail',
            duration_ms: 5,
            error_message: 'Expected true to be false'
          }
        ],
        artifacts: [
          {
            name: 'run_log.txt',
            type: 'log',
            url: '/artifacts/blb-run-001/log.txt',
            size_bytes: 45678
          }
        ]
      };

      const result = validateRun(runWithDetails);
      expect(result.test_results).toHaveLength(2);
      expect(result.artifacts).toHaveLength(1);
      expect(result.diff).toContain('file.ts');
    });
  });
});