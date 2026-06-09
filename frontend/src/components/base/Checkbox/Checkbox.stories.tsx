import { Field } from '../Field';
import { Form } from '../Form';
import { Checkbox } from './Checkbox';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';

const meta = {
    title: 'Base/Checkbox',
    component: ({ label }: any) => <Form>
        <Field.Root>
            <Field.Label>
                <Checkbox/>
                { label }
            </Field.Label>
        </Field.Root>
    </Form>,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        label: 'Checkbox label',
    },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
