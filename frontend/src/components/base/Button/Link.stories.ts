import { Link, LinkProps } from './Link.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { BaseColors } from '@/components/base/types';

const meta = {
    title: 'Base/Button/Link',
    component: Link,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        type: {
            control: { type: 'radio' },
            options: [ undefined, 'submit', 'reset' ],
            required: false,
            type: '\'submit\' | \'reset\' | undefined',
        },
        color: {
            control: { type: 'radio' },
            options: BaseColors,
            type: 'BaseColor',
        },
        disabled: {
            control: { type: 'boolean' },
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: 'Test link',
        color: 'default',
        disabled: false,
        to: '/',
    } satisfies LinkProps,
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Primary: Story = { args: { color: 'primary' } satisfies Partial<LinkProps> };

export const Warning: Story = { args: { color: 'warning' } satisfies Partial<LinkProps> };

export const Danger: Story = { args: { color: 'danger' } satisfies Partial<LinkProps> };

export const Success: Story = { args: { color: 'success' } satisfies Partial<LinkProps> };

export const Medium: Story = { args: { color: 'medium' } satisfies Partial<LinkProps> };

export const Dark: Story = { args: { color: 'dark' } satisfies Partial<LinkProps> };

export const DefaultInText: Story = {};

export const PrimaryInText: Story = { args: { color: 'primary', inText: true } satisfies Partial<LinkProps> };

export const WarningInText: Story = { args: { color: 'warning', inText: true } satisfies Partial<LinkProps> };

export const DangerInText: Story = { args: { color: 'danger', inText: true } satisfies Partial<LinkProps> };

export const SuccessInText: Story = { args: { color: 'success', inText: true } satisfies Partial<LinkProps> };

export const MediumInText: Story = { args: { color: 'medium', inText: true } satisfies Partial<LinkProps> };

export const DarkInText: Story = { args: { color: 'dark', inText: true } satisfies Partial<LinkProps> };
