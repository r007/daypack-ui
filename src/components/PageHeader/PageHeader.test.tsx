import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageHeader } from './PageHeader';
import { SectionHeader } from '../SectionHeader';
import { IconButton } from '../IconButton';
import { MoreLink } from '../MoreLink';
import { DotLoader, Spinner } from '../Loader';
import { EmptyState } from '../EmptyState';
import { NumberList } from '../NumberList';
import { Banner } from '../Banner';
import { Timestamp, LastUpdated, formatRelative } from '../Timestamp';
import { TagList } from '../TagList';
import { Tag } from '../Tag';
import { BookmarkIcon } from '../Icon/icons';

describe('PageHeader & SectionHeader', () => {
  it('renders one h1 with eyebrow link and strapline', () => {
    render(<PageHeader eyebrow="France" eyebrowHref="/france" heading="Paris" strapline="City of light" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Paris' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'France' })).toHaveAttribute('href', '/france');
    expect(screen.getByText('City of light')).toBeInTheDocument();
  });

  it('SectionHeader keeps the decorative divider out of the accessible name', () => {
    render(<SectionHeader level={3}>Where to stay</SectionHeader>);
    expect(screen.getByRole('heading', { level: 3, name: 'Where to stay' })).toBeInTheDocument();
  });
});

describe('IconButton', () => {
  it('is named by label and fires onClick', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<BookmarkIcon />} label="Save to trip" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save to trip' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('exposes toggle state with pressed', () => {
    render(<IconButton icon={<BookmarkIcon />} label="Save" pressed />);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders a link with href', () => {
    render(<IconButton icon={<BookmarkIcon />} label="Open bookmarks" href="/bookmarks" />);
    expect(screen.getByRole('link', { name: 'Open bookmarks' })).toHaveAttribute('href', '/bookmarks');
  });
});

describe('MoreLink', () => {
  it('is a link with href and a button without', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<MoreLink href="/sights">All sights</MoreLink>);
    expect(screen.getByRole('link', { name: 'All sights' })).toBeInTheDocument();
    rerender(<MoreLink onClick={onClick}>Show more</MoreLink>);
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Loaders', () => {
  it('announce a status with a hidden label', () => {
    render(<><DotLoader label="Loading results" /><Spinner /></>);
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    expect(statuses[0]).toHaveTextContent('Loading results');
    expect(screen.getByText('Loading results')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('shows title, hint and action', async () => {
    const reset = vi.fn();
    render(
      <EmptyState title="No matches" action={<MoreLink onClick={reset}>Reset filters</MoreLink>}>
        Try removing a filter.
      </EmptyState>,
    );
    expect(screen.getByRole('heading', { name: 'No matches' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(reset).toHaveBeenCalled();
  });
});

describe('NumberList', () => {
  it('is an ordered list of links', () => {
    render(<NumberList aria-label="Top sights" items={[{ title: 'Louvre', href: '/louvre' }, { title: 'Eiffel Tower' }]} />);
    expect(screen.getByRole('list', { name: 'Top sights' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Louvre' })).toHaveAttribute('href', '/louvre');
  });
});

describe('Banner', () => {
  it('uses status for warnings and alert for errors', () => {
    const { rerender } = render(<Banner>Heads up</Banner>);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
    rerender(<Banner tone="error">Down</Banner>);
    expect(screen.getByRole('alert')).toHaveTextContent('Down');
  });
});

describe('Timestamp', () => {
  const now = new Date('2026-01-20T12:00:00Z');

  it('formats relative time with Intl and keeps a machine-readable value', () => {
    render(<Timestamp date="2026-01-17T12:00:00Z" now={now} />);
    const el = screen.getByText('3 days ago');
    expect(el.tagName).toBe('TIME');
    expect(el).toHaveAttribute('datetime', '2026-01-17T12:00:00.000Z');
  });

  it.each([
    ['2026-01-20T11:59:30Z', '30 seconds ago'],
    ['2026-01-20T10:00:00Z', '2 hours ago'],
    ['2026-01-21T12:00:00Z', 'tomorrow'],
    ['2025-01-20T12:00:00Z', 'last year'],
  ])('relative %s → %s', (iso, text) => {
    expect(formatRelative(new Date(iso), now)).toBe(text);
  });

  it('supports absolute formats and children override', () => {
    const { rerender } = render(<Timestamp date="2026-01-17T12:00:00Z" format="date" locale="en-GB" />);
    expect(screen.getByText(/17 Jan 2026/)).toBeInTheDocument();
    rerender(<Timestamp date="2026-01-17T12:00:00Z">yesterday-ish</Timestamp>);
    expect(screen.getByText('yesterday-ish')).toBeInTheDocument();
  });

  it('LastUpdated links to the edit page', () => {
    render(<LastUpdated date="2026-01-17" editUrl="/edit" />);
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Suggest an edit' })).toHaveAttribute('href', '/edit');
  });
});

describe('TagList', () => {
  const tags = ['Food', 'Art', 'Music', 'Parks', 'Nightlife'].map((t) => <Tag key={t}>{t}</Tag>);

  it('collapses beyond the limit and toggles with aria-expanded', async () => {
    render(<TagList limit={3} aria-label="Topics">{tags}</TagList>);
    expect(screen.getAllByRole('listitem')).toHaveLength(4); // 3 tags + toggle
    expect(screen.queryByText('Parks')).toBeNull();

    const toggle = screen.getByRole('button', { name: 'Show 2 more' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).not.toHaveAttribute('aria-pressed');
    await userEvent.click(toggle);
    expect(screen.getByText('Parks')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show fewer' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows no toggle when everything fits', () => {
    render(<TagList limit={10}>{tags}</TagList>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
