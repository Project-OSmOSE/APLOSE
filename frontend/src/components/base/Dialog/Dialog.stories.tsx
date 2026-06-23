import { Dialog } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { type ReactNode } from 'react';


type Props = {
    content: ReactNode,
}
const meta = {
    title: 'Base/Dialog',
    component: ({ content }: Props) => (
        <Dialog.Root open>
            <Dialog.Trigger>
                Open me
            </Dialog.Trigger>
            <Dialog.Portal>
            { content }
            </Dialog.Portal>
        </Dialog.Root>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {} satisfies Partial<Record<keyof Props, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        content: <Dialog.Content>
            <Dialog.Title>Lorem ipsum</Dialog.Title>
            <Dialog.CloseIcon/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Dialog.Content>,
    } satisfies Props,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
