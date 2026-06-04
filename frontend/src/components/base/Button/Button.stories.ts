import { Button } from './Button.tsx';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { BaseColor } from '@/components/base/types';

const meta = {
    title: 'Base/Button/Button',
    component: Button,
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
            options: [ 'default', 'primary', 'warning', 'danger' ] as BaseColor[],
            type: 'BaseColor',
        },
        disabled: {
            control: { type: 'boolean' },
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        onClick: fn(),
        children: 'Test button',
        color: 'default',
        disabled: false,
    },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
