// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MethodologyPage from '@/app/methodology/page';

describe('Methodology Page', () => {
  it('renders the page title', async () => {
    render(await MethodologyPage());
    expect(screen.getByText('Methodology')).toBeDefined();
  });

  it('does not render its own header - should use shared Header from layout', async () => {
    const { container } = render(await MethodologyPage());
    const pageHeader = container.querySelector('header');
    expect(pageHeader).toBeNull();
  });

  it('renders benchmark philosophy section', async () => {
    render(await MethodologyPage());
    expect(screen.getByText('Benchmark Philosophy')).toBeDefined();
    expect(screen.getByText(/brownfield engineering capability/i)).toBeDefined();
  });
});