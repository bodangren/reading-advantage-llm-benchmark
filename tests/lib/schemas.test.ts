import { describe, it, expect } from 'vitest';
import { TaskSchema, RunSchema, LeaderboardSchema } from '../../src/lib/schemas';

describe('Zod Schemas', () => {
  describe('TaskSchema', () => {
    it('should validate a valid task', () => {
      const validTask = {
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'A test task',
        rubric: 'Pass if it works',
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

    it('should fail if score is invalid', () => {
      const invalidRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        score: 'not-a-number', // score should be number
      };
      const result = RunSchema.safeParse(invalidRun);
      expect(result.success).toBe(false);
    });
  });

  describe('LeaderboardSchema', () => {
    it('should validate a valid leaderboard entry', () => {
      // Assuming a leaderboard entry ties a model to its overall score or rank.
      const validEntry = {
        model: 'gemini-pro',
        averageScore: 0.85,
        totalRuns: 100,
      };
      const result = LeaderboardSchema.safeParse(validEntry);
      expect(result.success).toBe(true);
    });
  });
});