// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/lib/schemas';

describe('LeaderboardTable Component', () => {
  const mockData: LeaderboardEntry[] = [
    {
      model: 'GPT-4o',
      provider: 'OpenAI',
      harness: 'track-a',
      score: 95,
      date: '2026-04-01',
    },
    {
      model: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      harness: 'track-a',
      score: 96,
      date: '2026-04-02',
    },
    {
      model: 'Llama 3',
      provider: 'Meta',
      harness: 'track-a',
      score: 94,
      date: '2026-04-03',
    },
  ];

  it('renders the leaderboard table with data', () => {
    render(<LeaderboardTable data={mockData} />);
    
    // Check if models are rendered
    expect(screen.getByText('GPT-4o')).toBeDefined();
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeDefined();
    
    // Check if scores are rendered (formatted as percentages)
    expect(screen.getByText('95.0%')).toBeDefined();
    expect(screen.getByText('96.0%')).toBeDefined();
  });

  it('sorts by score by default (descending)', () => {
    render(<LeaderboardTable data={mockData} />);
    
    const rows = screen.getAllByRole('row');
    // First row is header, second row is highest score (Claude 3.5 Sonnet)
    expect(rows[1].textContent).toContain('Claude 3.5 Sonnet');
    expect(rows[2].textContent).toContain('GPT-4o');
    expect(rows[3].textContent).toContain('Llama 3');
  });

  it('changes sort when clicking header', () => {
    render(<LeaderboardTable data={mockData} />);
    
    const modelHeader = screen.getByText('Model');
    
    // Click once: sort by model asc (Claude 3.5 Sonnet comes first)
    fireEvent.click(modelHeader);
    let rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Claude 3.5 Sonnet');
    expect(rows[2].textContent).toContain('GPT-4o');
    expect(rows[3].textContent).toContain('Llama 3');

    // Click again: sort by model desc (Llama 3 comes first)
    fireEvent.click(modelHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Llama 3');
    expect(rows[2].textContent).toContain('GPT-4o');
    expect(rows[3].textContent).toContain('Claude 3.5 Sonnet');
  });

  it('renders "No results" when data is empty', () => {
    render(<LeaderboardTable data={[]} />);
    expect(screen.getByText('No results.')).toBeDefined();
  });
});
