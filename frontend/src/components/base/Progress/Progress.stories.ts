import { Progress, type ProgressProps } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { BaseColor } from '@/components/base/types';

const meta = {
    title: 'Base/Progress',
    component: Progress,
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
            options: [ 'default', 'primary', 'warning', 'danger' ] as BaseColor[],
            type: 'BaseColor',
        },
        children: {
            control: { type: 'text' },
        },
        max: {
            control: { type: 'number' },
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: 'Test badge',
        value: 20,
        max: undefined,
        color: 'default',
        disabled: false,
    } satisfies ProgressProps,
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
