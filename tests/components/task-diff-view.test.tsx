import { describe, it, expect } from 'vitest';
import { TaskDiffView } from '@/components/TaskDiffView';

describe('TaskDiffView', () => {
  it('renders per-task comparison table', () => {
    const models = [
      {
        model: 'gpt-4o',
        normalizedScore: 85,
        rawScore: 85,
        taskResults: [
          { taskId: 'task-1', taskTitle: 'Task 1', normalizedScore: 85, rawScore: 85, winner: true, delta: 0 },
        ],
      },
      {
        model: 'claude-3',
        normalizedScore: 80,
        rawScore: 80,
        taskResults: [
          { taskId: 'task-1', taskTitle: 'Task 1', normalizedScore: 80, rawScore: 80, winner: false, delta: -5 },
        ],
      },
    ];
    const tree = TaskDiffView({ models });
    expect(tree).toBeDefined();
  });

  it('returns null for empty models array', () => {
    const tree = TaskDiffView({ models: [] });
    expect(tree).toBeNull();
  });
});