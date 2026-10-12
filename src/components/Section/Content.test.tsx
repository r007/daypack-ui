import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Section } from './Section';
import { Prose } from '../Prose';
import { Byline } from '../Byline';
import { Disclosure } from '../Disclosure';
import { ReadMore } from '../ReadMore';
import { Callout, IconCallout, IconCalloutGroup } from '../Callout';
import { Pagination, getPageItems } from '../Pagination';
import { PriceRange } from '../PriceRange';
import { AmenityList } from '../AmenityList';
import { ContactBar } from '../ContactBar';
import { ProfileHeader } from '../ProfileHeader';
import { NewsletterSignup } from '../NewsletterSignup';
import { Stepper } from '../Stepper';
import { SegmentedControl } from '../SegmentedControl';
import { BulletList, DisclaimerText, EditLink, TextBubble } from '../TextUtilities';

describe('Section / Prose / Byline', () => {
  it('Section renders a headed region with an action', () => {
    render(<Section title="Top sights" action={<a href="/all">All</a>}>Body</Section>);
    expect(screen.getByRole('region', { name: 'Top sights' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Top sights' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
  });

  it('Prose renders children or trusted html', () => {
    const { rerender, container } = render(<Prose><p>Hello</p></Prose>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    rerender(<Prose html="<p><strong>Bold</strong> text</p>" />);
    expect(container.querySelector('strong')).toHaveTextContent('Bold');
  });

  it('Byline links the author and formats the date', () => {
    render(<Byline name="Alex Butler" href="/authors/alex" role="Editor" date="2026-01-17T12:00:00Z" dateFormat="date" />);
    expect(screen.getByRole('link', { name: 'Alex Butler' })).toHaveAttribute('rel', 'author');
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(document.querySelector('time')).toHaveAttribute('datetime', '2026-01-17T12:00:00.000Z');
  });
});

describe('Disclosure / ReadMore', () => {
  it('Disclosure toggles aria-expanded', async () => {
    render(<Disclosure title="Filters" defaultOpen={false}>Panel</Disclosure>);
    const toggle = screen.getByRole('button', { name: 'Filters' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Filters' })).toBeInTheDocument();
  });

  it('ReadMore shows its toggle only when text overflows', async () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200);
    const client = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(60);
    render(<ReadMore maxLines={2}>A long biography.</ReadMore>);
    const toggle = await screen.findByRole('button', { name: 'Read more' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
    spy.mockRestore();
    client.mockRestore();
  });

  it('ReadMore has no toggle when the text fits', () => {
    render(<ReadMore>Short.</ReadMore>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Callouts', () => {
  it('Callout is an article with one link', () => {
    render(<Callout title="Kayak tour" href="/kayak" category="Activity" description="Paddle." image="/k.jpg" />);
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Kayak tour' })).toHaveAttribute('href', '/kayak');
  });

  it('IconCalloutGroup is a list of titled items', () => {
    render(
      <IconCalloutGroup aria-label="Why us">
        <IconCallout icon={<span>★</span>} title="Trusted">Reviewed.</IconCallout>
        <IconCallout icon={<span>★</span>} title="Worldwide" href="/world">Everywhere.</IconCallout>
      </IconCalloutGroup>,
    );
    expect(screen.getByRole('list', { name: 'Why us' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Worldwide' })).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  it.each([
    [1, 5, [1, 2, 3, 4, 5]],
    [1, 20, [1, 2, 3, 4, 5, 'ellipsis-end', 20]],
    [10, 20, [1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]],
    [20, 20, [1, 'ellipsis-start', 16, 17, 18, 19, 20]],
  ])('getPageItems(%i of %i)', (page, count, expected) => {
    expect(getPageItems(page as number, count as number)).toEqual(expected);
  });

  it('marks the current page, disables prev on the first page and reports changes', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={8} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('renders real links with getHref', () => {
    render(<Pagination page={2} pageCount={4} getHref={(p) => `/guides?page=${p}`} />);
    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '/guides?page=3');
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute('href', '/guides?page=1');
  });
});

describe('Place details', () => {
  it('PriceRange announces its tier', () => {
    render(<PriceRange value={2} />);
    expect(screen.getByText('Price range: 2 out of 3')).toBeInTheDocument();
  });

  it('AmenityList lists items', () => {
    render(<AmenityList items={['Free Wi-Fi', 'Pool']} aria-label="Amenities" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('ContactBar builds tel, website and directions links', () => {
    render(<ContactBar phone="+33 1 40 20 50 50" website="https://louvre.fr" directions={[48.86, 2.33]} />);
    expect(screen.getByRole('link', { name: 'Call +33 1 40 20 50 50' })).toHaveAttribute('href', 'tel:+33140205050');
    expect(screen.getByRole('link', { name: 'Website' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'Directions' }).getAttribute('href')).toContain('destination=48.86%2C2.33');
  });

  it('ProfileHeader renders name, links and interests', () => {
    render(<ProfileHeader name="Alex Butler" location="Lisbon" website="https://www.alex.example/" interests={['Food', 'Hiking']} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Alex Butler' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'alex.example' })).toHaveAttribute('href', 'https://www.alex.example/');
    expect(screen.getByRole('list', { name: 'Interests' })).toBeInTheDocument();
  });
});

describe('NewsletterSignup', () => {
  it('submits the email and shows the confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<NewsletterSignup title="Get inspired" onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com', consent: false });
    expect(await screen.findByRole('status')).toHaveTextContent('Thanks for signing up');
  });

  it('shows the error and keeps the form on failure', async () => {
    render(<NewsletterSignup onSubmit={() => Promise.reject(new Error('Already subscribed'))} />);
    await userEvent.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Already subscribed'));
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true');
  });

  it('requires consent when a consent label is given', async () => {
    const onSubmit = vi.fn();
    render(<NewsletterSignup onSubmit={onSubmit} consentLabel="I agree" />);
    await userEvent.type(screen.getByLabelText('Email address'), 'ada@example.com');
    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeRequired();
  });
});

describe('Stepper / SegmentedControl / text utilities', () => {
  it('Stepper marks completed and current steps', () => {
    render(<Stepper current={1} steps={[{ label: 'Details' }, { label: 'Payment' }, { label: 'Confirm' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('(completed)')).toBeInTheDocument();
    expect(screen.getByText('(current step)')).toBeInTheDocument();
  });

  it('SegmentedControl is a radio group with arrow-key navigation', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl label="View" options={[{ value: 'list', label: 'List' }, { value: 'map', label: 'Map' }]} onValueChange={onValueChange} />);
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Map' }));
    expect(onValueChange).toHaveBeenCalledWith('map');
    expect(screen.getByRole('radio', { name: 'Map' })).toBeChecked();
  });

  it('text utilities render', () => {
    render(
      <>
        <DisclaimerText>Small print</DisclaimerText>
        <EditLink href="/edit" />
        <BulletList items={['Museum', false, 'Paris']} aria-label="Facts" />
        <TextBubble>Tip</TextBubble>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Suggest an edit' })).toHaveAttribute('href', '/edit');
    expect(screen.getByRole('list', { name: 'Facts' }).querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });
});
