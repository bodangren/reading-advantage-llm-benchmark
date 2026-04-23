// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArtifactLinks } from '../../src/components/ArtifactLinks';

describe('ArtifactLinks', () => {
  it('should render "No artifacts" when empty', () => {
    render(<ArtifactLinks artifacts={[]} />);
    expect(screen.getByText('No artifacts available for this run.')).toBeDefined();
  });

  it('should render "No artifacts" when undefined', () => {
    render(<ArtifactLinks artifacts={undefined as unknown as []} />);
    expect(screen.getByText('No artifacts available for this run.')).toBeDefined();
  });

  it('should display artifact names', () => {
    const artifacts = [
      { name: 'run_log.txt', type: 'log' as const, url: '/artifacts/log.txt', size_bytes: 45678 },
      { name: 'coverage.html', type: 'report' as const, url: '/artifacts/coverage.html', size_bytes: 123456 },
    ];
    render(<ArtifactLinks artifacts={artifacts} />);
    expect(screen.getByText('run_log.txt')).toBeDefined();
    expect(screen.getByText('coverage.html')).toBeDefined();
  });

  it('should display download links', () => {
    const artifacts = [
      { name: 'run_log.txt', type: 'log' as const, url: '/artifacts/log.txt', size_bytes: 45678 },
    ];
    render(<ArtifactLinks artifacts={artifacts} />);
    const downloadLink = screen.getByRole('link', { name: /download/i }) as HTMLAnchorElement;
    expect(downloadLink.href).toContain('/artifacts/log.txt');
  });

  it('should format bytes correctly', () => {
    const artifacts = [
      { name: 'small.txt', type: 'log' as const, url: '/artifacts/small.txt', size_bytes: 512 },
      { name: 'large.txt', type: 'log' as const, url: '/artifacts/large.txt', size_bytes: 1048576 },
    ];
    render(<ArtifactLinks artifacts={artifacts} />);
    expect(screen.getByText('512 B')).toBeDefined();
    expect(screen.getByText('1 MB')).toBeDefined();
  });

  it('should display artifact types', () => {
    const artifacts = [
      { name: 'log.txt', type: 'log' as const, url: '/artifacts/log.txt' },
      { name: 'screenshot.png', type: 'screenshot' as const, url: '/artifacts/screenshot.png' },
      { name: 'report.html', type: 'report' as const, url: '/artifacts/report.html' },
      { name: 'other.bin', type: 'other' as const, url: '/artifacts/other.bin' },
    ];
    render(<ArtifactLinks artifacts={artifacts} />);
    expect(screen.getAllByText('log').length).toBeGreaterThan(0);
    expect(screen.getAllByText('screenshot').length).toBeGreaterThan(0);
    expect(screen.getAllByText('report').length).toBeGreaterThan(0);
    expect(screen.getAllByText('other').length).toBeGreaterThan(0);
  });
});