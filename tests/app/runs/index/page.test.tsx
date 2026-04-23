// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RunsIndexPage from '../../../../src/app/runs/page';
import * as runs from '@/lib/runs';

vi.mock('@/lib/runs', () => ({
  getAllRuns: vi.fn(),
}));

const mockRuns = [
  {
    id: 'blb-run-001',
    model: 'gpt-5.4',
    provider: 'OpenAI',
    harness: 'opencode',
    harness_version: '1.2.0',
    benchmark_version: '1.0',
    dataset_version: '2026-04-07',
    task_id: 'task_import_game_v1',
    run_date: '2026-04-08T14:30:00Z',
    wall_time_seconds: 145.7,
    total_score: 0.82,
    scores: {
      functional_correctness: 32,
      integration_quality: 22,
      regression_safety: 16,
      minimality: 8,
      process_quality: 4
    },
    test_results: [],
    artifacts: []
  },
  {
    id: 'blb-run-002',
    model: 'claude-4',
    provider: 'Anthropic',
    harness: 'opencode',
    harness_version: '1.2.0',
    benchmark_version: '1.0',
    task_id: 'task_import_game_v1',
    run_date: '2026-04-09T10:00:00Z',
    wall_time_seconds: 120.3,
    total_score: 0.75,
    scores: {
      functional_correctness: 28,
      integration_quality: 20,
      regression_safety: 14,
      minimality: 8,
      process_quality: 5
    },
    test_results: [],
    artifacts: []
  }
];

describe('Runs Index Page', () => {
  it('should render runs list', async () => {
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce(mockRuns);

    render(await RunsIndexPage());

    expect(screen.getByText('Run History')).toBeDefined();
    expect(screen.getByText('gpt-5.4')).toBeDefined();
    expect(screen.getByText('claude-4')).toBeDefined();
  });

  it('should render empty state when no runs', async () => {
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce([]);

    render(await RunsIndexPage());

    expect(screen.getByText(/No runs found/i)).toBeDefined();
  });

  it('should render task links', async () => {
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce(mockRuns);

    render(await RunsIndexPage());

    const taskLinks = screen.getAllByRole('link', { name: /task_import_game_v1/i });
    expect(taskLinks.length).toBe(2);
    expect(taskLinks[0].getAttribute('href')).toBe('/tasks/task_import_game_v1');
  });

it('should render run detail links', async () => {
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce(mockRuns);

    render(await RunsIndexPage());

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3);
  });

  it('should display score badges', async () => {
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce([mockRuns[0]]);

    render(await RunsIndexPage());

    expect(screen.getByText('82.0%')).toBeDefined();
  });
});