import { render, screen } from '@testing-library/react';
import { Card, CardActions, CardBody, CardMedia, CardMeta, CardText, CardTitle } from '.';

describe('Card', () => {
  it('exposes one link through the title and a heading of the chosen level', () => {
    render(
      <Card>
        <CardMedia src="/a.jpg" />
        <CardBody>
          <CardTitle href="/paris" level={2}>Paris</CardTitle>
          <CardText>City of light</CardText>
        </CardBody>
      </Card>,
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: 'Paris' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Paris' })).toHaveAttribute('href', '/paris');
  });

  it('is an article and renders decorative media with empty alt', () => {
    const { container } = render(
      <Card>
        <CardMedia src="/a.jpg" />
      </Card>,
    );
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('CardMeta separates items with decorative bullets and skips falsy children', () => {
    const { container } = render(
      <CardMeta>
        {'3 days'}
        {false}
        {'Europe'}
      </CardMeta>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it('keeps secondary controls available', () => {
    render(
      <Card>
        <CardActions><button type="button">Save</button></CardActions>
      </Card>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
