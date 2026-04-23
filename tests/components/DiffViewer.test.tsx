// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiffViewer } from '../../src/components/DiffViewer';

describe('DiffViewer', () => {
  it('should render "No diff available" when diff is empty', () => {
    render(<DiffViewer diff="" />);
    expect(screen.getByText('No diff available for this run.')).toBeDefined();
  });

  it('should render "No diff available" when diff is undefined', () => {
    render(<DiffViewer diff={undefined as unknown as string} />);
    expect(screen.getByText('No diff available for this run.')).toBeDefined();
  });

  it('should render "No changes detected" when diff has no valid files', () => {
    render(<DiffViewer diff="not a valid diff string" />);
    expect(screen.getByText('No changes detected in this run.')).toBeDefined();
  });

  it('should parse and display a simple diff', () => {
    const simpleDiff = `--- a/src/file.ts
+++ b/src/file.ts
@@ -1,3 +1,4 @@
 line 1
+added line
 line 2
 line 3`;
    render(<DiffViewer diff={simpleDiff} />);
    expect(screen.getByText('src/file.ts')).toBeDefined();
  });

  it('should show expand/collapse for files', () => {
    const diffWithMultipleHunks = `--- a/src/file.ts
+++ b/src/file.ts
@@ -1,5 +1,6 @@
 line 1
+added line 1
 line 2
+added line 2
 line 3
@@ -10,5 +11,6 @@
 line 10
+added line 11
 line 11`;
    render(<DiffViewer diff={diffWithMultipleHunks} />);
    expect(screen.getByText('2 hunks, 8 lines')).toBeDefined();
  });
});