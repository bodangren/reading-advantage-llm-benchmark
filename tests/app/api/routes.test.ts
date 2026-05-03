import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as runsHandler } from '../../../app/api/runs/route';
import { GET as leaderboardHandler } from '../../../app/api/leaderboard/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/runs', () => ({
  getAllRuns: vi.fn(),
}));

import { getAllRuns } from '@/lib/runs';

const mockRuns = [
  {
    id: 'run-1',
    model: 'gpt-4o',
    harness: 'opencode',
    harness_version: '1.0.0',
    benchmark_version: '1.0',
    run_date: '2026-04-01',
    wall_time_seconds: 100,
    total_score: 0.85,
    scores: {
      functional_correctness: 34,
      integration_quality: 21,
      regression_safety: 17,
      minimality: 8,
      process_quality: 4,
    },
    test_results: [],
    artifacts: [],
  },
  {
    id: 'run-2',
    model: 'gpt-4o',
    harness: 'opencode',
    harness_version: '1.0.0',
    benchmark_version: '1.0',
    run_date: '2026-04-05',
    wall_time_seconds: 120,
    total_score: 0.75,
    scores: {
      functional_correctness: 30,
      integration_quality: 19,
      regression_safety: 15,
      minimality: 7,
      process_quality: 4,
    },
    test_results: [],
    artifacts: [],
  },
  {
    id: 'run-3',
    model: 'claude-3',
    harness: 'opencode',
    harness_version: '1.0.0',
    benchmark_version: '1.0',
    run_date: '2026-04-03',
    wall_time_seconds: 90,
    total_score: 0.90,
    scores: {
      functional_correctness: 36,
      integration_quality: 22,
      regression_safety: 18,
      minimality: 9,
      process_quality: 5,
    },
    test_results: [],
    artifacts: [],
  },
];

describe('API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/runs', () => {
    it('should return all runs when no filters provided', async () => {
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(3);
      expect(data.runs).toHaveLength(3);
    });

    it('should filter runs by model', async () => {
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs?model=gpt-4o');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.runs.every((r: any) => r.model === 'gpt-4o')).toBe(true);
    });

    it('should filter runs by score range', async () => {
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs?minScore=0.80&maxScore=0.95');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
    });
  });

  describe('GET /api/leaderboard', () => {
    it('should return leaderboard with stats sorted by mean score', async () => {
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const response = await leaderboardHandler();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.leaderboard[0].model).toBe('claude-3');
      expect(data.leaderboard[0].meanScore).toBeCloseTo(0.90, 2);
    });
  });
});