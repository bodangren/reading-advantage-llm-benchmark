import { TaskSchema } from '../src/lib/schemas';
import { ModelMatrixSchema } from '../src/lib/pipeline/schemas';
import type { Task } from '../src/lib/schemas';
import type { ModelMatrix } from '../src/lib/pipeline/schemas';
import type { TaskSpec } from '../src/lib/task-generator';

const defaultTaskFields = {
  id: 'mock-id',
  title: 'Mock Task Title',
  difficulty: 'medium' as const,
  description: 'Mock task description',
  version: '1.0.0',
  status: 'draft' as const,
};

export function createMockTask(overrides: Partial<Task> = {}): Task {
  const task: Task = {
    ...defaultTaskFields,
    ...overrides,
  };
  return TaskSchema.parse(task);
}

export function createMockModelMatrix(overrides: Partial<ModelMatrix> = {}): ModelMatrix {
  const matrix: ModelMatrix = {
    dataset_version: '2026-04-07',
    models: [
      { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
      { model_id: 'gpt-5', provider: 'openai', enabled: true },
    ],
    harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
    track: 'fixed',
    ...overrides,
  };
  return ModelMatrixSchema.parse(matrix);
}

export function createMockTaskSpec(overrides: Partial<Task> = {}): TaskSpec {
  const base = createMockTask(overrides);
  return {
    ...base,
    generatedBy: 'test-model',
    generationPrompt: 'test prompt',
  };
}