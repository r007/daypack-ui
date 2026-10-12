import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { SectionNav } from '../SectionNav';
import { ListItem, ListItemBody, ListItemTitle } from '../ListItem';
import { Badge } from '../Badge';

describe('Breadcrumbs', () => {
  const items = [{ label: 'Home', href: '/' }, { label: 'France', href: '/france' }, { label: 'Paris' }];

  it('is a labelled navigation landmark with an ordered list', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks the last item as the current page and does not link it', () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText('Paris').closest('[aria-current]');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Paris' })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('can omit microdata', () => {
    const { container } = render(<Breadcrumbs items={items} microdata={false} />);
    expect(container.querySelector('[itemscope]')).toBeNull();
  });
});

describe('SectionNav', () => {
  it('uses real links and flags the current section', () => {
    render(
      <SectionNav
        label="On this page"
        items={[{ label: 'Overview', href: '#overview', current: true }, { label: 'Tips', href: '#tips' }]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Tips' })).not.toHaveAttribute('aria-current');
  });
});

describe('ListItem & Badge', () => {
  it('renders a titled row with a single link', () => {
    render(
      <ListItem as="li">
        <ListItemBody>
          <Badge tone="accent">Top choice</Badge>
          <ListItemTitle href="/louvre">Louvre</ListItemTitle>
        </ListItemBody>
      </ListItem>,
    );
    expect(screen.getByRole('link', { name: 'Louvre' })).toHaveAttribute('href', '/louvre');
    expect(screen.getByText('Top choice')).toBeInTheDocument();
  });
});
