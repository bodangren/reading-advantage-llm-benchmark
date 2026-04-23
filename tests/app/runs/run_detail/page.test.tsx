// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RunDetailPage, { generateStaticParams } from '../../../../src/app/runs/[id]/page';
import * as runs from '@/lib/runs';

vi.mock('@/lib/runs', () => ({
  getRunById: vi.fn(),
  getAllRuns: vi.fn(),
}));

const mockRunDetail = {
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
  diff: '--- a/src/file.ts\n+++ b/src/file.ts',
  test_results: [
    { suite: 'unit', name: 'test should pass', status: 'pass' as const, duration_ms: 10 }
  ],
  artifacts: [
    { name: 'run_log.txt', type: 'log' as const, url: '/artifacts/log.txt', size_bytes: 45678 }
  ]
};

describe('Run Detail Page', () => {
  it('should call getRunById and return rendered run details', async () => {
    vi.mocked(runs.getRunById).mockResolvedValueOnce(mockRunDetail);

    const page = await RunDetailPage({ params: Promise.resolve({ id: 'blb-run-001' }) });
    expect(page).toBeDefined();
    expect(runs.getRunById).toHaveBeenCalledWith('blb-run-001');
  });

  it('should call getAllRuns in generateStaticParams', async () => {
    const mockRuns = [mockRunDetail];
    vi.mocked(runs.getAllRuns).mockResolvedValueOnce(mockRuns);

    const params = await generateStaticParams();
    expect(params).toEqual([{ id: 'blb-run-001' }]);
    expect(runs.getAllRuns).toHaveBeenCalled();
  });

  it('should render dataset version when present', async () => {
    vi.mocked(runs.getRunById).mockResolvedValueOnce(mockRunDetail);

    render(await RunDetailPage({ params: Promise.resolve({ id: 'blb-run-001' }) }));
    expect(screen.getByText('Dataset Version')).toBeDefined();
    expect(screen.getByText('2026-04-07')).toBeDefined();
  });

  it('should not render dataset version when absent', async () => {
    const runWithoutDataset = { ...mockRunDetail, dataset_version: undefined };
    vi.mocked(runs.getRunById).mockResolvedValueOnce(runWithoutDataset);

    render(await RunDetailPage({ params: Promise.resolve({ id: 'blb-run-001' }) }));
    expect(screen.queryByText('Dataset Version')).toBeNull();
  });
});