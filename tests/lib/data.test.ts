import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import { getTasks, getTaskById, getRuns, getRunById, getLeaderboard } from '../../src/lib/data';

vi.mock('fs/promises');

describe('Data Utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getTasks', () => {
    it('should read directory, parse, and validate tasks', async () => {
      const mockTasks = [{
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'Desc',
        rubric: ['Rubric line 1'],
        version: '1.0',
      }];
      vi.mocked(fs.readdir).mockResolvedValueOnce(['task1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockTasks));

      const tasks = await getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe('task-1');
    });

    it('should return empty array on invalid json', async () => {
      vi.mocked(fs.readdir).mockResolvedValueOnce(['task1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce('invalid-json');
      const tasks = await getTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return task if found', async () => {
      const mockTasks = [{
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'Desc',
        rubric: ['Rubric line'],
        version: '1.0',
      }];
      vi.mocked(fs.readdir).mockResolvedValueOnce(['task1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockTasks));
      
      const task = await getTaskById('task-1');
      expect(task?.id).toBe('task-1');
    });

    it('should return undefined if not found', async () => {
      vi.mocked(fs.readdir).mockResolvedValueOnce(['task1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce('[]');
      const task = await getTaskById('task-not-found');
      expect(task).toBeUndefined();
    });
  });

  describe('getRuns', () => {
    it('should read directory, parse, and validate runs', async () => {
      const mockRuns = [{
        id: 'run-1',
        model: 'gemini',
        harness: 'opencode',
        benchmark_version: '1.0',
        score: 0.9,
      }];
      vi.mocked(fs.readdir).mockResolvedValueOnce(['run1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRuns));

      const runs = await getRuns();
      expect(runs).toHaveLength(1);
      expect(runs[0].id).toBe('run-1');
    });
  });

  describe('getRunById', () => {
    it('should return run if found', async () => {
      const mockRuns = [{
        id: 'run-1',
        model: 'gemini',
        harness: 'opencode',
        benchmark_version: '1.0',
        score: 0.9,
      }];
      vi.mocked(fs.readdir).mockResolvedValueOnce(['run1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRuns));
      
      const run = await getRunById('run-1');
      expect(run?.id).toBe('run-1');
    });
  });

  describe('getLeaderboard', () => {
    it('should read directory, parse, and validate leaderboard', async () => {
      const mockBoard = {
        benchmark_version: "1.0",
        entries: [{
          model: 'gemini',
          score: 0.9,
        }]
      };
      vi.mocked(fs.readdir).mockResolvedValueOnce(['board1.json'] as any);
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockBoard));

      const board = await getLeaderboard();
      expect(board).toHaveLength(1);
      expect(board[0].model).toBe('gemini');
    });
  });
});