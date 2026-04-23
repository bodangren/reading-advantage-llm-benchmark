// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBreakdown } from '../../src/components/ScoreBreakdown';

describe('ScoreBreakdown', () => {
  const mockScores = {
    functional_correctness: 32,
    integration_quality: 22,
    regression_safety: 16,
    minimality: 8,
    process_quality: 4
  };

  it('should render overall score', () => {
    render(<ScoreBreakdown scores={mockScores} totalScore={0.82} />);
    expect(screen.getByText('82.0%')).toBeDefined();
  });

  it('should render all score dimensions', () => {
    render(<ScoreBreakdown scores={mockScores} totalScore={0.82} />);
    expect(screen.getByText('Functional Correctness')).toBeDefined();
    expect(screen.getByText('Integration Quality')).toBeDefined();
    expect(screen.getByText('Regression Safety')).toBeDefined();
    expect(screen.getByText('Minimality')).toBeDefined();
    expect(screen.getByText('Process Quality')).toBeDefined();
  });

  it('should render individual scores', () => {
    render(<ScoreBreakdown scores={mockScores} totalScore={0.82} />);
    expect(screen.getByText('32/40')).toBeDefined();
    expect(screen.getByText('22/25')).toBeDefined();
    expect(screen.getByText('16/20')).toBeDefined();
    expect(screen.getByText('8/10')).toBeDefined();
    expect(screen.getByText('4/5')).toBeDefined();
  });

  it('should render zero scores', () => {
    const zeroScores = {
      functional_correctness: 0,
      integration_quality: 0,
      regression_safety: 0,
      minimality: 0,
      process_quality: 0
    };
    render(<ScoreBreakdown scores={zeroScores} totalScore={0} />);
    expect(screen.getByText('0.0%')).toBeDefined();
  });

  it('should render perfect scores', () => {
    const perfectScores = {
      functional_correctness: 40,
      integration_quality: 25,
      regression_safety: 20,
      minimality: 10,
      process_quality: 5
    };
    render(<ScoreBreakdown scores={perfectScores} totalScore={1} />);
    expect(screen.getByText('100.0%')).toBeDefined();
  });
});