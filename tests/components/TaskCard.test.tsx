import { describe, it, expect } from 'vitest';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/lib/schemas';

describe('TaskCard Component', () => {
  it('should be a function (renderable)', () => {
    const mockTask: Task = {
      id: '1',
      title: 'Task 1',
      difficulty: 'easy',
      description: 'Desc 1',
      rubric: [],
      version: '1.0',
    };
    const result = TaskCard({ task: mockTask });
    expect(result).toBeDefined();
    expect(result.type).toBeDefined(); // It's a React element
  });
});
