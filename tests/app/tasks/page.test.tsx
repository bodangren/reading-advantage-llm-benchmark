import { describe, it, expect, vi } from 'vitest';
import TasksPage from '../../../src/app/tasks/page';
import * as data from '../../../src/lib/data';
import { createMockTask } from '../../../test/factories';

vi.mock('../../../src/lib/data', () => ({
  getTasks: vi.fn(),
  getRuns: vi.fn(),
}));

describe('Tasks Page', () => {
  it('should call getTasks and getRuns and return rendered tasks', async () => {
    const mockTasks = [
      createMockTask({ id: '1', title: 'Task 1', difficulty: 'easy' }),
      createMockTask({ id: '2', title: 'Task 2', difficulty: 'hard' }),
    ];
    vi.mocked(data.getTasks).mockResolvedValueOnce(mockTasks);
    vi.mocked(data.getRuns).mockResolvedValueOnce([]);

    const page = await TasksPage();
    expect(page).toBeDefined();
    expect(data.getTasks).toHaveBeenCalled();
    expect(data.getRuns).toHaveBeenCalled();
  });
});
