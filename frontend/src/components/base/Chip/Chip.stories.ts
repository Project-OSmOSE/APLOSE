import { Chip, ChipProps } from './Chip.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { BaseColor } from '@/components/base/types';

const meta = {
    title: 'Base/Chip',
    component: Chip,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: {
            control: { type: 'text' },
        },
        color: {
            control: { type: 'radio' },
            options: [ 'default', 'primary', 'warning', 'danger' ] as BaseColor[],
            type: 'BaseColor',
        },
    } satisfies Partial<Record<keyof ChipProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: 'My chip',
        color: 'primary',
    } satisfies ChipProps,
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
