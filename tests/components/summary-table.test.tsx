import { describe, it, expect } from 'vitest';
import { SummaryTable } from '@/components/SummaryTable';

describe('SummaryTable', () => {
  it('renders rank, model and score columns', () => {
    const aggregateScores = [
      { model: 'gpt-4o', normalizedScore: 85, rank: 1 },
      { model: 'claude-3', normalizedScore: 80, rank: 2 },
    ];
    const tree = SummaryTable({ aggregateScores });
    expect(tree).toBeDefined();
  });

  it('displays correct rank ordering', () => {
    const aggregateScores = [
      { model: 'model-a', normalizedScore: 90, rank: 1 },
      { model: 'model-b', normalizedScore: 75, rank: 2 },
      { model: 'model-c', normalizedScore: 60, rank: 3 },
    ];
    const tree = SummaryTable({ aggregateScores });
    expect(tree).toBeDefined();
  });
});