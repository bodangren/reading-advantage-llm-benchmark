import { describe, it, expect, vi } from 'vitest';
import TasksPage from '../../../src/app/tasks/page';
import * as data from '../../../src/lib/data';

vi.mock('../../../src/lib/data', () => ({
  getTasks: vi.fn(),
  getRuns: vi.fn(),
}));

describe('Tasks Page', () => {
  it('should call getTasks and getRuns and return rendered tasks', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', difficulty: 'easy', description: 'Desc 1', rubric: [], version: '1.0' },
      { id: '2', title: 'Task 2', difficulty: 'hard', description: 'Desc 2', rubric: [], version: '1.0' },
    ];
    vi.mocked(data.getTasks).mockResolvedValueOnce(mockTasks);
    vi.mocked(data.getRuns).mockResolvedValueOnce([]);

    const page = await TasksPage();
    expect(page).toBeDefined();
    expect(data.getTasks).toHaveBeenCalled();
    expect(data.getRuns).toHaveBeenCalled();
  });
});
