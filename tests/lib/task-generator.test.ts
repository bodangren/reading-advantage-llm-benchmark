import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskGenerator, TaskSpec, generateTasks } from '../../src/lib/task-generator';
import { TaskSchema } from '../../src/lib/schemas';

describe('TaskGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TaskSpec shape', () => {
    it('should have required metadata fields for generated tasks', () => {
      const spec: TaskSpec = {
        id: 'test-task',
        title: 'Test Task',
        difficulty: 'medium',
        description: 'A test task description',
        generatedBy: 'test-model',
        generationPrompt: 'Generate a test task',
        version: '1.0.0',
      };

      expect(spec.generatedBy).toBeDefined();
      expect(spec.generationPrompt).toBeDefined();
    });
  });

  describe('generateTasks', () => {
    it('should accept repo path and count parameters', async () => {
      const mockLLMResponse = JSON.stringify([
        {
          id: 'gen_task_1',
          title: 'Generated Task 1',
          difficulty: 'easy',
          description: 'Task generated from repo context',
          version: '1.0.0',
        },
      ]);

      const tasks = await generateTasks({
        repoPath: '/path/to/repo',
        count: 1,
        llmClient: async () => mockLLMResponse,
      });

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe('gen_task_1');
    });

    it('should validate generated tasks against TaskSchema', async () => {
      const validTask = {
        id: 'valid_task',
        title: 'Valid Task',
        difficulty: 'medium',
        description: 'A valid task with all fields',
        version: '1.0.0',
      };

      const mockLLMResponse = JSON.stringify([validTask]);

      const tasks = await generateTasks({
        repoPath: '/path/to/repo',
        count: 1,
        llmClient: async () => mockLLMResponse,
      });

      expect(tasks).toHaveLength(1);
      const result = TaskSchema.safeParse(tasks[0]);
      expect(result.success).toBe(true);
    });

    it('should include generatedBy and generationPrompt metadata', async () => {
      const mockTask = {
        id: 'meta_task',
        title: 'Metadata Task',
        difficulty: 'hard',
        description: 'Task with metadata',
        version: '1.0.0',
      };

      const mockLLMResponse = JSON.stringify([mockTask]);
      const modelId = 'test-model-123';

      const tasks = await generateTasks({
        repoPath: '/path/to/repo',
        count: 1,
        llmClient: async () => mockLLMResponse,
        modelId,
      });

      expect(tasks[0].generatedBy).toBe(modelId);
      expect(tasks[0].generationPrompt).toBeDefined();
      expect(tasks[0].generationPrompt.length).toBeGreaterThan(0);
    });

    it('should reject invalid JSON from LLM', async () => {
      const invalidResponse = 'this is not valid JSON';

      await expect(
        generateTasks({
          repoPath: '/path/to/repo',
          count: 1,
          llmClient: async () => invalidResponse,
        })
      ).rejects.toThrow();
    });

    it('should handle multiple generated tasks', async () => {
      const mockTasks = [
        { id: 'task_1', title: 'Task 1', difficulty: 'easy', description: 'First task', version: '1.0.0' },
        { id: 'task_2', title: 'Task 2', difficulty: 'medium', description: 'Second task', version: '1.0.0' },
        { id: 'task_3', title: 'Task 3', difficulty: 'hard', description: 'Third task', version: '1.0.0' },
      ];

      const mockLLMResponse = JSON.stringify(mockTasks);

      const tasks = await generateTasks({
        repoPath: '/path/to/repo',
        count: 3,
        llmClient: async () => mockLLMResponse,
      });

      expect(tasks).toHaveLength(3);
      expect(tasks[0].id).toBe('task_1');
      expect(tasks[1].id).toBe('task_2');
      expect(tasks[2].id).toBe('task_3');
    });
  });

  describe('TaskGenerator class', () => {
    it('should be instantiated with repo path', () => {
      const generator = new TaskGenerator('/path/to/repo');
      expect(generator).toBeDefined();
    });

    it('should generate specified number of tasks', async () => {
      const generator = new TaskGenerator('/path/to/repo');

      const mockTasks = [
        { id: 'class_task_1', title: 'Class Task 1', difficulty: 'easy', description: 'First', version: '1.0.0' },
      ];
      const mockLLMResponse = JSON.stringify(mockTasks);

      const tasks = await generator.generate({
        count: 1,
        llmClient: async () => mockLLMResponse,
      });

      expect(tasks).toHaveLength(1);
    });
  });
});