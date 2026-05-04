import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { listCandidates, saveCandidateTasks, updateCandidateStatus } from '../../src/lib/candidate-storage';
import { TaskSpec } from '../../src/lib/task-generator';
import fs from 'fs';

describe('Review CLI', () => {
  const testDir = '/tmp/test-review-cli';

  const createTask = (id: string, difficulty: string = 'medium'): TaskSpec => ({
    id,
    title: `Task ${id}`,
    difficulty,
    description: `Description for ${id}`,
    generatedBy: 'test-model',
    generationPrompt: 'test prompt',
    version: '1.0.0',
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('listCandidates', () => {
    it('should list all candidates with their status', async () => {
      await saveCandidateTasks([createTask('task1'), createTask('task2')], { candidatesDir: testDir });

      const candidates = await listCandidates({ candidatesDir: testDir });

      expect(candidates).toHaveLength(2);
      expect(candidates.every(c => c.status === 'pending')).toBe(true);
    });

    it('should filter candidates by status', async () => {
      const task1 = createTask('task1');
      const task2 = createTask('task2');
      await saveCandidateTasks([task1, task2], { candidatesDir: testDir });
      await updateCandidateStatus('task1', 'approved', { candidatesDir: testDir });

      const pending = await listCandidates({ candidatesDir: testDir, status: 'pending' });
      const approved = await listCandidates({ candidatesDir: testDir, status: 'approved' });

      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe('task2');
      expect(approved).toHaveLength(1);
      expect(approved[0].id).toBe('task1');
    });

    it('should return empty array when no candidates exist', async () => {
      const candidates = await listCandidates({ candidatesDir: testDir });
      expect(candidates).toHaveLength(0);
    });

    it('should include all required display fields', async () => {
      await saveCandidateTasks([createTask('display_task')], { candidatesDir: testDir });

      const candidates = await listCandidates({ candidatesDir: testDir });

      expect(candidates[0]).toHaveProperty('id');
      expect(candidates[0]).toHaveProperty('status');
      expect(candidates[0]).toHaveProperty('task');
      expect(candidates[0].task).toHaveProperty('title');
      expect(candidates[0].task).toHaveProperty('difficulty');
    });
  });

  describe('updateCandidateStatus', () => {
    it('should update status to approved', async () => {
      await saveCandidateTasks([createTask('approve_test')], { candidatesDir: testDir });

      const updated = await updateCandidateStatus('approve_test', 'approved', { candidatesDir: testDir });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('approved');
    });

    it('should update status to rejected', async () => {
      await saveCandidateTasks([createTask('reject_test')], { candidatesDir: testDir });

      const updated = await updateCandidateStatus('reject_test', 'rejected', { candidatesDir: testDir });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('rejected');
    });

    it('should return null for non-existent task', async () => {
      const updated = await updateCandidateStatus('non_existent', 'approved', { candidatesDir: testDir });
      expect(updated).toBeNull();
    });

    it('should preserve other candidate fields when updating status', async () => {
      await saveCandidateTasks([createTask('preserve_test')], { candidatesDir: testDir });

      const updated = await updateCandidateStatus('preserve_test', 'approved', { candidatesDir: testDir });

      expect(updated!.id).toBe('preserve_test');
      expect(updated!.task.title).toBe('Task preserve_test');
      expect(updated!.createdAt).toBeDefined();
      expect(updated!.updatedAt).toBeDefined();
    });
  });
});