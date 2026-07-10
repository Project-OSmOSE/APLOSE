import { Badge, type BadgeProps } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { BaseColors } from '@/components/base/types';

const meta = {
    title: 'Base/Badge',
    component: Badge,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: BaseColors,
            type: 'BaseColor',
        },
        children: {
            control: { type: 'text' },
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: 'Test badge',
        color: 'medium',
    } satisfies BadgeProps,
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = { args: { color: 'primary' } satisfies Partial<BadgeProps> };

export const Success: Story = { args: { color: 'success' } satisfies Partial<BadgeProps> };

export const Warning: Story = { args: { color: 'warning' } satisfies Partial<BadgeProps> };

export const Danger: Story = { args: { color: 'danger' } satisfies Partial<BadgeProps> };

export const Light: Story = { args: { color: 'light' } satisfies Partial<BadgeProps> };

export const Medium: Story = { args: { color: 'medium' } satisfies Partial<BadgeProps> };

export const Dark: Story = { args: { color: 'dark' } satisfies Partial<BadgeProps> };
