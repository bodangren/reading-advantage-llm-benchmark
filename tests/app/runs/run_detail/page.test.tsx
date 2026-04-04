import { describe, it, expect, vi } from 'vitest';
import RunDetailPage, { generateStaticParams } from '../../../../src/app/runs/[id]/page';
import * as data from '@/lib/data';

vi.mock('@/lib/data', () => ({
  getRunById: vi.fn(),
  getRuns: vi.fn(),
}));

describe('Run Detail Page', () => {
  it('should call getRunById and return rendered run details', async () => {
    const mockRun = { id: '1', model: 'gemini-pro', harness: 'opencode', benchmark_version: '1.0', score: 0.9 };
    vi.mocked(data.getRunById).mockResolvedValueOnce(mockRun as any);

    const page = await RunDetailPage({ params: Promise.resolve({ id: '1' }) });
    expect(page).toBeDefined();
    expect(data.getRunById).toHaveBeenCalledWith('1');
  });

  it('should call getRuns in generateStaticParams', async () => {
    const mockRuns = [{ id: '1' }, { id: '2' }] as any;
    vi.mocked(data.getRuns).mockResolvedValueOnce(mockRuns);

    const params = await generateStaticParams();
    expect(params).toEqual([{ id: '1' }, { id: '2' }]);
    expect(data.getRuns).toHaveBeenCalled();
  });
});
