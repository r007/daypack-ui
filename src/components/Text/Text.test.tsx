import { render, screen } from '@testing-library/react';
import { TextHeading, TextSuper, TextBodySmall } from '.';

describe('Text', () => {
  it('TextHeading separates semantic level from visual size', () => {
    render(<TextHeading level={3} size={6}>Title</TextHeading>);
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toBeInTheDocument();
  });

  it('TextSuper is an h1', () => {
    render(<TextSuper>Big</TextSuper>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('paragraph variants render <p> and forward props', () => {
    render(<TextBodySmall data-testid="p">Copy</TextBodySmall>);
    expect(screen.getByTestId('p').tagName).toBe('P');
  });
});
