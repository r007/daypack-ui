import { render, screen } from '@testing-library/react';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the requested semantic level', () => {
    render(<Heading level={3}>Title</Heading>);
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toBeInTheDocument();
  });
});
