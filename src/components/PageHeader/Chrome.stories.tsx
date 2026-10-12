import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { SectionHeader } from '../SectionHeader';
import { Strapline } from '../Strapline';
import { IconButton } from '../IconButton';
import { MoreLink } from '../MoreLink';
import { DotLoader, Spinner } from '../Loader';
import { EmptyState } from '../EmptyState';
import { NumberList, NumberMarker } from '../NumberList';
import { Banner } from '../Banner';
import { LastUpdated, Timestamp } from '../Timestamp';
import { TagList } from '../TagList';
import { Tag } from '../Tag';
import { BookmarkIcon, ShareIcon, PopOutIcon } from '../Icon/icons';

const meta = {
  title: 'Content/Page chrome',
  component: PageHeader,
  args: { heading: 'Paris' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  args: { eyebrow: 'France', eyebrowHref: '#france', heading: 'Paris', strapline: 'City of light, art and very good bread.' },
};

export const HeaderCentered: Story = {
  args: { eyebrow: 'Top choice', heading: 'Hotel Aurora', strapline: 'Boutique hotel in the old town', align: 'center', contained: true },
};

export const Section: Story = {
  render: () => <SectionHeader>Best places to stay</SectionHeader>,
};

export const SectionInverse: Story = {
  render: () => (
    <div style={{ background: '#2c3643', padding: 48 }}>
      <SectionHeader inverse>Night trains of Europe</SectionHeader>
    </div>
  ),
};

export const Taglines: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Strapline>Normal strapline</Strapline>
      <Strapline size="small">Small strapline</Strapline>
      <Strapline size="tiny">Tiny strapline</Strapline>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton icon={<BookmarkIcon />} label="Save" />
      <IconButton icon={<BookmarkIcon />} label="Saved" variant="filled" pressed />
      <IconButton icon={<ShareIcon />} label="Share" variant="filled" size={56} />
      <span style={{ background: '#555', padding: 12 }}>
        <IconButton icon={<PopOutIcon />} label="Expand photo" variant="overlay" size={32} />
      </span>
    </div>
  ),
};

export const Links: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <MoreLink href="#sights">All sights</MoreLink>
      <MoreLink href="#sights" caps size="small">Caps small</MoreLink>
      <MoreLink direction="left" href="#back">Back to Paris</MoreLink>
      <MoreLink direction="down" onClick={() => {}}>Show more</MoreLink>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <DotLoader label="Loading results" />
      <Spinner />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState title="We couldn’t find any matches" action={<MoreLink caps onClick={() => {}}>Reset filters</MoreLink>}>
      Try removing a filter or searching somewhere else.
    </EmptyState>
  ),
};

export const Ranked: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <NumberList
        aria-label="Top sights"
        items={[{ title: 'Louvre Museum', href: '#louvre' }, { title: 'Eiffel Tower', href: '#eiffel' }, { title: 'Sainte-Chapelle' }]}
      />
      <div style={{ display: 'flex', gap: 12, marginTop: 24, background: '#88bde7', padding: 12 }}>
        <NumberMarker value={1} size="xSmall" />
        <NumberMarker value={2} size="small" />
        <NumberMarker value={3} />
        <NumberMarker value={4} size="large" transparent />
      </div>
    </div>
  ),
};

export const Notice: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Banner>Wildfires are affecting parts of the region. <a href="#advice">Read the advice</a>.</Banner>
      <Banner tone="info">Prices include taxes.</Banner>
      <Banner tone="error">Bookings are temporarily unavailable.</Banner>
    </div>
  ),
};

export const Meta_: Story = {
  name: 'Timestamps',
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Timestamp date={Date.now() - 3 * 24 * 3600 * 1000} />
      <Timestamp date="2026-01-17" format="date" />
      <LastUpdated date="2026-01-17" editUrl="#edit" />
    </div>
  ),
};

export const Tags: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <TagList aria-label="Topics" limit={4}>
        {['Food', 'Art', 'Music', 'Parks', 'Nightlife', 'Markets'].map((t) => <Tag key={t} href={`#${t}`}>{t}</Tag>)}
      </TagList>
    </div>
  ),
};
