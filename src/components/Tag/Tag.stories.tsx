import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from './Tag';

const meta = { title: 'Components/Tag', component: Tag, args: { children: 'Street food' } } satisfies Meta<typeof Tag>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {};
export const Link: Story = { args: { href: '#' } };
export const Button: Story = { args: { onClick: fn() } };
export const Selected: Story = { args: { onClick: fn(), selected: true } };
