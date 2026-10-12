import { render, screen } from '@testing-library/react';
import { Icon, ArrowLeftIcon, ChevronDownIcon } from '.';

describe('Icon', () => {
  it('is hidden from assistive tech without a label', () => {
    const { container } = render(<ArrowLeftIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes an accessible name when labelled', () => {
    render(<ChevronDownIcon label="Expand" />);
    expect(screen.getByRole('img', { name: 'Expand' })).toBeInTheDocument();
  });

  it('squares the icon when only one dimension is set', () => {
    const { container } = render(<Icon width={24}><path d="M0 0" /></Icon>);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg.style.width).toBe('24px');
    expect(svg.style.height).toBe('24px');
  });
});
