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
        color: 'default',
    } satisfies ChipProps,
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Primary: Story = { args: { color: 'primary' } satisfies Partial<ChipProps> };

export const Warning: Story = { args: { color: 'warning' } satisfies Partial<ChipProps> };

export const Danger: Story = { args: { color: 'danger' } satisfies Partial<ChipProps> };

export const Success: Story = { args: { color: 'success' } satisfies Partial<ChipProps> };

export const Medium: Story = { args: { color: 'medium' } satisfies Partial<ChipProps> };

export const Annotation0: Story = { args: { color: undefined, annotationColorIndex: 0 } satisfies Partial<ChipProps> };
export const Annotation1: Story = { args: { color: undefined, annotationColorIndex: 1 } satisfies Partial<ChipProps> };
export const Annotation2: Story = { args: { color: undefined, annotationColorIndex: 2 } satisfies Partial<ChipProps> };
export const Annotation3: Story = { args: { color: undefined, annotationColorIndex: 3 } satisfies Partial<ChipProps> };
export const Annotation4: Story = { args: { color: undefined, annotationColorIndex: 4 } satisfies Partial<ChipProps> };
export const Annotation5: Story = { args: { color: undefined, annotationColorIndex: 5 } satisfies Partial<ChipProps> };
export const Annotation6: Story = { args: { color: undefined, annotationColorIndex: 6 } satisfies Partial<ChipProps> };
export const Annotation7: Story = { args: { color: undefined, annotationColorIndex: 7 } satisfies Partial<ChipProps> };
export const Annotation8: Story = { args: { color: undefined, annotationColorIndex: 8 } satisfies Partial<ChipProps> };
export const Annotation9: Story = { args: { color: undefined, annotationColorIndex: 9 } satisfies Partial<ChipProps> };
