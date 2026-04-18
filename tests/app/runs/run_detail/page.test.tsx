// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RunDetailPage, { generateStaticParams } from '../../../../src/app/runs/[id]/page';
import * as data from '@/lib/data';

vi.mock('@/lib/data', () => ({
  getRunById: vi.fn(),
  getRuns: vi.fn(),
}));

describe('Run Detail Page', () => {
  it('should call getRunById and return rendered run details', async () => {
    const mockRun = { id: '1', model: 'gemini-pro', harness: 'opencode', benchmark_version: '1.0', score: 0.9 };
    vi.mocked(data.getRunById).mockResolvedValueOnce(mockRun as ReturnType<typeof data.getRunById> extends Promise<infer T> ? T : never);

    const page = await RunDetailPage({ params: Promise.resolve({ id: '1' }) });
    expect(page).toBeDefined();
    expect(data.getRunById).toHaveBeenCalledWith('1');
  });

  it('should call getRuns in generateStaticParams', async () => {
    const mockRuns = [{ id: '1', model: 'test', harness: 'test', benchmark_version: '1.0', score: 0.9 }, { id: '2', model: 'test', harness: 'test', benchmark_version: '1.0', score: 0.8 }] as Awaited<ReturnType<typeof data.getRuns>>;
    vi.mocked(data.getRuns).mockResolvedValueOnce(mockRuns);

    const params = await generateStaticParams();
    expect(params).toEqual([{ id: '1' }, { id: '2' }]);
    expect(data.getRuns).toHaveBeenCalled();
  });

  it('should render dataset version when present', async () => {
    const mockRun = { id: '1', model: 'gemini-pro', harness: 'opencode', benchmark_version: '1.0', dataset_version: '2026-04-07', score: 0.9 };
    vi.mocked(data.getRunById).mockResolvedValueOnce(mockRun as ReturnType<typeof data.getRunById> extends Promise<infer T> ? T : never);

    render(await RunDetailPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Dataset Version')).toBeDefined();
    expect(screen.getByText('2026-04-07')).toBeDefined();
  });

  it('should not render dataset version when absent', async () => {
    const mockRun = { id: '1', model: 'gemini-pro', harness: 'opencode', benchmark_version: '1.0', score: 0.9 };
    vi.mocked(data.getRunById).mockResolvedValueOnce(mockRun as ReturnType<typeof data.getRunById> extends Promise<infer T> ? T : never);

    render(await RunDetailPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.queryByText('Dataset Version')).toBeNull();
  });
});
