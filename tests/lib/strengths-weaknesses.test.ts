import { describe, it, expect } from 'vitest';
import { analyzeStrengthsWeaknesses } from '@/lib/strengths-weaknesses';

describe('Strengths/Weaknesses Analyzer', () => {
  it('aggregates scores by category', () => {
    const taskResults = [
      { taskId: 'task-1', domain: 'coding', normalizedScore: 90, rawScore: 90 },
      { taskId: 'task-2', domain: 'coding', normalizedScore: 80, rawScore: 80 },
      { taskId: 'task-3', domain: 'reasoning', normalizedScore: 70, rawScore: 70 },
    ];
    const model = 'test-model';
    const result = analyzeStrengthsWeaknesses(taskResults, model);
    expect(result.model).toBe('test-model');
    expect(result.strengths).toHaveLength(1);
    expect(result.strengths[0].category).toBe('coding');
    expect(result.strengths[0].avgScore).toBe(85);
    expect(result.weaknesses).toHaveLength(1);
    expect(result.weaknesses[0].category).toBe('reasoning');
    expect(result.weaknesses[0].avgScore).toBe(70);
  });

  it('handles single-task category', () => {
    const taskResults = [
      { taskId: 'task-1', domain: 'unique', normalizedScore: 50, rawScore: 50 },
    ];
    const result = analyzeStrengthsWeaknesses(taskResults, 'model-x');
    expect(result.strengths).toHaveLength(0);
    expect(result.weaknesses).toHaveLength(1);
    expect(result.weaknesses[0].category).toBe('unique');
  });

  it('sorts strengths by avgScore descending, weaknesses ascending', () => {
    const taskResults = [
      { taskId: 'task-1', domain: 'a', normalizedScore: 60, rawScore: 60 },
      { taskId: 'task-2', domain: 'b', normalizedScore: 90, rawScore: 90 },
      { taskId: 'task-3', domain: 'c', normalizedScore: 30, rawScore: 30 },
      { taskId: 'task-4', domain: 'd', normalizedScore: 75, rawScore: 75 },
    ];
    const result = analyzeStrengthsWeaknesses(taskResults, 'model');
    const coding = result.strengths.find(s => s.category === 'coding');
    expect(coding).toBeUndefined();
  });

  it('handles missing domain as "uncategorized"', () => {
    const taskResults = [
      { taskId: 'task-1', domain: undefined, normalizedScore: 70, rawScore: 70 },
      { taskId: 'task-2', domain: 'coding', normalizedScore: 90, rawScore: 90 },
    ];
    const result = analyzeStrengthsWeaknesses(taskResults, 'model');
    const uncategorized = result.weaknesses.find(s => s.category === 'uncategorized');
    expect(uncategorized).toBeDefined();
    expect(uncategorized?.avgScore).toBe(70);
  });
});