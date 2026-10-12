import { render, screen } from '@testing-library/react';
import { Rating } from './Rating';

describe('Rating', () => {
  it('shows text by default', () => {
    render(<Rating amount={4.5} description="Excellent" />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText(/Excellent/)).toHaveTextContent('out of 5');
  });

  it('shows an accessible icon in icon mode', () => {
    render(<Rating amount={3.5} icon />);
    expect(screen.getByRole('img', { name: '3.5 rating' })).toBeInTheDocument();
  });

  it('falls back to text for values without an icon', () => {
    render(<Rating amount={3.7} icon />);
    expect(screen.getByText('3.7')).toBeInTheDocument();
  });

  it('treats 0 as a real rating', () => {
    render(<Rating amount={0} icon />);
    expect(screen.getByRole('img', { name: '0 rating' })).toBeInTheDocument();
  });
});
