import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { Dialog } from '@/components/base/Dialog/index.ts';
import { ArchiveEmptyConfirmation } from './ArchiveEmptyConfirmation'
import { ArchiveUnfinishedConfirmation } from './ArchiveUnfinishedConfirmation'
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import { Fragment } from 'react';

const meta = {
    title: 'Features/AnnotationCampaign/Dialogs',
    component: () => <Fragment>
        <Dialog.Root>
            <Dialog.Trigger>
                ArchiveEmptyConfirmation
            </Dialog.Trigger>
            <ArchiveEmptyConfirmation onConfirm={ fn }/>
        </Dialog.Root>
        <Dialog.Root>
            <Dialog.Trigger>
                ArchiveUnfinishedConfirmation
            </Dialog.Trigger>
            <ArchiveUnfinishedConfirmation onConfirm={ fn }/>
        </Dialog.Root>
    </Fragment>,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
} satisfies Meta<typeof ArchiveEmptyConfirmation>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
