import { Dialog } from '@base-ui/react';
import { UpdateLabelDialogContent, type UpdateProps } from './UpdateLabelDialogContent.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';


const meta = {
    title: 'features/Label/dialog/UpdateLabelDialogContent',
    component: (props: UpdateProps) => (
        <Dialog.Root >
            <Dialog.Trigger>
                Open me
            </Dialog.Trigger>
            <Dialog.Portal>
                <UpdateLabelDialogContent { ...props }/>
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
                displayName: 'Boat',
            },
            {
                id: '2',
                displayName: 'Whale',
            },
            {
                id: '3',
                displayName: 'Dolphin',
            },
        ],
        selectedID: '2',
        onSelectID: fn(),
    } satisfies UpdateProps,
} satisfies Meta<typeof UpdateLabelDialogContent>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
