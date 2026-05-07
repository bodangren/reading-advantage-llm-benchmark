import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as runsHandler } from '../../../app/api/runs/route';
import { GET as runsIdHandler } from '../../../app/api/runs/[id]/route';
import { GET as leaderboardHandler } from '../../../app/api/leaderboard/route';
import { GET as tasksHandler } from '../../../app/api/tasks/route';
import { GET as tasksIdHandler } from '../../../app/api/tasks/[id]/route';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/lib/runs', () => ({
  getAllRuns: vi.fn(),
  getRunById: vi.fn(),
}));

vi.mock('@/lib/data', () => ({
  getTasks: vi.fn(),
  getTaskById: vi.fn(),
}));

  vi.mock('@/lib/api-auth', () => ({
  validateAuth: vi.fn().mockReturnValue({ allowed: true }),
  authResponse: vi.fn().mockImplementation((error: string, status: number) => {
    return new NextResponse(JSON.stringify({ error }), { status });
  }),
}));

import { getAllRuns, getRunById } from '@/lib/runs';
import { getTasks, getTaskById } from '@/lib/data';
import { validateAuth } from '@/lib/api-auth';

const mockRuns = [
  {
    id: 'run-1',
    model: 'gpt-4o',
    provider: 'openai',
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
    provider: 'openai',
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
    provider: 'anthropic',
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(3);
      expect(data.runs).toHaveLength(3);
    });

    it('should filter runs by model', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs?model=gpt-4o');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.runs.every((r: { model: string }) => r.model === 'gpt-4o')).toBe(true);
    });

    it('should filter runs by score range', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/leaderboard');
      const response = await leaderboardHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.leaderboard[0].model).toBe('claude-3');
      expect(data.leaderboard[0].meanScore).toBeCloseTo(0.90, 2);
    });

    it('should filter leaderboard by provider', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/leaderboard?provider=openai');
      const response = await leaderboardHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(1);
      expect(data.leaderboard[0].model).toBe('gpt-4o');
    });
  });

  describe('GET /api/runs/[id]', () => {
    it('should return a single run by id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getRunById).mockResolvedValue(mockRuns[0] as any);

      const request = new NextRequest('http://localhost/api/runs/run-1');
      const response = await runsIdHandler(request, { params: Promise.resolve({ id: 'run-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('run-1');
      expect(data.model).toBe('gpt-4o');
    });

    it('should return 404 for non-existent run', async () => {
      vi.mocked(getRunById).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/runs/non-existent');
      const response = await runsIdHandler(request, { params: Promise.resolve({ id: 'non-existent' }) });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/runs pagination', () => {
    it('should paginate runs with limit and offset', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs?limit=2&offset=0');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.runs).toHaveLength(2);
      expect(data.total).toBe(3);
      expect(data.limit).toBe(2);
      expect(data.offset).toBe(0);
    });

    it('should return empty array when offset exceeds data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getAllRuns).mockResolvedValue(mockRuns as any);

      const request = new NextRequest('http://localhost/api/runs?limit=10&offset=100');
      const response = await runsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.runs).toHaveLength(0);
    });
  });

  describe('GET /api/tasks', () => {
    const mockTasks = [
      { id: 'task-1', title: 'Task 1', difficulty: 'easy', description: 'Desc 1', version: '1.0', status: 'published' as const },
      { id: 'task-2', title: 'Task 2', difficulty: 'medium', description: 'Desc 2', version: '1.0', status: 'published' as const },
      { id: 'task-3', title: 'Task 3', difficulty: 'hard', description: 'Desc 3', version: '1.0', status: 'published' as const },
    ];

    it('should return all tasks when no filters provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getTasks).mockResolvedValue(mockTasks as any);

      const request = new NextRequest('http://localhost/api/tasks');
      const response = await tasksHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(3);
      expect(data.tasks).toHaveLength(3);
    });

    it('should filter tasks by difficulty', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getTasks).mockResolvedValue(mockTasks as any);

      const request = new NextRequest('http://localhost/api/tasks?difficulty=medium');
      const response = await tasksHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(1);
      expect(data.tasks[0].id).toBe('task-2');
    });
  });

  describe('GET /api/tasks/[id]', () => {
    const mockTasks = [
      { id: 'task-1', title: 'Task 1', difficulty: 'easy', description: 'Desc 1', version: '1.0', status: 'published' as const },
    ];

    it('should return a single task by id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getTaskById).mockResolvedValue(mockTasks[0] as any);

      const request = new NextRequest('http://localhost/api/tasks/task-1');
      const response = await tasksIdHandler(request, { params: Promise.resolve({ id: 'task-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('task-1');
      expect(data.title).toBe('Task 1');
    });

    it('should return 404 for non-existent task', async () => {
      vi.mocked(getTaskById).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost/api/tasks/non-existent');
      const response = await tasksIdHandler(request, { params: Promise.resolve({ id: 'non-existent' }) });

      expect(response.status).toBe(404);
    });
  });

  describe('Auth Requirements', () => {
    it('should reject requests without valid API key', async () => {
      vi.mocked(validateAuth).mockReturnValueOnce({ allowed: false, error: 'Invalid API key', status: 401 });

      const request = new NextRequest('http://localhost/api/runs');
      const response = await runsHandler(request);

      expect(response.status).toBe(401);
    });

    it('should reject requests that exceed rate limit', async () => {
      vi.mocked(validateAuth).mockReturnValueOnce({ allowed: false, error: 'Rate limit exceeded', status: 429 });

      const request = new NextRequest('http://localhost/api/runs');
      const response = await runsHandler(request);

      expect(response.status).toBe(429);
    });
  });
});