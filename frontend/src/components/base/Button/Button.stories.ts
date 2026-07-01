import { Button, ButtonProps } from './Button.tsx';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { BaseColors } from '@/components/base/types';

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
            options: BaseColors,
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
    } satisfies ButtonProps,
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Primary: Story = { args: { color: 'primary' } satisfies Partial<ButtonProps> };

export const Warning: Story = { args: { color: 'warning' } satisfies Partial<ButtonProps> };

export const Danger: Story = { args: { color: 'danger' } satisfies Partial<ButtonProps> };

export const Success: Story = { args: { color: 'success' } satisfies Partial<ButtonProps> };

export const Medium: Story = { args: { color: 'medium' } satisfies Partial<ButtonProps> };

export const Dark: Story = { args: { color: 'dark' } satisfies Partial<ButtonProps> };

export const Annotation0: Story = { args: { color: undefined, annotationColorIndex: 0 } satisfies Partial<ButtonProps> };
export const Annotation1: Story = { args: { color: undefined, annotationColorIndex: 1 } satisfies Partial<ButtonProps> };
export const Annotation2: Story = { args: { color: undefined, annotationColorIndex: 2 } satisfies Partial<ButtonProps> };
export const Annotation3: Story = { args: { color: undefined, annotationColorIndex: 3 } satisfies Partial<ButtonProps> };
export const Annotation4: Story = { args: { color: undefined, annotationColorIndex: 4 } satisfies Partial<ButtonProps> };
export const Annotation5: Story = { args: { color: undefined, annotationColorIndex: 5 } satisfies Partial<ButtonProps> };
export const Annotation6: Story = { args: { color: undefined, annotationColorIndex: 6 } satisfies Partial<ButtonProps> };
export const Annotation7: Story = { args: { color: undefined, annotationColorIndex: 7 } satisfies Partial<ButtonProps> };
export const Annotation8: Story = { args: { color: undefined, annotationColorIndex: 8 } satisfies Partial<ButtonProps> };
export const Annotation9: Story = { args: { color: undefined, annotationColorIndex: 9 } satisfies Partial<ButtonProps> };
