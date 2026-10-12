import { render } from '@testing-library/react';
import { Bullet } from './Bullet';

describe('Bullet', () => {
  it('is decorative', () => {
    const { container } = render(<Bullet space="both" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.textContent).toBe(' • ');
  });
});
