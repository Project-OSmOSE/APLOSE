import { Select, type SelectProps } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { BaseColors } from '@/components/base/types';

const meta = {
    title: 'Base/Select',
    component: Select,
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
        itemName: 'test',
        items: [
            'One',
            'Two',
            'Three',
        ],
        itemToElementLabel: (item: string) => item,
        itemToStringValue: (item: string) => item,
    } satisfies SelectProps<string>,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
