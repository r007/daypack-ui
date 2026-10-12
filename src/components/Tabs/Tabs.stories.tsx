import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { SectionNav } from '../SectionNav';
import { Breadcrumbs } from '../Breadcrumbs';

const meta = { title: 'Navigation/Tabs', component: Tabs, parameters: { layout: 'padded' } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ maxWidth: 720 }}>
      <TabList aria-label="Destination sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="things">Things to do</Tab>
        <Tab value="tips">Tips</Tab>
      </TabList>
      <TabPanel value="overview"><p>Overview content.</p></TabPanel>
      <TabPanel value="things"><p>Things to do content.</p></TabPanel>
      <TabPanel value="tips"><p>Tips content.</p></TabPanel>
    </Tabs>
  ),
};

export const SectionNavigation: Story = {
  name: 'SectionNav',
  render: () => (
    <SectionNav
      label="On this page"
      items={[
        { label: 'Overview', href: '#overview', current: true },
        { label: 'Things to do', href: '#things' },
        { label: 'Practical information', href: '#practical' },
        { label: 'Getting there', href: '#getting-there' },
      ]}
    />
  ),
};

export const BreadcrumbTrail: Story = {
  name: 'Breadcrumbs',
  render: () => (
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'France', href: '/france' }, { label: 'Paris' }]} />
  ),
};
