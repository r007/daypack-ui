import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor by default', () => {
    render(<Link href="/a">Go</Link>);
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/a');
  });

  it('can render a custom component (router integration)', () => {
    const Custom = ({ to, children, ...rest }: { to: string; children: React.ReactNode; className?: string }) => (
      <a data-custom href={to} {...rest}>{children}</a>
    );
    render(<Link as={Custom} to="/b" variant="blue">Go</Link>);
    const el = screen.getByRole('link', { name: 'Go' });
    expect(el).toHaveAttribute('data-custom');
    expect(el).toHaveAttribute('href', '/b');
    expect(el.className).not.toBe('');
  });
});
