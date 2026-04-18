// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TaskListWithFilters } from '@/components/TaskListWithFilters';
import { Task } from '@/lib/schemas';

function getFilterButtons() {
  return within(screen.getByTestId('difficulty-filter')).getAllByRole('button');
}

function getDomainButtons() {
  const el = screen.queryByTestId('domain-filter');
  if (!el) return [];
  return within(el).getAllByRole('button');
}

describe('TaskListWithFilters', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Easy Task', difficulty: 'easy', domain: 'Web App', description: 'Desc 1', rubric: [], version: '1.0' },
    { id: '2', title: 'Medium Task', difficulty: 'medium', domain: 'API', description: 'Desc 2', rubric: [], version: '1.0' },
    { id: '3', title: 'Hard Task', difficulty: 'hard', domain: 'Web App', description: 'Desc 3', rubric: [], version: '1.0' },
  ];
  const runCounts = { '1': 2, '2': 0, '3': 5 };

  it('renders all tasks by default', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    expect(screen.getByText('Easy Task')).toBeDefined();
    expect(screen.getByText('Medium Task')).toBeDefined();
    expect(screen.getByText('Hard Task')).toBeDefined();
  });

  it('filters by difficulty when clicking filter button', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    const btns = getFilterButtons();
    fireEvent.click(btns.find(b => b.textContent === 'medium')!);
    expect(screen.getByText('Medium Task')).toBeDefined();
    expect(screen.queryByText('Easy Task')).toBeNull();
    expect(screen.queryByText('Hard Task')).toBeNull();
  });

  it('filters by domain when clicking domain button', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    const btns = getDomainButtons();
    fireEvent.click(btns.find(b => b.textContent === 'API')!);
    expect(screen.getByText('Medium Task')).toBeDefined();
    expect(screen.queryByText('Easy Task')).toBeNull();
    expect(screen.queryByText('Hard Task')).toBeNull();
  });

  it('shows empty message when no tasks match filters', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    const dBtns = getFilterButtons();
    fireEvent.click(dBtns.find(b => b.textContent === 'easy')!);
    const domainBtns = getDomainButtons();
    fireEvent.click(domainBtns.find(b => b.textContent === 'API')!);
    expect(screen.getByText('No tasks match the selected filters.')).toBeDefined();
  });

  it('resets filter when clicking All', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    const btns = getFilterButtons();
    fireEvent.click(btns.find(b => b.textContent === 'easy')!);
    expect(screen.queryByText('Medium Task')).toBeNull();
    fireEvent.click(btns.find(b => b.textContent === 'All')!);
    expect(screen.getByText('Medium Task')).toBeDefined();
  });

  it('renders run count badges', () => {
    render(<TaskListWithFilters tasks={mockTasks} runCounts={runCounts} />);
    expect(screen.getByText('2 runs')).toBeDefined();
    expect(screen.getByText('0 runs')).toBeDefined();
    expect(screen.getByText('5 runs')).toBeDefined();
  });
});
