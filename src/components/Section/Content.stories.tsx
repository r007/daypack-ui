import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section } from './Section';
import { Prose } from '../Prose';
import { Byline } from '../Byline';
import { Disclosure } from '../Disclosure';
import { ReadMore } from '../ReadMore';
import { Callout, IconCallout, IconCalloutGroup } from '../Callout';
import { Pagination } from '../Pagination';
import { PriceRange } from '../PriceRange';
import { AmenityList } from '../AmenityList';
import { ContactBar } from '../ContactBar';
import { ProfileHeader } from '../ProfileHeader';
import { NewsletterSignup } from '../NewsletterSignup';
import { Stepper } from '../Stepper';
import { SegmentedControl } from '../SegmentedControl';
import { BulletList, DisclaimerText, EditLink, TextBubble } from '../TextUtilities';
import { MoreLink } from '../MoreLink';
import { Price } from '../Price';
import { GlobeIcon, CompassIcon, BookmarkIcon, ClockIcon, MapIcon, ListIcon } from '../Icon/icons';
import { art } from '../../stories/assets';

const meta = {
  title: 'Content/Blocks',
  component: Section,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {
  render: () => (
    <div>
      <Section title="Top sights" action={<MoreLink href="#all">All sights</MoreLink>} border="bottom">
        <p>Section content goes here.</p>
      </Section>
      <Section title="Practical information" level={3} spacing="compact" border="top">
        <AmenityList items={['Free Wi-Fi', 'Breakfast included', 'Pool', 'Airport shuttle', 'Pets welcome']} columns={3} />
      </Section>
    </div>
  ),
};

export const Article: Story = {
  render: () => (
    <article style={{ maxWidth: 680 }}>
      <Byline name="Alex Butler" href="#alex" role="Destination editor" avatar={art(200, 80, 80)} date="2026-01-17" />
      <Prose>
        <p>Paris rewards slow walking. Start at the river, follow the quays east and let the day happen.</p>
        <h2>Where to eat</h2>
        <p>Look for a <a href="#bistro">neighbourhood bistro</a> with a short, handwritten menu.</p>
        <ul><li>Lunch menus are the best value</li><li>Book ahead on weekends</li></ul>
        <blockquote>The city is a book you read with your feet.</blockquote>
      </Prose>
    </article>
  ),
};

export const Collapsing: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Disclosure title="Filters" filled>
        <p>Price, rating and distance filters.</p>
      </Disclosure>
      <hr />
      <ReadMore maxLines={2}>
        Alex has lived in four countries and written about all of them. Their work focuses on slow travel, regional food and the small, local details that make a place feel like itself, and they still carry a notebook everywhere.
      </ReadMore>
    </div>
  ),
};

export const Callouts: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 760 }}>
      <Callout
        image={art(190, 600, 400)}
        category="Activity"
        title="Sunset kayak tour"
        href="#kayak"
        description="Paddle the harbour at golden hour with a local guide."
        footer={<Price amount={59} rate="per person" />}
      />
      <IconCalloutGroup aria-label="Why book with us">
        <IconCallout icon={<GlobeIcon />} title="Worldwide">Thousands of destinations.</IconCallout>
        <IconCallout icon={<CompassIcon />} title="Expert guides" href="#guides">Written by locals.</IconCallout>
        <IconCallout icon={<ClockIcon />} title="Always current">Updated continually.</IconCallout>
      </IconCalloutGroup>
    </div>
  ),
};

export const Paging: Story = {
  render: function Render() {
    const [page, setPage] = React.useState(7);
    return <Pagination page={page} pageCount={24} onPageChange={setPage} />;
  },
};

export const PlaceDetails: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div><PriceRange value={2} /> <BulletList items={['Museum', 'Paris', 'Open daily']} style={{ display: 'inline-flex' }} /></div>
      <ContactBar phone="+33 1 40 20 50 50" website="https://example.com" directions="Rue de Rivoli, Paris" />
      <ProfileHeader
        name="Alex Butler"
        avatarSrc={art(30, 200, 200)}
        location="Lisbon, Portugal"
        website="https://www.example.com/"
        intro="Alex has lived in four countries and written about all of them. They focus on slow travel and regional food."
        interests={['Food', 'Hiking', 'Rail travel', 'Markets', 'Architecture', 'Photography', 'Wine']}
        interestsLimit={4}
      />
    </div>
  ),
};

export const Forms: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 640 }}>
      <NewsletterSignup
        title="Get inspired"
        subtitle="Travel ideas in your inbox every week."
        consentLabel="I agree to receive marketing emails"
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 600))}
      />
      <Stepper current={1} steps={[{ label: 'Details', description: 'Who is travelling' }, { label: 'Payment' }, { label: 'Confirm' }]} />
      <SegmentedControl
        label="View"
        options={[
          { value: 'list', label: 'List', icon: <ListIcon /> },
          { value: 'map', label: 'Map', icon: <MapIcon /> },
          { value: 'saved', label: 'Saved', icon: <BookmarkIcon /> },
        ]}
      />
    </div>
  ),
};

export const SmallPrint: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <DisclaimerText>By signing up you agree to our <a href="#terms">terms</a> and <a href="#privacy">privacy policy</a>.</DisclaimerText>
      <EditLink href="#edit" />
      <TextBubble>Book restaurants a week ahead in summer.</TextBubble>
    </div>
  ),
};
