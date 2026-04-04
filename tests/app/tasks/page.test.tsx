import { describe, it, expect, vi } from 'vitest';
import TasksPage from '../../../src/app/tasks/page';
import * as data from '../../../src/lib/data';

vi.mock('../../../src/lib/data', () => ({
  getTasks: vi.fn(),
}));

describe('Tasks Page', () => {
  it('should call getTasks and return rendered tasks', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', difficulty: 'easy', description: 'Desc 1', rubric: [], version: '1.0' },
      { id: '2', title: 'Task 2', difficulty: 'hard', description: 'Desc 2', rubric: [], version: '1.0' },
    ];
    vi.mocked(data.getTasks).mockResolvedValueOnce(mockTasks);

    const page = await TasksPage();
    // Since it's a server component, it returns JSX
    // We can check if it's defined and has some expected structure or at least doesn't crash
    expect(page).toBeDefined();
    expect(data.getTasks).toHaveBeenCalled();
  });
});
