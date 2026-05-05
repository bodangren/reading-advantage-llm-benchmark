// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/lib/schemas';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Task 1',
    difficulty: 'easy',
    description: 'Desc 1',
    rubric: [],
    version: '1.0',
  };

  it('should render task title and description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Task 1')).toBeDefined();
    expect(screen.getByText('Desc 1')).toBeDefined();
  });

  it('should render difficulty badge', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('easy')).toBeDefined();
  });

  it('should render domain badge when present', () => {
    const taskWithDomain = { ...mockTask, domain: 'Web App' };
    render(<TaskCard task={taskWithDomain} />);
    expect(screen.getByText('Web App')).toBeDefined();
  });

  it('should not render domain badge when absent', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.queryByText('Web App')).toBeNull();
  });

  it('should render run count badge', () => {
    render(<TaskCard task={mockTask} runCount={3} />);
    expect(screen.getByText('3 runs')).toBeDefined();
  });

  it('should render greyed badge for zero runs', () => {
    render(<TaskCard task={mockTask} runCount={0} />);
    expect(screen.getByText('0 runs')).toBeDefined();
  });

  it('should render singular run count', () => {
    render(<TaskCard task={mockTask} runCount={1} />);
    expect(screen.getByText('1 run')).toBeDefined();
  });

  it('should render View Task link', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('View Task')).toBeDefined();
  });

  it('should render draft status badge by default', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('draft')).toBeDefined();
  });

  it('should render published status badge', () => {
    const publishedTask = { ...mockTask, status: 'published' as const };
    render(<TaskCard task={publishedTask} />);
    expect(screen.getByText('published')).toBeDefined();
  });

  it('should render review status badge', () => {
    const reviewTask = { ...mockTask, status: 'review' as const };
    render(<TaskCard task={reviewTask} />);
    expect(screen.getByText('review')).toBeDefined();
  });
});
