import { Dialog } from '@base-ui/react';
import { Update, type UpdateProps } from './Update.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';


const meta = {
    title: 'features/Label/dialog/Update',
    component: (props: UpdateProps) => (
        <Dialog.Root >
            <Dialog.Trigger>
                Open me
            </Dialog.Trigger>
            <Dialog.Portal>
                <Update { ...props }/>
            </Dialog.Portal>
        </Dialog.Root>
    ),
    parameters: {
        layout: 'padded',
    },
    tags: [ 'autodocs' ],
    args: {
        availableLabels: [
            {
                id: '1',
                name: 'Boat',
            },
            {
                id: '2',
                name: 'Whale',
            },
            {
                id: '3',
                name: 'Dolphin',
            },
        ],
        selected: {
            id: '2',
            name: 'Whale',
        },
        onSelect: fn(),
    } satisfies UpdateProps,
} satisfies Meta<typeof Update>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
