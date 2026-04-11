import { describe, it, expect, vi } from 'vitest';
import TaskDetailPage, { generateStaticParams } from '../../../../src/app/tasks/[id]/page';
import * as data from '@/lib/data';

vi.mock('@/lib/data', () => ({
  getTaskById: vi.fn(),
  getTasks: vi.fn(),
}));

describe('Task Detail Page', () => {
  it('should call getTaskById and return rendered task details', async () => {
    const mockTask = { id: '1', title: 'Task 1', difficulty: 'easy', description: 'Desc 1', rubric: ['Point 1'], version: '1.0' };
    vi.mocked(data.getTaskById).mockResolvedValueOnce(mockTask);

    const page = await TaskDetailPage({ params: Promise.resolve({ id: '1' }) });
    expect(page).toBeDefined();
    expect(data.getTaskById).toHaveBeenCalledWith('1');
  });

  it('should call getTasks in generateStaticParams', async () => {
    const mockTasks = [{ id: '1', title: 'Task 1', difficulty: 'easy', description: 'Desc', rubric: [], version: '1.0' }, { id: '2', title: 'Task 2', difficulty: 'easy', description: 'Desc', rubric: [], version: '1.0' }] as Awaited<ReturnType<typeof data.getTasks>>;
    vi.mocked(data.getTasks).mockResolvedValueOnce(mockTasks);

    const params = await generateStaticParams();
    expect(params).toEqual([{ id: '1' }, { id: '2' }]);
    expect(data.getTasks).toHaveBeenCalled();
  });
});
