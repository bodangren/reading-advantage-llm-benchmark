import { describe, it, expect } from 'vitest';
import { StrengthsWeaknessesSection } from '@/components/StrengthsWeaknessesSection';

describe('StrengthsWeaknessesSection', () => {
  it('renders strengths and weaknesses for models', () => {
    const models = [
      {
        model: 'gpt-4o',
        normalizedScore: 85,
        rawScore: 85,
        taskResults: [
          { taskId: 'task-1', taskTitle: 'Task 1', domain: 'coding', normalizedScore: 90, rawScore: 90, winner: true, delta: 0 },
          { taskId: 'task-2', taskTitle: 'Task 2', domain: 'reasoning', normalizedScore: 75, rawScore: 75, winner: false, delta: -10 },
        ],
      },
    ];
    const tree = StrengthsWeaknessesSection({ models });
    expect(tree).toBeDefined();
  });

  it('returns null for empty models', () => {
    const tree = StrengthsWeaknessesSection({ models: [] });
    expect(tree).toBeNull();
  });
});