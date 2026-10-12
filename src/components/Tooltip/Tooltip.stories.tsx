import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Popover } from '../Popover';
import { Button } from '../Button';
import { BookmarkIcon } from '../Icon/icons';

const meta = {
  title: 'Overlays/Tooltip & Popover',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: { content: 'Save to your trip', children: <span /> },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'],
    },
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtonTooltip: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        aria-label="Save"
        style={{ background: 'none', border: '1px solid #e4e4e4', borderRadius: 4, cursor: 'pointer', fontSize: 24, padding: 8 }}
      >
        <BookmarkIcon />
      </button>
    </Tooltip>
  ),
};

export const PopoverPanel: Story = {
  render: () => (
    <Popover
      arrow
      content={
        <div style={{ display: 'grid', gap: 8 }}>
          <strong>Share this guide</strong>
          <a href="#copy">Copy link</a>
          <a href="#email">Email</a>
        </div>
      }
    >
      <Button size="small">Share</Button>
    </Popover>
  ),
};

export const FlipsNearEdges: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
      <Tooltip content="Flipped below because it would clip the top of the viewport" placement="top-start">
        <Button size="tiny">Left edge</Button>
      </Tooltip>
      <Tooltip content="Slides left to stay inside the viewport" placement="top-end">
        <Button size="tiny">Right edge</Button>
      </Tooltip>
    </div>
  ),
};
