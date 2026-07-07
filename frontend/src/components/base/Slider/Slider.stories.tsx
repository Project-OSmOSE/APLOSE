import { Slider, type SliderProps } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { BaseColors } from '@/components/base/types';

const meta = {
    title: 'Base/Slider',
    component: Slider,
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
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        label: 'Some slider',
        defaultValue: 25,
        displayValue: true,
    } satisfies SliderProps,
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const NoLabel: Story = {
    args: { label: undefined } satisfies Partial<SliderProps>,
};

export const Vertical: Story = {
    args: {
        label: undefined,
        displayValue: false,
        orientation: 'vertical'
    } satisfies Partial<SliderProps>,
};
