import { Field } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { HTMLInputTypeAttribute } from 'react';
import type { FieldControlProps } from '@/components/base/Field/Control';
import type { FieldRootProps } from '@base-ui/react';
import { Magnifer } from '@solar-icons/react';

type Props = Pick<FieldRootProps, 'disabled'>
    & Pick<FieldControlProps, 'type' | 'required' | 'startIcon' | 'placeholder'>
    & { label: string }
const meta = {
    title: 'Base/Field',
    component: ({ disabled, required, label, ...props }: Props) => (
        <Field.Root disabled={ disabled }>
            <Field.Label required={ required }>{ label }</Field.Label>
            <Field.Control required={ required } { ...props }/>

            <Field.Error match="valueMissing">
                Please enter your name
            </Field.Error>
        </Field.Root>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        required: {
            control: { type: 'boolean' },
        },
        disabled: {
            control: { type: 'boolean' },
        },
        type: {
            control: { type: 'radio' },
            options: [ 'text', 'email', 'url', 'password', 'date', 'textarea' ] as HTMLInputTypeAttribute[],
            required: false,
            type: 'HTMLInputTypeAttribute',
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        label: 'Name',
        required: false,
        disabled: false,
        type: 'text',
        placeholder: 'Placeholder',
    } satisfies Props,
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Required: Story = {
    args: {
        required: true,
    } satisfies Partial<Props>,
};

export const Search: Story = {
    args: {
        label: 'Search',
        startIcon: Magnifer,
        placeholder: 'Search something...',
    } satisfies Partial<Props>,
};

export const Password: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: '',
    } satisfies Partial<Props>,
};
