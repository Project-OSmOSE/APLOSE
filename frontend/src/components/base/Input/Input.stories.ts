import { Input, InputProps } from './Input.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { HTMLInputTypeAttribute } from 'react';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import { Magnifer } from '@solar-icons/react';

const meta = {
    title: 'Base/Input',
    component: Input,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        disabled: {
            control: { type: 'boolean' },
        },
        type: {
            control: { type: 'radio' },
            options: [ 'text', 'email', 'url', 'password', 'date', 'textarea' ] as HTMLInputTypeAttribute[],
            required: false,
            type: 'HTMLInputTypeAttribute',
        },
    } satisfies Partial<Record<keyof InputProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        type: 'text',
        placeholder: 'Write something',
        disabled: false,
        onChange: fn(),
        onInput: fn(),
    } satisfies InputProps,
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Textarea: Story = {
    args: {
        type: 'textarea',
    } satisfies Partial<InputProps>,
};

export const Date: Story = {
    args: {
        type: 'date',
    } satisfies Partial<InputProps>,
};

export const Password: Story = {
    args: {
        type: 'password',
    } satisfies Partial<InputProps>,
};

export const StartIcon: Story = {
    args: {
        startIcon: Magnifer,
    } satisfies Partial<InputProps>,
};
