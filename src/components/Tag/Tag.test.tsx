import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('is static text without href/onClick', () => {
    render(<Tag>Food</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Food').tagName).toBe('SPAN');
  });

  it('exposes pressed state on buttons', () => {
    render(<Tag onClick={() => {}} selected>Food</Tag>);
    expect(screen.getByRole('button', { name: 'Food' })).toHaveAttribute('aria-pressed', 'true');
  });
});
