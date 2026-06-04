import { Field } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';

const meta = {
    title: 'Base/Field',
    component: ({ required, disabled }: { required: boolean, disabled: boolean }) => (
        <Field.Root disabled={ disabled }>
            <Field.Label required={ required }>Name</Field.Label>
            <Field.Control required={ required } placeholder="Placeholder"/>

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
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        required: false,
        disabled: false,
    },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
