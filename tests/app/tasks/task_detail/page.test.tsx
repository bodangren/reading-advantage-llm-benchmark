// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskDetailPage, { generateStaticParams } from '../../../../src/app/tasks/[id]/page';
import * as data from '@/lib/data';

vi.mock('@/lib/data', () => ({
  getTaskById: vi.fn(),
  getTasks: vi.fn(),
}));

const fullTask = {
  id: 'task-1',
  title: 'Import Game',
  difficulty: 'medium',
  domain: 'Web App',
  description: 'Import a game and connect vocabulary pipeline.',
  repo_context: 'Next.js App Router with React-Konva for game rendering.',
  acceptance_criteria: [
    'Game component is registered',
    'Vocabulary pipeline is connected',
    'Game state persists across navigation',
  ],
  structured_rubric: [
    { label: 'Functional correctness', weight: 40, description: 'Works end-to-end' },
    { label: 'Integration quality', weight: 25, description: 'Follows patterns' },
    { label: 'Regression safety', weight: 20, description: 'No side effects' },
    { label: 'Minimality', weight: 10, description: 'No over-engineering' },
    { label: 'Process quality', weight: 5, description: 'Clean commits' },
  ],
  rubric: ['Functional correctness (40)'],
  version: '1.0',
};

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

  it('should render acceptance criteria as checklist', async () => {
    vi.mocked(data.getTaskById).mockResolvedValueOnce(fullTask as ReturnType<typeof data.getTaskById> extends Promise<infer T> ? Exclude<T, undefined> : never);
    render(await TaskDetailPage({ params: Promise.resolve({ id: 'task-1' }) }));
    expect(screen.getByText('Acceptance Criteria')).toBeDefined();
    expect(screen.getByText('Game component is registered')).toBeDefined();
    expect(screen.getByText('Vocabulary pipeline is connected')).toBeDefined();
  });

  it('should render structured rubric table with weights', async () => {
    vi.mocked(data.getTaskById).mockResolvedValueOnce(fullTask as ReturnType<typeof data.getTaskById> extends Promise<infer T> ? Exclude<T, undefined> : never);
    render(await TaskDetailPage({ params: Promise.resolve({ id: 'task-1' }) }));
    expect(screen.getByText('Scoring Rubric')).toBeDefined();
    expect(screen.getByText('Functional correctness')).toBeDefined();
    expect(screen.getByText('40')).toBeDefined();
    expect(screen.getByText('Works end-to-end')).toBeDefined();
  });

  it('should render repo context section', async () => {
    vi.mocked(data.getTaskById).mockResolvedValueOnce(fullTask as ReturnType<typeof data.getTaskById> extends Promise<infer T> ? Exclude<T, undefined> : never);
    render(await TaskDetailPage({ params: Promise.resolve({ id: 'task-1' }) }));
    expect(screen.getByText('Repository Context')).toBeDefined();
    expect(screen.getByText('Next.js App Router with React-Konva for game rendering.')).toBeDefined();
  });

  it('should render breadcrumb back to tasks', async () => {
    vi.mocked(data.getTaskById).mockResolvedValueOnce(fullTask as ReturnType<typeof data.getTaskById> extends Promise<infer T> ? Exclude<T, undefined> : never);
    render(await TaskDetailPage({ params: Promise.resolve({ id: 'task-1' }) }));
    expect(screen.getByText('Back to Tasks')).toBeDefined();
  });

  it('should not render optional sections when absent', async () => {
    const minimalTask = { id: '1', title: 'Task 1', difficulty: 'easy', description: 'Desc', version: '1.0' };
    vi.mocked(data.getTaskById).mockResolvedValueOnce(minimalTask as ReturnType<typeof data.getTaskById> extends Promise<infer T> ? Exclude<T, undefined> : never);
    render(await TaskDetailPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.queryByText('Acceptance Criteria')).toBeNull();
    expect(screen.queryByText('Repository Context')).toBeNull();
    expect(screen.queryByText('Scoring Rubric')).toBeNull();
  });
});
