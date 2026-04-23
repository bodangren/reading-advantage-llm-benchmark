// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestResultsTable } from '../../src/components/TestResultsTable';
import { fireEvent } from '@testing-library/dom';

describe('TestResultsTable', () => {
  it('should render "No test results" when empty', () => {
    render(<TestResultsTable testResults={[]} />);
    expect(screen.getByText('No test results available for this run.')).toBeDefined();
  });

  it('should render "No test results" when undefined', () => {
    render(<TestResultsTable testResults={undefined as unknown as []} />);
    expect(screen.getByText('No test results available for this run.')).toBeDefined();
  });

  it('should show pass/fail counts', () => {
    const results = [
      { suite: 'unit', name: 'test 1', status: 'pass' as const },
      { suite: 'unit', name: 'test 2', status: 'fail' as const },
      { suite: 'unit', name: 'test 3', status: 'pass' as const },
    ];
    render(<TestResultsTable testResults={results} />);
    expect(screen.getByText('2 passed')).toBeDefined();
    expect(screen.getByText('1 failed')).toBeDefined();
  });

  it('should group tests by suite', () => {
    const results = [
      { suite: 'unit', name: 'test 1', status: 'pass' as const },
      { suite: 'integration', name: 'test 2', status: 'pass' as const },
      { suite: 'unit', name: 'test 3', status: 'pass' as const },
    ];
    render(<TestResultsTable testResults={results} />);
    expect(screen.getByText('unit')).toBeDefined();
    expect(screen.getByText('integration')).toBeDefined();
  });

  it('should show pass badge for passing tests', () => {
    const results = [
      { suite: 'unit', name: 'test 1', status: 'pass' as const },
    ];
    render(<TestResultsTable testResults={results} />);
    expect(screen.getByText('1 pass')).toBeDefined();
  });

  it('should show skip badge for skipped tests', () => {
    const results = [
      { suite: 'unit', name: 'test 1', status: 'skip' as const },
    ];
    render(<TestResultsTable testResults={results} />);
    expect(screen.getByText('1 skip')).toBeDefined();
  });

  it('should display error messages for failed tests', () => {
    const results = [
      { suite: 'unit', name: 'failing test', status: 'fail' as const, error_message: 'Expected true to be false' },
    ];
    render(<TestResultsTable testResults={results} />);
    const row = screen.getByText('unit').closest('tr');
    if (row) {
      fireEvent.click(row);
    }
    expect(screen.getByText('Expected true to be false')).toBeDefined();
  });
});