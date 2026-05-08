import { describe, it, expect } from 'vitest';
import { createMockTask, createMockModelMatrix, createMockTaskSpec } from '../factories';
import type { Task } from '../../src/lib/schemas';
import type { ModelMatrix } from '../../src/lib/pipeline/schemas';
import type { TaskSpec } from '../../src/lib/task-generator';

describe('Mock Factory Type Safety', () => {
  describe('createMockTask', () => {
    it('should produce a valid Task type', () => {
      const task = createMockTask();
      const validated: Task = task;
      expect(validated.id).toBeDefined();
      expect(validated.status).toBeDefined();
    });

    it('should allow overriding specific fields', () => {
      const task = createMockTask({ id: 'custom-id', title: 'Custom Title' });
      expect(task.id).toBe('custom-id');
      expect(task.title).toBe('Custom Title');
    });

    it('should infer correct literal types for enums', () => {
      const task = createMockTask({ difficulty: 'hard', status: 'published' });
      type Difficulty = Task['difficulty'];
      type Status = Task['status'];
      const _difficultyCheck: Difficulty = 'hard';
      const _statusCheck: Status = 'published';
      expect(task.difficulty).toBe('hard');
      expect(task.status).toBe('published');
    });
  });

  describe('createMockModelMatrix', () => {
    it('should produce a valid ModelMatrix type', () => {
      const matrix = createMockModelMatrix();
      const validated: ModelMatrix = matrix;
      expect(validated.track).toBeDefined();
      expect(validated.models).toBeDefined();
    });

    it('should allow overriding track field', () => {
      const matrix = createMockModelMatrix({ track: 'native' });
      expect(matrix.track).toBe('native');
    });

    it('should enforce track is fixed or native', () => {
      const matrix = createMockModelMatrix();
      type Track = ModelMatrix['track'];
      const _check: Track = matrix.track;
      expect(matrix.track === 'fixed' || matrix.track === 'native').toBe(true);
    });
  });

  describe('createMockTaskSpec', () => {
    it('should produce a valid TaskSpec type with generatedBy and generationPrompt', () => {
      const spec = createMockTaskSpec();
      const validated: TaskSpec = spec;
      expect(validated.generatedBy).toBeDefined();
      expect(validated.generationPrompt).toBeDefined();
    });

    it('should include all Task fields plus TaskSpec extensions', () => {
      const spec = createMockTaskSpec({ id: 'extended-task' });
      expect(spec.id).toBe('extended-task');
      expect(spec.generatedBy).toBeDefined();
      expect(spec.generationPrompt).toBeDefined();
    });
  });

  describe('Type-level regression detection', () => {
    it('createMockTask MUST always include status field', () => {
      const task = createMockTask();
      const hasStatus: Task['status'] = task.status;
      expect(hasStatus).toBeDefined();
    });

    it('createMockModelMatrix MUST always include track field', () => {
      const matrix = createMockModelMatrix();
      const hasTrack: ModelMatrix['track'] = matrix.track;
      expect(hasTrack).toBeDefined();
    });
  });
});