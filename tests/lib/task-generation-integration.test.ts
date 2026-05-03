import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateTasks } from '../../src/lib/task-generator';
import { TaskSpec } from '../../src/lib/task-generator';
import { saveCandidateTasks, listCandidates, updateCandidateStatus } from '../../src/lib/candidate-storage';
import fs from 'fs';
import path from 'path';

describe('Task Generation Integration', () => {
  const testDir = '/tmp/test-integration-flow';

  const mockLlmClient = async (prompt: string): Promise<string> => {
    const tasks = [
      {
        id: `integration_task_${Date.now()}_1`,
        title: 'Add Form Validation',
        difficulty: 'easy',
        description: 'Add client-side validation to the contact form with proper error messages.',
        version: '1.0.0',
      },
      {
        id: `integration_task_${Date.now()}_2`,
        title: 'Implement Dark Mode Toggle',
        difficulty: 'medium',
        description: 'Add a dark mode toggle that persists user preference in localStorage.',
        version: '1.0.0',
      },
    ];
    return JSON.stringify(tasks);
  };

  beforeEach(() => {
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

  describe('Full workflow: generate → validate → review → approve', () => {
    it('should complete the full task generation workflow', async () => {
      const repoPath = '/path/to/test/repo';

      const generatedTasks = await generateTasks({
        repoPath,
        count: 2,
        llmClient: mockLlmClient,
        modelId: 'test-integration-model',
      });

      expect(generatedTasks).toHaveLength(2);
      expect(generatedTasks[0].generatedBy).toBe('test-integration-model');
      expect(generatedTasks[0].generationPrompt).toContain(repoPath);

      const candidates = await saveCandidateTasks(generatedTasks, { candidatesDir: testDir });

      expect(candidates).toHaveLength(2);
      expect(candidates.every(c => c.status === 'pending')).toBe(true);

      const pendingCandidates = await listCandidates({ candidatesDir: testDir, status: 'pending' });
      expect(pendingCandidates).toHaveLength(2);

      const taskToApprove = candidates[0];
      const updated = await updateCandidateStatus(taskToApprove.id, 'approved', { candidatesDir: testDir });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('approved');

      const approvedCandidates = await listCandidates({ candidatesDir: testDir, status: 'approved' });
      expect(approvedCandidates).toHaveLength(1);
      expect(approvedCandidates[0].id).toBe(taskToApprove.id);

      const remainingPending = await listCandidates({ candidatesDir: testDir, status: 'pending' });
      expect(remainingPending).toHaveLength(1);
    });

    it('should track generated tasks with metadata', async () => {
      const generatedTasks = await generateTasks({
        repoPath: '/test/repo',
        count: 1,
        llmClient: mockLlmClient,
        modelId: 'metadata-test-model',
      });

      expect(generatedTasks[0].generatedBy).toBe('metadata-test-model');
      expect(generatedTasks[0].generationPrompt).toBeDefined();
      expect(typeof generatedTasks[0].generationPrompt).toBe('string');
      expect(generatedTasks[0].generationPrompt.length).toBeGreaterThan(0);

      const candidates = await saveCandidateTasks(generatedTasks, { candidatesDir: testDir });

      expect(candidates[0].task.generatedBy).toBe('metadata-test-model');
    });

    it('should handle reject workflow', async () => {
      const generatedTasks = await generateTasks({
        repoPath: '/test/repo',
        count: 1,
        llmClient: mockLlmClient,
      });

      const candidates = await saveCandidateTasks(generatedTasks, { candidatesDir: testDir });

      await updateCandidateStatus(candidates[0].id, 'rejected', { candidatesDir: testDir });

      const rejected = await listCandidates({ candidatesDir: testDir, status: 'rejected' });
      expect(rejected).toHaveLength(1);
      expect(rejected[0].status).toBe('rejected');
    });
  });
});