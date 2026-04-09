// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeaderboardPage from '@/app/leaderboard/page';
import { LeaderboardEntry } from '@/lib/schemas';

vi.mock('@/lib/data', () => {
  const mockTrackAData: LeaderboardEntry[] = [
    { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', harness: 'track-a', score: 96, date: '2026-04-02' },
    { model: 'GPT-4o', provider: 'OpenAI', harness: 'track-a', score: 95, date: '2026-04-01' },
    { model: 'Llama 3', provider: 'Meta', harness: 'track-a', score: 94, date: '2026-04-03' },
  ];

  const mockTrackBData: LeaderboardEntry[] = [
    { model: 'GPT-4o', provider: 'OpenAI', harness: 'track-b', score: 98, date: '2026-04-01' },
    { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', harness: 'track-b', score: 97, date: '2026-04-02' },
  ];

  return {
    getLeaderboard: vi.fn().mockResolvedValue([...mockTrackAData, ...mockTrackBData]),
  };
});

describe('Leaderboard Page', () => {
  it('renders the page title', async () => {
    render(await LeaderboardPage());
    expect(screen.getByText('Leaderboard')).toBeDefined();
  });

  it('renders Track A (Fixed Harness) tab by default', async () => {
    render(await LeaderboardPage());
    expect(screen.getByRole('tab', { name: /track a/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /track b/i })).toBeDefined();
  });

  it('renders Track A leaderboard data by default', async () => {
    render(await LeaderboardPage());
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeDefined();
    expect(screen.getByText('GPT-4o')).toBeDefined();
    expect(screen.getByText('Llama 3')).toBeDefined();
  });
});
