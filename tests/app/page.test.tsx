// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { LeaderboardEntry } from '@/lib/schemas';

vi.mock('@/lib/data', () => {
  const mockData: LeaderboardEntry[] = [
    { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', harness: 'track-a', score: 96, date: '2026-04-02' },
    { model: 'GPT-4o', provider: 'OpenAI', harness: 'track-a', score: 95, date: '2026-04-01' },
    { model: 'Llama 3', provider: 'Meta', harness: 'track-a', score: 94, date: '2026-04-03' },
    { model: 'Gemini Pro', provider: 'Google', harness: 'track-a', score: 93, date: '2026-04-04' },
    { model: 'Mistral', provider: 'Mistral AI', harness: 'track-a', score: 92, date: '2026-04-05' },
    { model: 'PaLM 2', provider: 'Google', harness: 'track-a', score: 91, date: '2026-04-06' },
  ];

  return {
    getLeaderboard: vi.fn().mockResolvedValue(mockData),
  };
});

describe('HomePage', () => {
  it('renders the page heading', async () => {
    render(await HomePage());
    expect(screen.getByText('Measuring LLM Reading Comprehension')).toBeDefined();
  });

  it('renders BLB framework introduction', async () => {
    render(await HomePage());
    expect(screen.getByText(/Reading Advantage benchmark/i)).toBeDefined();
  });

  it('shows top 5 models from leaderboard', async () => {
    render(await HomePage());
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeDefined();
    expect(screen.getByText('GPT-4o')).toBeDefined();
    expect(screen.getByText('Llama 3')).toBeDefined();
    expect(screen.getByText('Gemini Pro')).toBeDefined();
    expect(screen.getByText('Mistral')).toBeDefined();
  });

  it('does not show models beyond top 5', async () => {
    render(await HomePage());
    expect(screen.queryByText('PaLM 2')).toBeNull();
  });
});
