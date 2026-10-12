import { render, screen } from '@testing-library/react';
import { Price } from './Price';

describe('Price', () => {
  it('formats whole amounts with the currency symbol', () => {
    render(<Price amount={129.6} currency="GBP" />);
    expect(screen.getByText('£130')).toBeInTheDocument();
  });

  it('shows the discounted amount when present', () => {
    render(<Price amount={200} discountedAmount={150} parent="card" />);
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument(); // "was" price
  });

  it('renders rate text', () => {
    render(<Price amount={80} rate="per night" />);
    expect(screen.getByText(/per night/)).toBeInTheDocument();
  });

  it('renders nothing for a zero amount without a rate', () => {
    const { container } = render(<Price amount={0} />);
    expect(container).not.toHaveTextContent('$');
  });
});
