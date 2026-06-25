import { Toggle } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';

type Props = {
    value?: string
    options: Array<string>
}
const meta = {
    title: 'Base/Toggle',
    component: ({ options, value }: Props) => (
        <Toggle.Group defaultValue={ [ options[0] ] } value={ value }>
            { options.map((o, k) => <Toggle.Item key={ k } color={ k == 0 ? 'medium' : 'primary' }
                                                 value={ o }>{ o }</Toggle.Item>) }
        </Toggle.Group>
    ),
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
        options: [ 'no', 'maybe', 'yes' ],
    } satisfies Props,
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const No: Story = {
    args: { value: 'no' } as Partial<Props>
};

export const Maybe: Story = {
    args: { value: 'maybe' } as Partial<Props>
};

export const Yes: Story = {
    args: { value: 'yes' } as Partial<Props>
};
