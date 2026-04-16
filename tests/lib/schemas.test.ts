import { describe, it, expect } from 'vitest';
import { TaskSchema, RunSchema, LeaderboardSchema, DatasetVersionSchema } from '../../src/lib/schemas';

describe('Zod Schemas', () => {
  describe('TaskSchema', () => {
    it('should validate a valid task', () => {
      const validTask = {
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'A test task',
        rubric: ['Pass if it works', 'Fails if it crashes'],
        version: '1.0.0',
      };
      const result = TaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should fail if missing required fields', () => {
      const invalidTask = {
        id: 'task-1',
      };
      const result = TaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('RunSchema', () => {
    it('should validate a valid run', () => {
      const validRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        score: 0.95,
      };
      const result = RunSchema.safeParse(validRun);
      expect(result.success).toBe(true);
    });

    it('should validate a run with dataset_version', () => {
      const validRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.95,
      };
      const result = RunSchema.safeParse(validRun);
      expect(result.success).toBe(true);
    });

    it('should fail if score is invalid', () => {
      const invalidRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        score: 'not-a-number',
      };
      const result = RunSchema.safeParse(invalidRun);
      expect(result.success).toBe(false);
    });
  });

  describe('LeaderboardSchema', () => {
    it('should validate a valid leaderboard entry', () => {
      const validEntry = {
        model: 'gemini-pro',
        provider: 'Google',
        harness: 'opencode',
        score: 0.85,
        subscores: { functional: 10 },
        date: '2026-04-04'
      };
      const result = LeaderboardSchema.safeParse(validEntry);
      if (!result.success) console.log(result.error);
      expect(result.success).toBe(true);
    });
  });

  describe('DatasetVersionSchema', () => {
    it('should validate a valid dataset version', () => {
      const validDataset = {
        version: '2026-04-07',
        created_at: '2026-04-07T12:00:00Z',
        description: 'Initial dataset',
        tasks: ['task-1', 'task-2'],
      };
      const result = DatasetVersionSchema.safeParse(validDataset);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid version format', () => {
      const invalidDataset = {
        version: '1.0.0',
        created_at: '2026-04-07T12:00:00Z',
        description: 'Invalid version format',
        tasks: ['task-1'],
      };
      const result = DatasetVersionSchema.safeParse(invalidDataset);
      expect(result.success).toBe(false);
    });

    it('should fail for missing required fields', () => {
      const invalidDataset = {
        version: '2026-04-07',
      };
      const result = DatasetVersionSchema.safeParse(invalidDataset);
      expect(result.success).toBe(false);
    });
  });
});