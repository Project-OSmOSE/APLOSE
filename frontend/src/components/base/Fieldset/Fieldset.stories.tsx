import { Field } from '@/components/base/Field';
import { Fieldset } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';

const meta = {
    title: 'Base/Fieldset',
    component: () => (
        <Fieldset.Root>
            <Fieldset.Legend>Billing details</Fieldset.Legend>

            <Field.Root>
                <Field.Label>Company</Field.Label>
                <Field.Control placeholder="Enter company name"/>
            </Field.Root>

            <Field.Root>
                <Field.Label>Tax ID</Field.Label>
                <Field.Control placeholder="Enter fiscal number"/>
            </Field.Root>

        </Fieldset.Root>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
    },
} satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
