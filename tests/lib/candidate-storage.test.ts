import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveCandidateTasks, loadCandidateTasks, CandidateStatus, listCandidates, CandidateTask } from '../../src/lib/candidate-storage';
import { TaskSpec } from '../../src/lib/task-generator';
import fs from 'fs';
import path from 'path';

describe('Candidate Storage', () => {
  const testDir = '/tmp/test-candidates';
  const testTask: TaskSpec = {
    id: 'candidate_task_1',
    title: 'Test Candidate Task',
    difficulty: 'medium',
    description: 'A candidate task for testing',
    generatedBy: 'test-model',
    generationPrompt: 'Generate a test task from the repo',
    version: '1.0.0',
  };

  beforeEach(() => {
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

  describe('saveCandidateTasks', () => {
    it('should write task JSON to tasks/candidates directory', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const filePath = path.join(testDir, `${testTask.id}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should include status field set to pending', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const filePath = path.join(testDir, `${testTask.id}.json`);
      const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      expect(saved.status).toBe('pending');
      expect(saved.task).toEqual(testTask);
    });

    it('should generate unique ID for each candidate', async () => {
      const task2: TaskSpec = { ...testTask, id: 'candidate_task_2' };
      await saveCandidateTasks([testTask, task2], { candidatesDir: testDir });

      const files = fs.readdirSync(testDir);
      expect(files).toHaveLength(2);
      expect(files).toContain('candidate_task_1.json');
      expect(files).toContain('candidate_task_2.json');
    });

    it('should write valid JSON with all required fields', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const filePath = path.join(testDir, `${testTask.id}.json`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed.id).toBeDefined();
      expect(parsed.status).toBe('pending');
      expect(parsed.task).toEqual(testTask);
      expect(parsed.createdAt).toBeDefined();
      expect(parsed.updatedAt).toBeDefined();
    });
  });

  describe('loadCandidateTasks', () => {
    it('should load all candidates from directory', async () => {
      const task2: TaskSpec = { ...testTask, id: 'candidate_task_2' };
      await saveCandidateTasks([testTask, task2], { candidatesDir: testDir });

      const candidates = await loadCandidateTasks({ candidatesDir: testDir });

      expect(candidates).toHaveLength(2);
    });

    it('should return empty array when directory is empty', async () => {
      const candidates = await loadCandidateTasks({ candidatesDir: testDir });
      expect(candidates).toHaveLength(0);
    });

    it('should return empty array when directory does not exist', async () => {
      const candidates = await loadCandidateTasks({ candidatesDir: '/non/existent/path' });
      expect(candidates).toHaveLength(0);
    });
  });

  describe('listCandidates', () => {
    it('should list all candidates with status', async () => {
      const task2: TaskSpec = { ...testTask, id: 'candidate_task_2' };
      await saveCandidateTasks([testTask, task2], { candidatesDir: testDir });

      const candidates = await listCandidates({ candidatesDir: testDir });

      expect(candidates).toHaveLength(2);
      expect(candidates[0].status).toBe('pending');
      expect(candidates[1].status).toBe('pending');
    });

    it('should filter candidates by status', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const pending = await listCandidates({ candidatesDir: testDir, status: 'pending' });
      const approved = await listCandidates({ candidatesDir: testDir, status: 'approved' });

      expect(pending).toHaveLength(1);
      expect(approved).toHaveLength(0);
    });
  });

  describe('updateCandidateStatus', () => {
    it('should update candidate status to approved', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const { updateCandidateStatus } = await import('../../src/lib/candidate-storage');
      await updateCandidateStatus(testTask.id, 'approved', { candidatesDir: testDir });

      const candidates = await listCandidates({ candidatesDir: testDir });
      expect(candidates[0].status).toBe('approved');
    });

    it('should update candidate status to rejected', async () => {
      await saveCandidateTasks([testTask], { candidatesDir: testDir });

      const { updateCandidateStatus } = await import('../../src/lib/candidate-storage');
      await updateCandidateStatus(testTask.id, 'rejected', { candidatesDir: testDir });

      const candidates = await listCandidates({ candidatesDir: testDir });
      expect(candidates[0].status).toBe('rejected');
    });
  });
});