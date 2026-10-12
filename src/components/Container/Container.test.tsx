import { render, screen } from '@testing-library/react';
import { Container } from './Container';
import { VisuallyHidden } from '../VisuallyHidden';
import { Lede } from '../Lede';

describe('layout & misc primitives', () => {
  it('Container forwards props', () => {
    render(<Container id="page">content</Container>);
    expect(screen.getByText('content')).toHaveAttribute('id', 'page');
  });

  it('VisuallyHidden keeps text in the accessibility tree', () => {
    render(<VisuallyHidden>Skip</VisuallyHidden>);
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('Lede wraps text in a paragraph', () => {
    render(<Lede>Intro</Lede>);
    expect(screen.getByText('Intro').tagName).toBe('P');
  });
});
